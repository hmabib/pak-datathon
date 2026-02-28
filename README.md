# PAK DataThon Platform

Plateforme complète Next.js + Prisma pour:
- Site vitrine stratégique premium (landing, programme, problématiques, roadmap, à propos, contact)
- Authentification (inscription, connexion, session cookie JWT)
- Onboarding guidé (profil, compétences, scoring, engagements)
- Dashboard utilisateur + workspace collaboratif avancé
- Dashboard admin analytics + gouvernance
- API routes métier (auth, onboarding, problèmes, demandes datasets, stats, équipes, chat, simulations, clustering)
- Typologie exhaustive des difficultés logistiques clusterisées et data mapping

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- JWT (`jsonwebtoken`) + `bcryptjs`

## Démarrage local

1. Installer les dépendances

```bash
npm install
```

2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

3. Générer Prisma Client (si nécessaire)

```bash
npx prisma generate
```

4. Lancer en dev

```bash
npm run dev
```

## Qualité

```bash
npm run lint
npx tsc --noEmit
npm run build -- --webpack
```

Note: dans certains environnements sandbox, `next build` (Turbopack) peut échouer pour des raisons système. Le build Webpack reste valide pour la vérification CI locale.

## Variables d'environnement

Voir `.env.example`.

Variables principales:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## API routes implémentées

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/onboarding`
- `GET|POST /api/problems`
- `GET|POST /api/data-requests`
- `GET /api/dashboard/summary`
- `GET /api/admin/stats`
- `POST /api/admin/bootstrap-clusters`
- `GET /api/clusters`
- `POST /api/problems/classify`
- `GET|POST /api/teams`
- `POST /api/teams/:teamId/join`
- `GET|POST /api/teams/:teamId/messages`
- `GET|POST /api/simulations`
- `GET|POST /api/solutions/:solutionId/versions`

## Flux applicatifs

- Nouveau compte -> `/auth/register`
- Onboarding -> `/onboarding`
- Dashboard utilisateur -> `/dashboard`
- Workspace collaboratif -> `/dashboard/workspace`
- Dashboard admin -> `/admin` (rôles `ADMIN` et `MODERATOR`)
- Catalogue des problématiques -> `/problematiques`
- Roadmap démarrage 11 mars 2026 -> `/roadmap`

### Promouvoir un utilisateur en admin

```bash
npm run make:admin -- user@email.com
```

## Déploiement GitHub + Vercel

1. Initialiser et pousser sur GitHub

```bash
git init
git add .
git commit -m "feat: complete PAK DataThon platform"
git branch -M main
git remote add origin <votre-repo-github>
git push -u origin main
```

2. Déployer sur Vercel
- Importer le repo GitHub dans Vercel
- Configurer les variables d'environnement (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- Déployer

3. Prisma en production
- Soit exécuter `prisma db push` avant déploiement
- Soit ajouter une migration et l’exécuter en pipeline

## Structure principale

```text
src/app
  /(marketing pages: /, /programme, /problematiques, /roadmap...)
  /auth/login
  /auth/register
  /onboarding
  /dashboard (+ /dashboard/workspace)
  /admin
  /api/*
src/components
  /marketing (sections stratégiques)
  /auth
  /onboarding
  /dashboard (workspace + admin actions)
src/lib
  auth, prisma, validators, onboarding, http, problem-clusters, problem-intelligence
prisma/schema.prisma
docs/PLATEFORME_ARCHITECTURE.md
```

## Documentation architecture

- Voir [docs/PLATEFORME_ARCHITECTURE.md](docs/PLATEFORME_ARCHITECTURE.md) pour:
  - architecture complète
  - SQL étendu
  - UX/Admin flows
  - scaling
  - gouvernance data
  - sécurité
  - roadmap
