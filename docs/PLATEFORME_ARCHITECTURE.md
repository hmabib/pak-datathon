# Plateforme ERP Data Collaborative PAK - Architecture Avancée

## 1) Architecture applicative

- Frontend: Next.js App Router (SSR + routes dynamiques)
- API Layer: routes `/api/*` server-side
- Data Layer: Prisma + PostgreSQL (Heroku)
- Auth: JWT cookie HttpOnly + middleware de protection
- Déploiement: GitHub + Vercel

### Domaines fonctionnels

- Site institutionnel stratégique
- Onboarding intelligent et scoring
- Workspace collaboratif (équipes, chat, brainstorm)
- Data requests structurées vers PAK
- Simulations/scénarios décisionnels
- Admin analytics + gouvernance

## 2) Modèle SQL (exhaustif)

Tables cœur:

- users
- user_profiles
- user_skills
- onboarding_scores
- teams
- team_members
- team_messages
- problems
- problem_tags
- solutions
- solution_versions
- votes
- comments
- data_requests
- dataset_access_logs
- clusters
- simulations
- rse_commitments
- governance_acceptance
- audit_trail
- notifications

## 3) UX Flows (user)

1. Création compte
2. Onboarding avancé (profil, compétences, disponibilité, clusters)
3. Scoring + recommandations
4. Dashboard personnalisé
5. Workspace: classifier problème, constituer équipe, chatter, simuler, soumettre requête data
6. Suivi statut (demande data, solutions, feedback)

## 4) Admin Flows

1. Vue KPI globale (utilisateurs, problèmes, requêtes, simulations)
2. Heatmap besoins data par cluster
3. Typologies dominantes (tags)
4. Revue des demandes datasets
5. Arbitrage des problèmes en attente
6. Bootstrap/synchronisation catalog cluster
7. Audit et traçabilité

## 5) Stratégie de scaling

- Index SQL sur cluster/status/date
- Pagination API et limitation `take`
- GroupBy pré-calculé pour dashboards
- Découplage modules via routes dédiées
- Possibilité de cache edge pour pages vitrines
- Possibilité d’extraction worker pour NLP/simulation lourde

## 6) Gouvernance data

- Requête data argumentée obligatoire
- Niveau de sensibilité explicite
- Workflow de revue admin
- Journalisation des accès dataset
- Audit trail des actions critiques
- Cadre éthique et RSE intégré à l’onboarding

## 7) Sécurité

- JWT signé + cookie HttpOnly + SameSite
- Contrôle RBAC USER/ADMIN/MODERATOR
- Validation serveur des payloads critiques
- Routes admin protégées
- Pas d’exposition des secrets côté client
- Séparation des environnements Vercel (dev/preview/prod)

## 8) CI/CD

- Branches recommandées: `main`, `dev`, feature branches
- Push GitHub -> deploy automatique Vercel
- Build script: `prisma generate && next build`
- Environnements Vercel configurés: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## 9) Roadmap (début 11 mars 2026)

- Phase 1: architecture + cadrage
- Phase 2: core features
- Phase 3: onboarding intelligent
- Phase 4: classification + data mapping
- Phase 5: simulation + analytics
- Phase 6: sécurité + audit
- Phase 7: industrialisation & scale
