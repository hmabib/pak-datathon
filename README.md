# PAK DataThon Platform

Plateforme complète Next.js + Prisma pour:
- Site vitrine (landing + pages programme, à propos, contact)
- Authentification (inscription, connexion, session cookie JWT)
- Onboarding guidé (profil, compétences, scoring, engagements)
- Dashboard utilisateur
- Dashboard admin
- API routes métier (auth, onboarding, problèmes, demandes datasets, stats)

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

## Flux applicatifs

- Nouveau compte -> `/auth/register`
- Onboarding -> `/onboarding`
- Dashboard utilisateur -> `/dashboard`
- Dashboard admin -> `/admin` (rôles `ADMIN` et `MODERATOR`)

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
  /(marketing pages)
  /auth/login
  /auth/register
  /onboarding
  /dashboard
  /admin
  /api/*
src/components
  /marketing
  /auth
  /onboarding
  /dashboard
src/lib
  auth, prisma, validators, onboarding, http
prisma/schema.prisma
```
