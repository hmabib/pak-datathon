import { ClusterType } from '@prisma/client'

export type DataRequirement = {
  vessel: string[]
  cargo: string[]
  trade: string[]
  truck: string[]
}

export type ClusterProblemType = {
  id: string
  cluster: ClusterType
  type: string
  challenge: string
  symptoms: string[]
  businessImpact: string[]
  requiredData: DataRequirement
  indicativeVolume: string
  analyticalComplexity: number
  recommendedMethods: string[]
}

export const clusterDescriptions: Record<ClusterType, { title: string; overview: string }> = {
  OPERATIONNEL: {
    title: 'Opérationnel',
    overview:
      'Goulots d’étranglement sur la chaîne d’exécution, variabilité des délais et saturation des ressources critiques.',
  },
  DOCUMENTAIRE: {
    title: 'Documentaire',
    overview:
      'Ruptures de flux informationnels, doublons et faible qualité documentaire freinant la fluidité des opérations.',
  },
  SYSTEMES_IT: {
    title: 'Systèmes IT',
    overview:
      'Faible interopérabilité et fragmentation applicative limitant la vision temps réel et la décision rapide.',
  },
  LOGISTIQUE_TRANSPORT: {
    title: 'Logistique transport',
    overview:
      'Désalignement entre capacités de transport, fenêtres de réception et profils de demande multimodale.',
  },
  REGLEMENTAIRE: {
    title: 'Réglementaire',
    overview:
      'Complexité des règles et contrôles, entraînant retards, coûts de conformité et incertitudes de traitement.',
  },
  FINANCIER: {
    title: 'Financier',
    overview:
      'Variabilité des coûts et manque de prévisibilité économique sur les flux import/export et de transit.',
  },
  INFRASTRUCTURE: {
    title: 'Infrastructure',
    overview:
      'Capacité physique contrainte, maintenance non optimisée et inadéquation entre charge et équipements.',
  },
  COORDINATION: {
    title: 'Coordination',
    overview:
      'Synchronisation insuffisante entre institutions, opérateurs et partenaires, générant des pertes de performance.',
  },
}

export const clusterProblemTypes: ClusterProblemType[] = [
  {
    id: 'ops-congestion-berth',
    cluster: 'OPERATIONNEL',
    type: 'Congestion des quais et fenêtres d’accostage',
    challenge:
      'Pics de trafic non absorbés, séquencement instable des navires et engorgement progressif des flux de sortie.',
    symptoms: ['Temps d’attente navires élevé', 'Rotation lente des équipements', 'Backlog des sorties camions'],
    businessImpact: ['Allongement cycle logistique', 'Surcoûts d’exploitation', 'Baisse de fiabilité de service'],
    requiredData: {
      vessel: ['ETA/ETD historiques', 'Temps opération quai', 'Type/navire/capacité'],
      cargo: ['Volumes par escale', 'Temps de traitement cargaison'],
      trade: ['Saisonnalité import/export'],
      truck: ['Entrées/sorties horaires', 'Temps de turnaround'],
    },
    indicativeVolume: '8 à 20 millions de lignes / 24 mois',
    analyticalComplexity: 4,
    recommendedMethods: ['Prévision de charge', 'Simulation événement discret', 'Optimisation de planning'],
  },
  {
    id: 'ops-yard-overflow',
    cluster: 'OPERATIONNEL',
    type: 'Saturation des zones de stockage',
    challenge: 'Empilement non optimisé et faible visibilité sur les priorités d’évacuation.',
    symptoms: ['Taux d’occupation élevé', 'Manutentions inutiles', 'Délais sortie prolongés'],
    businessImpact: ['Productivité réduite', 'Risque sécurité', 'Ralentissement du flux global'],
    requiredData: {
      vessel: ['Plan de déchargement', 'Séquences d’arrivée'],
      cargo: ['Position stock', 'Catégorie marchandise', 'Priorité opérationnelle'],
      trade: ['Destination finale', 'Fenêtres de livraison'],
      truck: ['Créneaux d’enlèvement', 'No-shows transporteurs'],
    },
    indicativeVolume: '5 à 12 millions de lignes / 12 mois',
    analyticalComplexity: 4,
    recommendedMethods: ['Slotting intelligent', 'Algorithmes de priorisation', 'Alerting temps réel'],
  },
  {
    id: 'doc-clearance-delay',
    cluster: 'DOCUMENTAIRE',
    type: 'Retards de validation documentaire',
    challenge: 'Documents incomplets et étapes d’approbation séquentielles à faible visibilité.',
    symptoms: ['Dossiers en attente', 'Rejets itératifs', 'Boucles de correction longues'],
    businessImpact: ['Immobilisation marchandises', 'Coûts administratifs', 'Insatisfaction parties prenantes'],
    requiredData: {
      vessel: ['Manifestes', 'Bordereaux navire'],
      cargo: ['Déclarations marchandises', 'Historique anomalies documentaires'],
      trade: ['Codes commerce international', 'Régimes de traitement'],
      truck: ['Documents de sortie', 'Preuves de livraison'],
    },
    indicativeVolume: '2 à 6 millions de documents/événements',
    analyticalComplexity: 3,
    recommendedMethods: ['NLP sur libellés', 'Scoring conformité', 'Workflow mining'],
  },
  {
    id: 'doc-traceability-gap',
    cluster: 'DOCUMENTAIRE',
    type: 'Manque de traçabilité des validations',
    challenge: 'Absence de piste d’audit unifiée entre acteurs et systèmes.',
    symptoms: ['Difficulté de justification', 'Statuts incohérents', 'Escalades fréquentes'],
    businessImpact: ['Risque conformité', 'Litiges', 'Perte de confiance opérationnelle'],
    requiredData: {
      vessel: ['Historique statut escale'],
      cargo: ['Journaux de validation', 'Horodatage modifications'],
      trade: ['Référentiels réglementaires versionnés'],
      truck: ['Logs checkpoints sortie'],
    },
    indicativeVolume: '1 à 4 millions d’événements auditables',
    analyticalComplexity: 3,
    recommendedMethods: ['Audit trail consolidé', 'Rule engine', 'Détection d’incohérences'],
  },
  {
    id: 'it-data-silos',
    cluster: 'SYSTEMES_IT',
    type: 'Silos applicatifs et données fragmentées',
    challenge: 'Absence de vue unifiée causant décisions tardives et arbitrages incomplets.',
    symptoms: ['KPIs contradictoires', 'Reporting manuel', 'Latence décisionnelle'],
    businessImpact: ['Pertes de performance', 'Risques d’erreur', 'Coûts IT élevés'],
    requiredData: {
      vessel: ['Flux AIS/escales', 'Systèmes planification'],
      cargo: ['WMS/TOS événements', 'Qualité master data'],
      trade: ['Statistiques commerce externe'],
      truck: ['TMS/portiques/gate logs'],
    },
    indicativeVolume: '15 à 60 millions de lignes multi-sources',
    analyticalComplexity: 5,
    recommendedMethods: ['Data lakehouse', 'MDM', 'Event streaming'],
  },
  {
    id: 'it-cyber-observability',
    cluster: 'SYSTEMES_IT',
    type: 'Observabilité et résilience insuffisantes',
    challenge: 'Incidents IT impactant continuité des opérations critiques.',
    symptoms: ['Indisponibilités récurrentes', 'Temps de reprise long', 'Alertes tardives'],
    businessImpact: ['Interruption de service', 'Risque cyber', 'Pertes économiques'],
    requiredData: {
      vessel: ['Disponibilité flux temps réel'],
      cargo: ['Logs applicatifs traitement'],
      trade: ['Intégrité référentiels'],
      truck: ['Télémetrie API externes'],
    },
    indicativeVolume: '10 à 30 millions de logs techniques',
    analyticalComplexity: 4,
    recommendedMethods: ['SRE dashboards', 'Anomaly detection', 'Runbooks automatisés'],
  },
  {
    id: 'log-last-mile-friction',
    cluster: 'LOGISTIQUE_TRANSPORT',
    type: 'Friction sur le dernier kilomètre logistique',
    challenge: 'Décalage entre disponibilité camions, créneaux et états réels des cargaisons.',
    symptoms: ['Files d’attente transport', 'Créneaux non tenus', 'Retours à vide'],
    businessImpact: ['Coût transport majoré', 'Congestion externe', 'Délais de livraison'],
    requiredData: {
      vessel: ['Disponibilité cargaison post-déchargement'],
      cargo: ['Statut readiness', 'Priorités expédition'],
      trade: ['Contraintes de livraison destination'],
      truck: ['GPS, horaires passage, capacité flotte'],
    },
    indicativeVolume: '6 à 18 millions d’événements mobilité',
    analyticalComplexity: 4,
    recommendedMethods: ['Optimisation tournées', 'Prévision no-show', 'Orchestration créneaux'],
  },
  {
    id: 'log-multimodal-mismatch',
    cluster: 'LOGISTIQUE_TRANSPORT',
    type: 'Désynchronisation multimodale',
    challenge: 'Flux navire, entrepôt et route non alignés dans le temps.',
    symptoms: ['Temps de rupture élevé', 'Utilisation sous-optimale moyens'],
    businessImpact: ['Baisse de throughput', 'Coût de coordination'],
    requiredData: {
      vessel: ['Planning escales'],
      cargo: ['Fenêtres manutention'],
      trade: ['Demandes expédition par corridor'],
      truck: ['Disponibilité transporteurs'],
    },
    indicativeVolume: '4 à 14 millions de lignes',
    analyticalComplexity: 3,
    recommendedMethods: ['Digital twin simplifié', 'Tableau synchronisation SLA'],
  },
  {
    id: 'reg-compliance-variability',
    cluster: 'REGLEMENTAIRE',
    type: 'Variabilité des délais de conformité',
    challenge: 'Règles multiples et cas d’exception traités manuellement.',
    symptoms: ['Cycle validation imprévisible', 'Taux de retours élevé'],
    businessImpact: ['Risque pénalité', 'Allongement lead time'],
    requiredData: {
      vessel: ['Documents exigés par type escale'],
      cargo: ['Historique contrôles/résultats'],
      trade: ['Nomenclatures et régimes'],
      truck: ['Conformité documents sortie'],
    },
    indicativeVolume: '1 à 5 millions de dossiers',
    analyticalComplexity: 3,
    recommendedMethods: ['Rule engine explicite', 'Risk-based routing'],
  },
  {
    id: 'reg-sensitive-cargo',
    cluster: 'REGLEMENTAIRE',
    type: 'Gestion des flux sensibles',
    challenge: 'Arbitrage entre sécurité, rapidité et conformité documentaire.',
    symptoms: ['Blocages préventifs', 'Escalades multiples'],
    businessImpact: ['Retards critiques', 'Risque réglementaire renforcé'],
    requiredData: {
      vessel: ['Type de navire/certifications'],
      cargo: ['Classification sensibilité', 'Historique inspections'],
      trade: ['Origine/destination/régime'],
      truck: ['Chaîne de custody'],
    },
    indicativeVolume: '0.5 à 2 millions de dossiers sensibles',
    analyticalComplexity: 4,
    recommendedMethods: ['Scoring de risque', 'Traçabilité renforcée'],
  },
  {
    id: 'fin-cost-opacity',
    cluster: 'FINANCIER',
    type: 'Opacité des coûts logistiques',
    challenge: 'Faible granularité des coûts unitaires par flux et par segment.',
    symptoms: ['Ecarts budgétaires récurrents', 'Arbitrages tardifs'],
    businessImpact: ['Marge compressée', 'Perte de compétitivité'],
    requiredData: {
      vessel: ['Coûts escale et attente'],
      cargo: ['Coûts manutention/stockage'],
      trade: ['Valeur flux import/export'],
      truck: ['Coût km, attente, carburant'],
    },
    indicativeVolume: '3 à 10 millions de lignes comptables/opérationnelles',
    analyticalComplexity: 4,
    recommendedMethods: ['Cost-to-serve', 'ABC costing', 'Forecast budgétaire'],
  },
  {
    id: 'fin-cash-cycle',
    cluster: 'FINANCIER',
    type: 'Cycle de trésorerie allongé',
    challenge: 'Décalage entre exécution opérationnelle et facturation/règlement.',
    symptoms: ['Retards d’encaissement', 'Contestations fréquentes'],
    businessImpact: ['Tension cash', 'Risque opérationnel'],
    requiredData: {
      vessel: ['Preuves de service'],
      cargo: ['Validation étapes de traitement'],
      trade: ['Conditions commerciales'],
      truck: ['Confirmations de livraison'],
    },
    indicativeVolume: '2 à 8 millions de transactions',
    analyticalComplexity: 3,
    recommendedMethods: ['Workflow financier intégré', 'Détection litiges'],
  },
  {
    id: 'infra-capacity-drift',
    cluster: 'INFRASTRUCTURE',
    type: 'Dérive capacité vs charge',
    challenge: 'Croissance des flux plus rapide que l’adaptation des infrastructures.',
    symptoms: ['Taux saturation chronique', 'Dégradation SLA'],
    businessImpact: ['Baisse performance globale', 'Risque de rupture'],
    requiredData: {
      vessel: ['Volumes escale long terme'],
      cargo: ['Densité occupation zones'],
      trade: ['Projection croissance flux'],
      truck: ['Pression trafic accès'],
    },
    indicativeVolume: 'Historique 36-60 mois, 10 à 25M lignes',
    analyticalComplexity: 4,
    recommendedMethods: ['Capacity planning', 'Scénarios d’investissement'],
  },
  {
    id: 'infra-maintenance-reactive',
    cluster: 'INFRASTRUCTURE',
    type: 'Maintenance majoritairement réactive',
    challenge: 'Arrêts non planifiés d’équipements critiques.',
    symptoms: ['Incidents répétés', 'Temps d’arrêt élevé'],
    businessImpact: ['Pertes de productivité', 'Coûts maintenance élevés'],
    requiredData: {
      vessel: ['Charge opérationnelle par équipement'],
      cargo: ['Cycles d’utilisation'],
      trade: ['Périodes de pic activité'],
      truck: ['Impact indisponibilité sur sortie'],
    },
    indicativeVolume: '1 à 4 millions d’événements maintenance',
    analyticalComplexity: 3,
    recommendedMethods: ['Maintenance prédictive', 'MTBF/MTTR analytics'],
  },
  {
    id: 'coord-multi-actor-latency',
    cluster: 'COORDINATION',
    type: 'Latence de décision multi-acteurs',
    challenge: 'Arbitrages impliquant plusieurs entités sans mécanisme unifié de priorisation.',
    symptoms: ['Réunions ad hoc multiples', 'Décisions contradictoires'],
    businessImpact: ['Temps de résolution long', 'Perte de valeur collective'],
    requiredData: {
      vessel: ['Statut opérations partagé'],
      cargo: ['File priorités commune'],
      trade: ['Impacts économiques consolidés'],
      truck: ['Contraintes transport consolidées'],
    },
    indicativeVolume: '2 à 7 millions d’événements coordination',
    analyticalComplexity: 4,
    recommendedMethods: ['Tableau de commandement partagé', 'Workflow décisionnel'],
  },
  {
    id: 'coord-knowledge-fragmentation',
    cluster: 'COORDINATION',
    type: 'Fragmentation de la connaissance opérationnelle',
    challenge: 'Les apprentissages des incidents ne sont pas capitalisés systématiquement.',
    symptoms: ['Répétition des incidents', 'Faible réutilisation des solutions'],
    businessImpact: ['Maturité opérationnelle faible', 'Cycle d’amélioration lent'],
    requiredData: {
      vessel: ['Historique incidents'],
      cargo: ['Actions correctives passées'],
      trade: ['Effets sur performance externe'],
      truck: ['Récurrence des goulots'],
    },
    indicativeVolume: '1 à 3 millions de logs + commentaires',
    analyticalComplexity: 2,
    recommendedMethods: ['Knowledge graph', 'Base de patterns incidents'],
  },
]

export function getDefaultDatasetsForCluster(cluster: ClusterType): string[] {
  const candidates = clusterProblemTypes.filter((entry) => entry.cluster === cluster)
  const merged = new Set<string>()
  candidates.forEach((entry) => {
    Object.values(entry.requiredData).forEach((items) => items.forEach((item) => merged.add(item)))
  })
  return Array.from(merged).slice(0, 10)
}
