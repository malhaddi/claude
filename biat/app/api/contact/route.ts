import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

/** Demo endpoint — in production this would create a CRM ticket. */
export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const missing = ["name", "email", "message"].filter(
    (f) => !body[f as keyof ContactPayload]?.toString().trim()
  );
  if (missing.length) {
    return NextResponse.json(
      { error: `Champs requis manquants : ${missing.join(", ")}` },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email!)) {
    return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 });
  }

  const ticket = `BIAT-${Math.abs(
    [...`${body.email}${body.message}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)
  )
    .toString(36)
    .toUpperCase()
    .slice(0, 6)}`;

  return NextResponse.json({
    ok: true,
    ticket,
    message: `Merci ${body.name} ! Votre demande ${ticket} a bien été enregistrée. Un conseiller vous recontactera sous 24h ouvrées.`,
  });
}
