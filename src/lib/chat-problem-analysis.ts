import { clusterLabels } from '@/lib/site'

export type ChatProblemInsight = {
  slug: string
  cluster: keyof typeof clusterLabels
  title: string
  evidencePattern: string
  frequencySignal: string
  operationalNarrative: string
  rootCauses: string[]
  requiredData: {
    vessel: string[]
    cargo: string[]
    trade: string[]
    truck: string[]
  }
  recommendedActions: string[]
  confidence: number
  comprehension: number
}

export const chatSourceSummary = {
  period: '27 août 2024 → 8 novembre 2024',
  channel: 'chat opérationnel multi-acteurs',
  note:
    'Analyse basée sur motifs récurrents observés dans les échanges de support terrain, sans citer de site spécifique.',
}

export const chatProblemInsights: ChatProblemInsight[] = [
  {
    slug: 'validation-acces-goulot',
    cluster: 'COORDINATION',
    title: 'Goulot de validation des codes d’accès',
    evidencePattern: 'Demandes répétées de “codes en attente”, relances multiples, chauffeurs immobilisés aux guérites.',
    frequencySignal: 'Signal très fort (motifs accès/validation observés très fréquemment).',
    operationalNarrative:
      'La validation multi-acteurs n’est pas synchronisée dans le temps. Le chauffeur est physiquement présent mais la chaîne de validation reste partiellement bloquée.',
    rootCauses: [
      'Workflow de validation séquentiel et non parallèle',
      'Faible visibilité sur l’état exact de blocage',
      'Absence de SLA horodaté par étape',
    ],
    requiredData: {
      vessel: ['Fenêtres d’opération impactées par retard accès'],
      cargo: ['Référence dossier, statut readiness'],
      trade: ['Priorité commerciale du flux'],
      truck: ['Heure d’arrivée guérite, durée d’attente, statut chauffeur'],
    },
    recommendedActions: [
      'Moteur SLA par étape de validation',
      'Routage d’escalade automatique selon délai',
      'Vue unifiée des blocages par ticket',
    ],
    confidence: 95,
    comprehension: 93,
  },
  {
    slug: 'anomalies-bas',
    cluster: 'DOCUMENTAIRE',
    title: 'Anomalies BAS et incohérences de statuts documentaires',
    evidencePattern: '“Problème BAS”, “BAS absent”, “statut évalué/autorisé non aligné”.',
    frequencySignal: 'Signal très fort (BAS mentionné de façon récurrente sur toute la période).',
    operationalNarrative:
      'Les acteurs observent des divergences entre paiements, validations documentaires et autorisations effectives.',
    rootCauses: [
      'Synchronisation incomplète entre systèmes documentaires',
      'Propagation lente des statuts entre applications',
      'Gestion d’exception peu outillée',
    ],
    requiredData: {
      vessel: ['Manifestes et événements d’escale liés au dossier'],
      cargo: ['Statuts BAS, pièces justificatives, horodatages de validation'],
      trade: ['Référentiel conformité import/export'],
      truck: ['Lien entre dossier et gate pass opérationnel'],
    },
    recommendedActions: [
      'Contrôles de cohérence inter-systèmes en temps réel',
      'Audit trail de transition de statuts',
      'Détection proactive des dossiers à risque BAS',
    ],
    confidence: 94,
    comprehension: 91,
  },
  {
    slug: 'defaut-scan-inspection',
    cluster: 'OPERATIONNEL',
    title: 'Défauts de scan / inspection et blocage de flux',
    evidencePattern: '“Défaut de scann”, “inspection en attente” avec délais de plusieurs jours.',
    frequencySignal: 'Signal fort et transversal (scan/inspection mentionné de manière continue).',
    operationalNarrative:
      'Les retards d’inspection génèrent un effet domino sur l’enlèvement, la rotation camion et les engagements clients.',
    rootCauses: [
      'Capacité d’inspection fluctuante',
      'Priorisation de file non explicite',
      'Visibilité insuffisante des causes de blocage',
    ],
    requiredData: {
      vessel: ['Planning d’arrivée et contraintes de traitement'],
      cargo: ['File d’inspection, durée de traitement, incidents scanner'],
      trade: ['Impacts délai sur engagements commerciaux'],
      truck: ['Temps d’attente avant/après inspection'],
    },
    recommendedActions: [
      'Tableau de charge inspection temps réel',
      'Priorisation dynamique par criticité',
      'Alertes prédictives sur dépassement délai',
    ],
    confidence: 91,
    comprehension: 90,
  },
  {
    slug: 'retours-vides-incertains',
    cluster: 'LOGISTIQUE_TRANSPORT',
    title: 'Incertitude opérationnelle sur le retour des vides',
    evidencePattern: 'Messages contradictoires sur points de dépôt, saturation et refus ponctuels.',
    frequencySignal: 'Signal élevé (retour vide et orientation transport évoqués régulièrement).',
    operationalNarrative:
      'Les transporteurs subissent des allers-retours coûteux faute de règle opérationnelle stable visible en temps réel.',
    rootCauses: [
      'Capacité de dépôt variable',
      'Règles conditionnelles mal diffusées',
      'Coordination imparfaite entre lignes et opérateurs',
    ],
    requiredData: {
      vessel: ['Flux de restitution liés aux escales'],
      cargo: ['Type conteneur et statut restitution'],
      trade: ['Priorité corridor/logistique retour'],
      truck: ['Trajets de repositionnement, temps de file, refus à l’entrée'],
    },
    recommendedActions: [
      'Publication dynamique des points de dépôt disponibles',
      'Réservation de slots de retour vide',
      'Notification proactive aux transporteurs',
    ],
    confidence: 88,
    comprehension: 86,
  },
  {
    slug: 'instabilite-plateformes',
    cluster: 'SYSTEMES_IT',
    title: 'Instabilité plateformes (SIP/e-Guce/liaisons) et indisponibilités réseau',
    evidencePattern: 'Signalements de lenteur, “pas d’accès”, interruptions internet, pannes intermittentes.',
    frequencySignal: 'Signal très fort (motifs techniques et réseau les plus dominants en volume).',
    operationalNarrative:
      'Les interruptions numériques se traduisent immédiatement en blocages opérationnels et pertes de productivité.',
    rootCauses: [
      'Dépendance élevée à la disponibilité réseau',
      'Absence de mode dégradé pleinement industrialisé',
      'Observabilité technique incomplète côté utilisateurs',
    ],
    requiredData: {
      vessel: ['Evénements opérationnels corrélés aux coupures'],
      cargo: ['Transactions en échec/retry par type'],
      trade: ['Backlog dossiers pendant indisponibilité'],
      truck: ['Temps d’arrêt aux points d’accès durant panne'],
    },
    recommendedActions: [
      'Runbook mode dégradé avec reprise automatique',
      'Monitoring bout-en-bout et statut public de service',
      'Priorisation transactionnelle sur opérations critiques',
    ],
    confidence: 97,
    comprehension: 94,
  },
  {
    slug: 'synchronisation-kpi',
    cluster: 'COORDINATION',
    title: 'Latence entre validation concessionnaire et validation finale',
    evidencePattern: 'Cas récurrents où une validation intermédiaire est faite mais l’autorisation finale reste bloquée.',
    frequencySignal: 'Signal moyen-fort.',
    operationalNarrative:
      'Les utilisateurs ne savent pas où se situe exactement le blocage dans la chaîne décisionnelle.',
    rootCauses: [
      'Orchestration faible des responsabilités',
      'Faible transparence sur la “dernière validation manquante”',
      'Absence de tri automatique des cas urgents',
    ],
    requiredData: {
      vessel: ['Fenêtre opérationnelle restante'],
      cargo: ['Statuts intermédiaires horodatés'],
      trade: ['Criticité business du dossier'],
      truck: ['Temps d’attente cumulé par étape'],
    },
    recommendedActions: [
      'Traçage multi-étapes avec ownership explicite',
      'File prioritaire selon urgence et coût d’attente',
      'SLA contractuels visualisés côté user/admin',
    ],
    confidence: 89,
    comprehension: 87,
  },
  {
    slug: 'contraintes-horaires',
    cluster: 'OPERATIONNEL',
    title: 'Contraintes d’horaires et saturation des fenêtres de traitement',
    evidencePattern: 'Demandes d’ouverture week-end, expiration des tickets/gate pass, files prolongées.',
    frequencySignal: 'Signal moyen mais impact élevé.',
    operationalNarrative:
      'L’asymétrie entre horaires administratifs et contraintes terrain crée des pertes directes (détention, surestaries).',
    rootCauses: [
      'Planification horaire non alignée sur pics de demande',
      'Capacité de permanence limitée',
      'Peu de mécanismes automatiques de prorogation',
    ],
    requiredData: {
      vessel: ['Calendrier escales et pics de sortie'],
      cargo: ['Échéances documentaires'],
      trade: ['Coût financier des expirations'],
      truck: ['Données de files par tranche horaire'],
    },
    recommendedActions: [
      'Pilotage de capacité par shift',
      'Prorogation automatisée sous conditions',
      'Prévision de pics et activation de ressources de réserve',
    ],
    confidence: 86,
    comprehension: 85,
  },
  {
    slug: 'coherence-manifeste',
    cluster: 'REGLEMENTAIRE',
    title: 'Incohérences manifeste/référentiel et blocages de conformité',
    evidencePattern: 'Cas de BL absents du manifeste initial, besoin de rapprochement et reprise douane.',
    frequencySignal: 'Signal moyen.',
    operationalNarrative:
      'Une divergence de référentiel amont provoque des retards aval sur tout le cycle de sortie.',
    rootCauses: [
      'Qualité d’intégration documentaire',
      'Propagation tardive des corrections',
      'Workflow de régularisation peu standardisé',
    ],
    requiredData: {
      vessel: ['Manifestes versionnés', 'Corrections post-arrivée'],
      cargo: ['BL, rapprochement dossier'],
      trade: ['Règles conformité applicables'],
      truck: ['Impact sur timing de sortie'],
    },
    recommendedActions: [
      'Contrôle de cohérence préalable au traitement',
      'Pipeline de correction tracé et priorisé',
      'Réconciliation automatique des versions de manifeste',
    ],
    confidence: 82,
    comprehension: 84,
  },
]
