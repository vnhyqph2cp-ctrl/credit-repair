import { NextRequest } from "next/server";

const BASE_URL = process.env.MFSN_BASE_URL!;
const PARTNER_TOKEN = process.env.MFSN_PARTNER_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    if (!BASE_URL || !PARTNER_TOKEN) {
      return new Response(
        JSON.stringify({ error: "MFSN config missing" }),
        { status: 500 }
      );
    }

    const body = await req.json();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "aid",
      "mobile",
      "streetAddress1",
      "zip",
      "city",
      "state",
      "ssn",
      "dob",
      "type",
      "product"
    ];

    const missing = requiredFields.filter((f) => !body[f]);
    if (missing.length) {
      return new Response(
        JSON.stringify({ error: "Missing fields", missing }),
        { status: 400 }
      );
    }

    const product = body.product === "funding" ? "funding" : "credit";
    const enrollUrl = `${BASE_URL}/api/auth/snapshot/${product}/enroll`;

    const enrollRes = await fetch(enrollUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PARTNER_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        aid: body.aid,
        mobile: body.mobile,
        streetAddress1: body.streetAddress1,
        zip: body.zip,
        city: body.city,
        state: body.state,
        ssn: body.ssn,
        dob: body.dob,
        type: body.type
      })
    });

    const data = await enrollRes.json();

    if (!enrollRes.ok) {
      return new Response(
        JSON.stringify({ error: "Enrollment failed", detail: data }),
        { status: enrollRes.status }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Server error", detail: err?.message }),
      { status: 500 }
    );
  }
}
