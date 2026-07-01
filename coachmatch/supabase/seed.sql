-- ============================================================================
-- CoachMatch — seed de DÉVELOPPEMENT LOCAL uniquement (supabase db reset)
-- ============================================================================
-- ⚠️  Ne jamais exécuter en production : on insère directement dans
-- auth.users avec des UUID fixes pour contourner le flux d'inscription.
-- En prod, les comptes se créent via Supabase Auth (supabase.auth.signUp).
--
-- Les specializations sont déjà seedées par la migration 0001 (données de
-- référence indispensables au fonctionnement de l'app).
-- ============================================================================

-- Comptes auth minimaux (fonctionne sur la stack locale Supabase).
insert into auth.users (id, email)
values
  ('00000000-0000-4000-a000-000000000001', 'camille.coach@example.com'),
  ('00000000-0000-4000-a000-000000000002', 'karim.coach@example.com'),
  ('00000000-0000-4000-a000-000000000003', 'lea.coach@example.com'),
  ('00000000-0000-4000-a000-000000000101', 'client.demo@example.com')
on conflict (id) do nothing;

-- Profils (« Users »)
insert into public.profiles (id, role, full_name, gender, city, location)
values
  ('00000000-0000-4000-a000-000000000001', 'coach', 'Camille Roussel', 'female', 'Lyon',
   st_setsrid(st_makepoint(4.8357, 45.7640), 4326)),
  ('00000000-0000-4000-a000-000000000002', 'coach', 'Karim Benali', 'male', 'Paris',
   st_setsrid(st_makepoint(2.3522, 48.8566), 4326)),
  ('00000000-0000-4000-a000-000000000003', 'coach', 'Léa Fontaine', 'female', 'Bordeaux',
   st_setsrid(st_makepoint(-0.5792, 44.8378), 4326)),
  ('00000000-0000-4000-a000-000000000101', 'client', 'Client Démo', 'male', 'Lyon',
   st_setsrid(st_makepoint(4.8357, 45.7640), 4326));

-- Fiches coachs
insert into public.coaches
  (id, slug, headline, bio, methodology, modes, price_per_session_cents,
   price_monthly_cents, years_experience, certifications, is_published,
   rating_avg, review_count)
values
  ('00000000-0000-4000-a000-000000000001', 'camille-roussel',
   'Coach force & powerlifting — du débutant au compétiteur',
   'Ancienne compétitrice de force athlétique, j''accompagne depuis 8 ans des pratiquants de tous niveaux sur les trois mouvements.',
   'Programmation à faible volume et haute intensité : des séances courtes, denses, pour progresser sans y passer sa vie.',
   '{online,in_person}', 6000, 18000, 8, '{BPJEPS AF,Formation FFForce}', true, 4.90, 41),
  ('00000000-0000-4000-a000-000000000002', 'karim-benali',
   'Préparateur bodybuilding — esthétique et prise de masse',
   'Coach spécialisé en hypertrophie et préparation aux compétitions men''s physique.',
   'Volume progressif piloté par les sensations et le carnet d''entraînement ; la nutrition fait partie du suivi.',
   '{in_person}', 7500, 25000, 11, '{BPJEPS AF,Diplôme nutrition sportive}', true, 4.70, 63),
  ('00000000-0000-4000-a000-000000000003', 'lea-fontaine',
   'Entraînement hybride — force + endurance sans compromis',
   'Triathlète et haltérophile, je construis des plans qui font coexister barre et cardio.',
   'Périodisation par blocs avec gestion des interférences force/endurance.',
   '{online}', 5000, 15000, 6, '{CQP Instructeur fitness,Licence STAPS}', true, 4.80, 27);

-- Critères (n-n) — les ids de specializations sont 1=strength, 2=hybrid,
-- 3=bodybuilding dans l'ordre d'insertion de la migration 0001.
insert into public.coach_specializations (coach_id, specialization_id)
values
  ('00000000-0000-4000-a000-000000000001', 1),
  ('00000000-0000-4000-a000-000000000002', 3),
  ('00000000-0000-4000-a000-000000000003', 1),
  ('00000000-0000-4000-a000-000000000003', 2);

-- Disponibilités (weekday : 0 = lundi … 6 = dimanche)
insert into public.availability_slots (coach_id, weekday, start_time, end_time)
values
  ('00000000-0000-4000-a000-000000000001', 1, '18:00', '21:00'),
  ('00000000-0000-4000-a000-000000000001', 5, '09:00', '12:00'),
  ('00000000-0000-4000-a000-000000000002', 2, '07:00', '10:00'),
  ('00000000-0000-4000-a000-000000000002', 3, '18:00', '22:00'),
  ('00000000-0000-4000-a000-000000000003', 0, '12:00', '14:00'),
  ('00000000-0000-4000-a000-000000000003', 6, '09:00', '12:00');

-- Une demande + une conversation de démo pour tester la messagerie
insert into public.coaching_requests (id, client_id, coach_id, goal, preferred_mode, budget_cents, message)
values
  ('00000000-0000-4000-b000-000000000001',
   '00000000-0000-4000-a000-000000000101',
   '00000000-0000-4000-a000-000000000001',
   'Passer 140 kg au squat', 'in_person', 20000,
   'Bonjour Camille, je stagne au squat depuis 6 mois et j''aimerais un suivi sérieux.');

insert into public.conversations (id, request_id, client_id, coach_id)
values
  ('00000000-0000-4000-c000-000000000001',
   '00000000-0000-4000-b000-000000000001',
   '00000000-0000-4000-a000-000000000101',
   '00000000-0000-4000-a000-000000000001');

insert into public.messages (conversation_id, sender_id, body)
values
  ('00000000-0000-4000-c000-000000000001',
   '00000000-0000-4000-a000-000000000101',
   'Bonjour Camille, je stagne au squat depuis 6 mois et j''aimerais un suivi sérieux.'),
  ('00000000-0000-4000-c000-000000000001',
   '00000000-0000-4000-a000-000000000001',
   'Bonjour ! Avec plaisir — on peut faire un point vidéo cette semaine pour parler de ta technique ?');
