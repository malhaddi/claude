import { NextRequest, NextResponse } from "next/server";

type Payload = {
  offer?: string;
  firstName?: string;
  lastName?: string;
  cin?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  city?: string;
};

/** Demo onboarding endpoint — in production this would open a KYC case
 *  (document upload + video verification) in the core banking system. */
export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const required: (keyof Payload)[] = ["offer", "firstName", "lastName", "cin", "email", "phone"];
  const missing = required.filter((f) => !body[f]?.toString().trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Champs requis manquants : ${missing.join(", ")}` },
      { status: 400 }
    );
  }
  if (!/^\d{8}$/.test(body.cin!.trim())) {
    return NextResponse.json(
      { error: "Le numéro de CIN doit comporter 8 chiffres." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email!)) {
    return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 });
  }

  const ref = `OUV-${Math.abs(
    [...`${body.cin}${body.email}`].reduce((h, c) => (h * 33 + c.charCodeAt(0)) | 0, 5381)
  )
    .toString(36)
    .toUpperCase()
    .slice(0, 7)}`;

  return NextResponse.json({
    ok: true,
    reference: ref,
    nextSteps: [
      "Vérification de votre identité (CIN) sous 24 h ouvrées",
      "Signature électronique de la convention de compte",
      "Votre RIB immédiatement, votre carte sous 5 jours ouvrés",
    ],
  });
}
