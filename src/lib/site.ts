export const siteConfig = {
  name: 'PAK DataThon Platform',
  description:
    'Plateforme collaborative pour identifier, prioriser et résoudre les défis logistiques via la data.',
  startDate: '11 mars 2026',
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/problematiques', label: 'Problématiques' },
    { href: '/blog/problemes-rencontres', label: 'Blog terrain' },
    { href: '/programme', label: 'Programme' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
} as const

export const clusterLabels = {
  OPERATIONNEL: 'Opérationnel',
  DOCUMENTAIRE: 'Documentaire',
  SYSTEMES_IT: 'Systèmes IT',
  LOGISTIQUE_TRANSPORT: 'Logistique transport',
  REGLEMENTAIRE: 'Réglementaire',
  FINANCIER: 'Financier',
  INFRASTRUCTURE: 'Infrastructure',
  COORDINATION: 'Coordination',
} as const
