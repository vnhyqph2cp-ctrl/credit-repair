// lib/mfsn-normalizer.ts

export type Bureau = "TU" | "EQF" | "EXP";

export type Extracted3BStandard = {
  personal_info: {
    names: Array<{
      bureau: Bureau;
      name_type: string; // Primary / AKA / etc
      first?: string;
      middle?: string;
      last?: string;
      raw?: any;
      source?: any;
    }>;
    addresses: Array<{
      bureau: Bureau;
      kind: "current" | "previous";
      date_reported?: string;
      raw: any;
      source?: any;
    }>;
    employers: Array<{
      bureau: Bureau;
      name?: string;
      date_reported?: string;
      date_updated?: string;
      raw: any;
      source?: any;
    }>;
    dob: Array<{
      bureau: Bureau;
      date?: string;
      raw: any;
      source?: any;
    }>;
    credit_statements: Array<{
      bureau: Bureau;
      statement: string;
      raw: any;
      source?: any;
    }>;
    fraud_flags: {
      fraud_indicator?: boolean;
      deceased_indicator?: boolean;
      sb168_frozen?: { equifax?: boolean; experian?: boolean; transunion?: boolean };
      raw?: any;
    };
  };

  accounts: Array<{
    id: string; // stable-ish key: bureau + subscriber + acct hash-like
    bureau: Bureau;
    account_type: string; // Revolving / Mortgage / Installment / Collection / etc
    creditor_name?: string;
    account_number_masked?: string;
    date_opened?: string;
    date_reported?: string;
    date_closed?: string;
    current_balance?: number | null;
    high_balance?: number | null;
    credit_limit?: number | null;
    pay_status?: string;
    account_condition?: string;
    open_closed?: string;
    remarks?: string[];
    late_30?: number | null;
    late_60?: number | null;
    late_90?: number | null;
    worst_pay_status?: string;
    raw: any;
  }>;

  negative_items: Array<{
    id: string;
    bureau: Bureau;
    category: "collection" | "chargeoff" | "derogatory" | "late" | "public_record" | "bankruptcy" | "fraud_alert" | "other";
    creditor_name?: string;
    reason: string;
    raw: any;
  }>;

  disputable_items: Array<{
    id: string;
    bureau: Bureau;
    category: "personal_info" | "tradeline" | "collection" | "public_record" | "inquiry";
    reason: string;
    recommended_dispute_type: "verify" | "inaccurate" | "incomplete" | "not_mine" | "duplicate" | "obsolete";
    confidence: "low" | "medium" | "high";
    raw: any;
  }>;

  scores: Record<Bureau, number | null>;

  meta: {
    report_date?: string;
    source: "mfsn_epic";
  };
};

export function normalizeMfsnEpicTo3BStandard(epic: any): Extracted3BStandard {
  const bundle = epic?.data?.BundleComponent ?? [];
  const reportDate = epic?.data?.ReportDate ?? null;

  const merge = bundle.find((x: any) => x?.Type === "MergeCreditReports")?.TrueLinkCreditReportType;

  const scores = extractScores(bundle, merge);

  const personal_info = extractPersonalInfo(merge);

  const accounts = extractAccounts(merge);
  const publicRecords = extractPublicRecords(merge);
  const inquiries = extractInquiries(merge);

  // Build negative_items + disputable_items from heuristics on accounts + publicRecords + fraud alert messages.
  const negative_items = buildNegativeItems(accounts, publicRecords, merge);
  const disputable_items = buildDisputableItems(accounts, publicRecords, inquiries, merge);

  return {
    personal_info,
    accounts,
    negative_items,
    disputable_items,
    scores,
    meta: {
      report_date: reportDate ?? undefined,
      source: "mfsn_epic",
    },
  };
}

/** ---------- Helpers ---------- **/

function bureauFromText(b: any): "TU" | "EQF" | "EXP" | null {
  const s = String(b ?? "").toLowerCase();
  if (s.includes("transunion") || s === "tuc") return "TU";
  if (s.includes("equifax") || s === "eqf") return "EQF";
  if (s.includes("experian") || s === "exp") return "EXP";
  return null;
}

function extractScores(bundle: any[], merge: any): Record<Bureau, number | null> {
  const out: Record<Bureau, number | null> = { TU: null, EQF: null, EXP: null };

  // From BundleComponent VantageScore types
  for (const comp of bundle) {
    const t = comp?.Type;
    const cs = comp?.CreditScoreType;
    if (!cs?.riskScore) continue;

    if (t === "TUCVantageScoreV6") out.TU = Number(cs.riskScore);
    if (t === "EQFVantageScoreV6") out.EQF = Number(cs.riskScore);
    if (t === "EXPVantageScoreV6") out.EXP = Number(cs.riskScore);
  }

  // Fallback: merge Borrower.CreditScore array
  const arr = merge?.Borrower?.CreditScore ?? [];
  for (const item of arr) {
    const b = bureauFromText(item?.Source?.Bureau?.abbreviation ?? item?.Source?.Bureau?.symbol);
    if (!b) continue;
    if (item?.riskScore && out[b] == null) out[b] = Number(item.riskScore);
  }

  return out;
}

function extractPersonalInfo(merge: any): Extracted3BStandard["personal_info"] {
  const borrower = merge?.Borrower ?? {};

  const names: Extracted3BStandard["personal_info"]["names"] = [];
  for (const n of borrower?.BorrowerName ?? []) {
    const b = bureauFromText(n?.Source?.Bureau?.abbreviation ?? n?.Source?.Bureau?.symbol);
    if (!b) continue;
    names.push({
      bureau: b,
      name_type: n?.NameType?.description ?? n?.NameType?.abbreviation ?? "Unknown",
      first: n?.Name?.first || undefined,
      middle: n?.Name?.middle || undefined,
      last: n?.Name?.last || undefined,
      raw: n,
      source: n?.Source,
    });
  }

  const addresses: Extracted3BStandard["personal_info"]["addresses"] = [];
  for (const a of borrower?.BorrowerAddress ?? []) {
    const b = bureauFromText(a?.Source?.Bureau?.abbreviation ?? a?.Source?.Bureau?.symbol);
    if (!b) continue;
    addresses.push({
      bureau: b,
      kind: "current",
      date_reported: a?.dateReported,
      raw: a,
      source: a?.Source,
    });
  }
  for (const a of borrower?.PreviousAddress ?? []) {
    const b = bureauFromText(a?.Source?.Bureau?.abbreviation ?? a?.Source?.Bureau?.symbol);
    if (!b) continue;
    addresses.push({
      bureau: b,
      kind: "previous",
      date_reported: a?.dateReported,
      raw: a,
      source: a?.Source,
    });
  }

  const employers: Extracted3BStandard["personal_info"]["employers"] = [];
  for (const e of borrower?.Employer ?? []) {
    const b = bureauFromText(e?.Source?.Bureau?.abbreviation ?? e?.Source?.Bureau?.symbol);
    if (!b) continue;
    employers.push({
      bureau: b,
      name: e?.name || undefined,
      date_reported: e?.dateReported,
      date_updated: e?.dateUpdated,
      raw: e,
      source: e?.Source,
    });
  }

  const dob: Extracted3BStandard["personal_info"]["dob"] = [];
  for (const d of borrower?.Birth ?? []) {
    const b = bureauFromText(d?.Source?.Bureau?.abbreviation ?? d?.Source?.Bureau?.symbol);
    if (!b) continue;
    dob.push({
      bureau: b,
      date: d?.date || undefined,
      raw: d,
      source: d?.Source,
    });
  }

  const credit_statements: Extracted3BStandard["personal_info"]["credit_statements"] = [];
  for (const s of borrower?.CreditStatement ?? []) {
    const b = bureauFromText(s?.Source?.Bureau?.abbreviation ?? s?.Source?.Bureau?.symbol);
    if (!b) continue;
    if (s?.statement) {
      credit_statements.push({
        bureau: b,
        statement: s.statement,
        raw: s,
        source: s?.Source,
      });
    }
  }

  const fraud_flags = {
    fraud_indicator: merge?.FraudIndicator === "true" ? true : merge?.FraudIndicator === "false" ? false : undefined,
    deceased_indicator: merge?.DeceasedIndicator === "true" ? true : merge?.DeceasedIndicator === "false" ? false : undefined,
    sb168_frozen: merge?.SB168Frozen
      ? {
          equifax: merge.SB168Frozen.equifax === "true",
          experian: merge.SB168Frozen.experian === "true",
          transunion: merge.SB168Frozen.transunion === "true",
        }
      : undefined,
    raw: { FraudIndicator: merge?.FraudIndicator, DeceasedIndicator: merge?.DeceasedIndicator, SB168Frozen: merge?.SB168Frozen },
  };

  return { names, addresses, employers, dob, credit_statements, fraud_flags };
}

function extractAccounts(merge: any): Extracted3BStandard["accounts"] {
  const partitions = merge?.TradeLinePartition ?? [];
  const out: Extracted3BStandard["accounts"] = [];

  for (const p of partitions) {
    const acctType = p?.accountTypeDescription ?? p?.accountTypeAbbreviation ?? "Unknown";
    const tradelines = p?.Tradeline ?? [];
    for (const tl of tradelines) {
      const b = bureauFromText(tl?.bureau);
      if (!b) continue;

      const creditor = tl?.creditorName ?? undefined;
      const acctNum = tl?.accountNumber ? maskAccount(String(tl.accountNumber)) : undefined;

      const remarks: string[] = [];
      const r = tl?.Remark;
      if (Array.isArray(r)) {
        for (const rr of r) {
          const d = rr?.RemarkCode?.description ?? rr?.RemarkCode?.abbreviation;
          if (d) remarks.push(d);
        }
      } else if (r?.RemarkCode) {
        const d = r?.RemarkCode?.description ?? r?.RemarkCode?.abbreviation;
        if (d) remarks.push(d);
      }

      const granted = tl?.GrantedTrade ?? {};
      const collection = tl?.CollectionTrade ?? null;

      const id = [
        b,
        tl?.subscriberCode ?? "",
        (creditor ?? "").slice(0, 16),
        acctNum ?? "",
        tl?.position ?? "",
      ]
        .filter(Boolean)
        .join("|");

      out.push({
        id,
        bureau: b,
        account_type: acctType,
        creditor_name: creditor,
        account_number_masked: acctNum,
        date_opened: tl?.dateOpened || undefined,
        date_reported: tl?.dateReported || undefined,
        date_closed: tl?.dateClosed || undefined,
        current_balance: toNum(tl?.currentBalance),
        high_balance: toNum(tl?.highBalance),
        credit_limit: toNum(granted?.CreditLimit),
        pay_status: tl?.PayStatus?.description ?? tl?.PayStatus?.abbreviation ?? undefined,
        account_condition: tl?.AccountCondition?.description ?? undefined,
        open_closed: tl?.OpenClosed?.description ?? undefined,
        remarks,
        late_30: toNum(granted?.late30Count),
        late_60: toNum(granted?.late60Count),
        late_90: toNum(granted?.late90Count),
        worst_pay_status: granted?.WorstPayStatus?.description ?? undefined,
        raw: { ...tl, _collection: collection },
      });
    }
  }

  return out;
}

function extractPublicRecords(merge: any) {
  const partitions = merge?.PulblicRecordPartition ?? []; // note the misspelling in their JSON
  const out: any[] = [];

  for (const p of partitions) {
    const prs = p?.PublicRecord ?? [];
    for (const pr of prs) {
      const b = bureauFromText(pr?.bureau);
      if (!b) continue;
      out.push({ bureau: b, raw: pr });
    }
  }

  return out;
}

function extractInquiries(merge: any) {
  const partitions = merge?.InquiryPartition ?? [];
  const out: any[] = [];
  for (const p of partitions) {
    const iq = p?.Inquiry;
    if (!iq) continue;
    const b = bureauFromText(iq?.bureau);
    if (!b) continue;
    out.push({ bureau: b, raw: iq });
  }
  return out;
}

function buildNegativeItems(accounts: Extracted3BStandard["accounts"], publicRecords: any[], merge: any): Extracted3BStandard["negative_items"] {
  const out: Extracted3BStandard["negative_items"] = [];

  // Public records => negative
  for (const pr of publicRecords) {
    const raw = pr.raw;
    const classification = raw?.Classification?.description?.toLowerCase() ?? "";
    const type = raw?.Type?.description?.toLowerCase() ?? "";
    const isBk = classification.includes("bankruptcy") || type.includes("bankruptcy");

    out.push({
      id: `pr|${pr.bureau}|${raw?.referenceNumber ?? raw?.subscriberCode ?? "x"}`,
      bureau: pr.bureau,
      category: isBk ? "bankruptcy" : "public_record",
      creditor_name: raw?.courtName,
      reason: `${raw?.Classification?.description ?? "Public Record"}: ${raw?.Type?.description ?? ""} (${raw?.Status?.description ?? "status?"})`,
      raw,
    });
  }

  // Accounts flagged derog/collection/chargeoff
  for (const a of accounts) {
    const pay = (a.pay_status ?? "").toLowerCase();
    const cond = (a.account_condition ?? "").toLowerCase();

    const isCollection = a.account_type.toLowerCase().includes("collection") || pay.includes("collection");
    const isChargeoff = pay.includes("chargeoff") || a.remarks?.some((r) => r.toLowerCase().includes("charged off"));
    const isDerog = cond.includes("derog");

    if (isCollection || isChargeoff || isDerog) {
      out.push({
        id: `acctneg|${a.id}`,
        bureau: a.bureau,
        category: isCollection ? "collection" : isChargeoff ? "chargeoff" : "derogatory",
        creditor_name: a.creditor_name,
        reason: `Negative account signals: ${[isDerog ? "derogatory" : null, isCollection ? "collection" : null, isChargeoff ? "charge-off" : null]
          .filter(Boolean)
          .join(", ")}`,
        raw: a.raw,
      });
    }

    // Late counts as negatives
    if ((a.late_30 ?? 0) > 0 || (a.late_60 ?? 0) > 0 || (a.late_90 ?? 0) > 0) {
      out.push({
        id: `latemark|${a.id}`,
        bureau: a.bureau,
        category: "late",
        creditor_name: a.creditor_name,
        reason: `Late history: 30=${a.late_30 ?? 0}, 60=${a.late_60 ?? 0}, 90=${a.late_90 ?? 0}`,
        raw: a.raw,
      });
    }
  }

  // Fraud/alerts as negative informational
  const msg = merge?.Message?.[0]?.Code?.description ?? "";
  if (String(msg).toLowerCase().includes("fraud")) {
    out.push({
      id: `fraud|merge`,
      bureau: "TU", // merge-level; pick TU as canonical for display
      category: "fraud_alert",
      reason: msg,
      raw: merge?.Message,
    });
  }

  return out;
}

function buildDisputableItems(
  accounts: Extracted3BStandard["accounts"],
  publicRecords: any[],
  inquiries: any[],
  merge: any
): Extracted3BStandard["disputable_items"] {
  const out: Extracted3BStandard["disputable_items"] = [];

  // Rule set (beta-safe):
  // - Anything derog/collection/chargeoff => "verify" by default
  // - Anything with a dispute remark => highlight (possible reinvestigation / FCRA dispute language)
  // - Public record bankruptcy => flag but keep confidence medium (bankruptcy disputes are special)
  for (const a of accounts) {
    const pay = (a.pay_status ?? "").toLowerCase();
    const cond = (a.account_condition ?? "").toLowerCase();

    const hasDisputeRemark = a.remarks?.some((r) => r.toLowerCase().includes("disputed"));
    const isDerog = cond.includes("derog");
    const isBadPay = pay.includes("collection") || pay.includes("chargeoff") || pay.includes("coll/chargeoff");

    if (hasDisputeRemark || isDerog || isBadPay) {
      out.push({
        id: `disp|${a.id}`,
        bureau: a.bureau,
        category: a.account_type.toLowerCase().includes("collection") ? "collection" : "tradeline",
        reason: hasDisputeRemark
          ? "Account shows dispute/remark flags; confirm accuracy, dates, balances, and reporting compliance."
          : "Derog/collection/chargeoff indicators. Request verification and accuracy review.",
        recommended_dispute_type: "verify",
        confidence: hasDisputeRemark ? "high" : "medium",
        raw: a.raw,
      });
    }
  }

  for (const pr of publicRecords) {
    const raw = pr.raw;
    const classification = (raw?.Classification?.description ?? "").toLowerCase();
    const type = (raw?.Type?.description ?? "").toLowerCase();
    const isBk = classification.includes("bankruptcy") || type.includes("bankruptcy");

    out.push({
      id: `disp|pr|${pr.bureau}|${raw?.referenceNumber ?? raw?.subscriberCode ?? "x"}`,
      bureau: pr.bureau,
      category: "public_record",
      reason: isBk
        ? "Public record bankruptcy present. Verify dates/status/type match official court record and bureau reporting is accurate."
        : "Public record present. Verify accuracy and reporting details.",
      recommended_dispute_type: "verify",
      confidence: "medium",
      raw,
    });
  }

  // Optional: hard inquiries (only if your strategy disputes them)
  // In beta, I’d show them but not auto-dispute.
  for (const iq of inquiries) {
    out.push({
      id: `disp|inq|${iq.bureau}|${iq.raw?.subscriberNumber ?? iq.raw?.subscriberName ?? "x"}`,
      bureau: iq.bureau,
      category: "inquiry",
      reason: "Inquiry listed. Only dispute if not authorized / not yours.",
      recommended_dispute_type: "verify",
      confidence: "low",
      raw: iq.raw,
    });
  }

  // Personal info conflicts could be detected later (names/addresses variations).
  // Keep this Phase 2 (needs better rules).
  return out;
}

function maskAccount(acct: string) {
  // keep last 4 visible
  const clean = acct.replace(/\s+/g, "");
  if (clean.length <= 4) return "****";
  return `${"*".repeat(Math.min(clean.length - 4, 12))}${clean.slice(-4)}`;
}

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
