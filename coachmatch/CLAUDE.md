@README.md

# Notes pour les agents

- Projet **autonome** : il a son propre `package.json` — ne pas le confondre
  avec l'app Content Hub à la racine du dépôt. Les dépendances ne sont PAS
  installées (`npm install` jamais lancé ici) : ne pas s'attendre à pouvoir
  builder sans installation préalable.
- Mêmes conventions que la racine : Next.js 16 (`params` est une Promise dans
  les routes dynamiques), Tailwind v4 configuré en CSS (pas de
  `tailwind.config.js`), shadcn/ui copié à la main, pas de `setState` dans les
  effets, lucide-react 1.x (pas d'icônes de marques).
- Toute évolution du modèle de données commence par une migration SQL dans
  `supabase/migrations/`, puis se répercute dans `src/lib/types.ts` (les
  unions TS sont le miroir des enums Postgres).
- Les composants ne lisent les données que via la façade `src/lib/coaches.ts`
  — ne jamais importer `mock-coaches.ts` directement dans un composant.
