/**
 * Monétisation — Stripe Connect (couture prête, non branchée en itération 1).
 *
 * Modèle retenu : marketplace avec comptes **Connect Express**.
 *   1. Onboarding coach : on crée un compte Express puis on redirige vers le
 *      lien d'onboarding Stripe (KYC, IBAN). L'id du compte est stocké dans
 *      coaches.stripe_account_id (migration 0001).
 *        const account = await getStripe().accounts.create({ type: "express" });
 *        const link = await getStripe().accountLinks.create({
 *          account: account.id, type: "account_onboarding",
 *          refresh_url: …, return_url: …,
 *        });
 *   2. Paiement d'une séance / d'un suivi : Checkout Session avec commission
 *      plateforme et versement direct au coach :
 *        await getStripe().checkout.sessions.create({
 *          mode: "payment",
 *          line_items: [{ price_data: { currency: "eur",
 *            unit_amount: coach.price_per_session_cents, … }, quantity: 1 }],
 *          payment_intent_data: {
 *            application_fee_amount: fee,                      // notre commission
 *            transfer_data: { destination: coach.stripe_account_id },
 *          },
 *          …
 *        });
 *   3. Webhooks (route handler /api/stripe/webhook, à créer) : valider la
 *      signature avec STRIPE_WEBHOOK_SECRET puis marquer la prestation payée.
 *
 * Ce module est STRICTEMENT serveur (clé secrète) — ne jamais l'importer
 * depuis un composant "use client".
 */

import Stripe from "stripe";

let stripe: Stripe | null = null;

/** Singleton paresseux : n'instancie rien (et n'exige pas la clé) tant
 * qu'aucun flux de paiement n'est appelé. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant — renseignez .env.local (voir .env.example)."
    );
  }
  stripe ??= new Stripe(key);
  return stripe;
}
