import Link from "next/link";

type AnalyzerItemStatus = "complete" | "review";

interface AnalyzerItem {
  title: string;
  text: string;
  status: AnalyzerItemStatus;
}

interface AnalyzerTemplateProps {
  pageTitle: string;
  introText: string;
  sectionTitle: string;
  sectionText: string;
  items: AnalyzerItem[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  footerNote?: string;
}

export default function AnalyzerTemplate({
  pageTitle,
  introText,
  sectionTitle,
  sectionText,
  items,
  primaryCta,
  secondaryCta,
  footerNote,
}: AnalyzerTemplateProps) {
  return (
    <main>
      <div className="container col">

        {/* HEADER */}
        <header className="col">
          <h1>{pageTitle}</h1>
          <p>{introText}</p>
        </header>

        {/* ANALYSIS CORE */}
        <section className="surface card surface-purple glow-soft under-glow col">
          <h2>{sectionTitle}</h2>
          <p>{sectionText}</p>

          <div className="row" style={{ flexWrap: "wrap" }}>
            {items.map((item, idx) => (
              <AnalyzerItem
                key={idx}
                title={item.title}
                text={item.text}
                status={item.status}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="surface card col">
          <h2>Next Step</h2>

          <div className="row">
            <Link href={primaryCta.href} className="btn glow-neon">
              {primaryCta.label}
            </Link>

            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </section>

        {/* FOOTER */}
        {footerNote && (
          <footer className="footer">
            <small>{footerNote}</small>
          </footer>
        )}

      </div>
    </main>
  );
}

/* ================= SUB COMPONENT ================= */

function AnalyzerItem({
  title,
  text,
  status,
}: {
  title: string;
  text: string;
  status: AnalyzerItemStatus;
}) {
  return (
    <div className="surface card col" style={{ maxWidth: 320 }}>
      <strong>{title}</strong>
      <p>{text}</p>
      <small
        style={{
          color:
            status === "complete"
              ? "rgb(var(--accent))"
              : "rgba(var(--muted),0.9)",
          fontWeight: 600,
        }}
      >
        {status === "complete" ? "✓ Reviewed" : "• In Review"}
      </small>
    </div>
  );
}
