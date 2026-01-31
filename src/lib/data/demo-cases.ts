import type { CaseJson } from '@/lib/types/case-types';

// ============================================================
// Demo Cases - Tower Operators (TDF France)
// Available in both English and French
// ============================================================

export const DEMO_CASE_TOWER_OPERATORS_EN: CaseJson = {
  meta: {
    case_id: 'tower_operators_tdf_france_en',
    title: 'Tower Operators (TDF France)',
    firm_style: 'Oliver Wyman',
    industry: 'Telecoms / Infrastructure (TowerCo)',
    topic: 'Market sizing & Market share (10 years)',
    difficulty: 'Intermediate',
    estimated_time_min: 25,
    tags: ['market-sizing', 'telecoms', 'infrastructure'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        'Your client is TDF, a company that builds and operates telecom infrastructure (towers) equipped with antennas for mobile internet. Historically, telecom operators owned their own towers, but they now rent space on towers owned by players like TDF.\n\nTDF asks you to assess the market in France over the next 10 years and answer: "What is the maximum market share we could reach in 10 years, and how?"',
      instruction: 'The client has just explained the problem. What clarification questions do you ask?',
      interaction_data: {
        options: [
          {
            text: 'What exactly is the business model: who pays for what, and for which service (space rental, co-location, etc.)?',
            is_correct: true,
            feedback: "Yes. Key info: operators (e.g., Bouygues, SFR, Free) rent space on TDF's towers.",
          },
          {
            text: 'What is TDF\'s current market share (by volume)?',
            is_correct: true,
            feedback: 'Yes. Key info: current market share = 14%.',
          },
          {
            text: 'What is the exact geographic scope of the analysis?',
            is_correct: true,
            feedback: 'Yes. Key info: France only.',
          },
          {
            text: 'What is the exact annual OPEX per tower, with a detailed breakdown (energy, security, maintenance)?',
            is_correct: false,
            feedback:
              'Not a priority at this stage: the prompt is about market share trajectory and capture logic, not fine-tuning cost optimization.',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Structuring',
      instruction: 'Take 2 minutes to structure your approach. What are your main workstreams?',
      interaction_data: {
        expected_keywords: [
          'current_market_size',
          '10_year_growth_drivers',
          'competition_new_entrants',
          'levers_to_maximize_market_share',
          'customer_retention',
          'increase_tower_capacity',
          'increase_number_of_customers',
        ],
        gold_standard_text:
          'Problem tree (consulting-style):\n1) Project the market over 10 years\n  a) Market size today (number of towers, and the "operators per tower" logic)\n  b) 10-year growth drivers (population, 4G/5G coverage, growth of connected devices, new use cases)\n  c) Competition (new entrants / specialists)\n2) Determine the maximum achievable market share\n  a) Existing base: current market share by volume\n  b) Share of growth that can be captured (assumption on growth addressability)\n3) Describe the "how" levers\n  a) Retain existing customers (long-term contracts, offering)\n  b) Increase tower capacity (R&D, densification, co-location)\n  c) Increase number of customers (encourage operators to group together, commercial approach)\n4) Test feasibility\n  a) Operational (supply, operations, technical capability, ability to operate nationwide)\n  b) Financial (funding capacity, debt)\n  c) Risks (competitive response, contract losses, feasibility)',
        gold_standard_image_desc:
          'Tree diagram: on the left the question "max market share in 10 years", then two main branches "market in 10 years" and "how to maximize our share". Under "market in 10 years": "size today", "drivers", "competition". Under "how": "retain customers", "increase tower capacity", "increase number of customers", each with example actions (long-term contracts, R&D, encourage operator grouping).',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Quantitative Analysis',
      context:
        'Data provided: 54,000 towers in France. Data demand grows by 6% per year over 10 years. Note: we want to express market size in number of towers (not number of antennas).',
      instruction:
        'Using the same approximation as in the case, how many towers will the French market have in 10 years?',
      interaction_data: {
        correct_value: 87400,
        tolerance_percent: 5,
        unit: 'towers',
        hint: 'The case uses a linear approximation: 10 years × 6% ≈ 60% total growth.',
        step_by_step_correction:
          '1) Current market: 54,000 towers.\n2) Annual growth: 6% for 10 years.\n3) Case approximation: 10 × 6% = 60% cumulative growth.\n4) 10-year market = 54,000 × (1 + 0.60) = 54,000 × 1.60 = 86,400.\n5) The case presents the result as 87.4k via 54k + 32.4k = 87.4k (rounding/presentation) and concludes "~87,000 towers".\n=> Expected value (slide calculation format): 87,400 towers (≈ 87,000).',
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Creativity & Risks',
      instruction:
        'What are the main risks or barriers to reaching a market share close to 1/3 in 10 years?',
      interaction_data: {
        checklist_correct_items: [
          'Competitive response (actions by other TowerCos / operators)',
          'Loss of existing contracts (concentrated market, few customers)',
          'Operational feasibility: supply (ability to source/build), operations (workforce), technical capability (operating many towers nationwide)',
          'Financial feasibility: funding capacity, debt capacity',
          'Customer risk: will the few large operators follow TDF on this trajectory?',
        ],
        explanation:
          'The case highlights an ambitious trajectory: capturing a large share of market growth. The main constraints are: (1) competitor reaction, (2) dependence on a few operators (contract loss/renegotiation), (3) industrial and operational capacity to deploy and operate more infrastructure nationwide, and (4) funding (capex, debt).',
      },
    },
    {
      step_id: 5,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'The CEO asks you for a final recommendation in 1 minute.',
      interaction_data: {
        required_elements: ['Recommendation (Go/No-Go)', 'Impact metric', 'Next Steps'],
        model_answer_text:
          'Recommendation: Go — targeting ~33% market share in 10 years is achievable based on the case assumptions.\n\nKey numbers: today, TDF represents 14% of 54k towers, i.e., ~12,000 towers. The market would grow to ~87k towers in 10 years (approx.). The "capturable" market growth is assumed to be 60% of growth: 32.4k × 60% = ~19,400 incremental towers. TDF would then reach ~31,400 towers, i.e., about 1/3 of the market (31.4k / 86.4k ≈ 33%).\n\nHow / Next steps: (1) secure long-term contracts with existing customers and validate contract duration/strength to support the growth-capture assumption, (2) ensure operational and financial capacity to deploy and run the footprint, (3) optimize capacity (densification/co-location, R&D, e.g., increase utilization per site) and implement a commercial plan to increase the number of customers.\n\nRisks to monitor: competitive response, contract losses (concentrated market), operational and financial feasibility.',
      },
    },
  ],
};

export const DEMO_CASE_TOWER_OPERATORS_FR: CaseJson = {
  meta: {
    case_id: 'tower_operators_tdf_france_fr',
    title: 'Tower Operators (TDF France)',
    firm_style: 'Oliver Wyman',
    industry: 'Télécoms / Infrastructures (TowerCo)',
    topic: 'Market sizing & Market share (10 ans)',
    difficulty: 'Intermediate',
    estimated_time_min: 25,
    tags: ['market-sizing', 'telecoms', 'infrastructure'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        "Votre client est TDF, une entreprise qui construit et opère des infrastructures télécoms (pylônes) équipées d'antennes pour l'internet mobile. Historiquement, les opérateurs télécoms possédaient leurs propres tours, mais ils louent désormais de l'espace sur des tours détenues par des acteurs comme TDF.\n\nTDF vous demande d'évaluer le marché en France sur les 10 prochaines années et de répondre : « Quelle est la part de marché maximale que nous pourrions atteindre en 10 ans, et comment ? »",
      instruction: "Le client vient de t'exposer le problème. Quelles questions de clarification poses-tu ?",
      interaction_data: {
        options: [
          {
            text: "Quel est exactement le business model : qui paie quoi, et pour quel service (location d'espace, colocation, etc.) ?",
            is_correct: true,
            feedback:
              "Oui. Info clé : des opérateurs (ex. Bouygues, SFR, Free) louent de l'espace sur les mâts de TDF.",
          },
          {
            text: 'Quelle est la part de marché actuelle de TDF (en volume) ?',
            is_correct: true,
            feedback: 'Oui. Info clé : part de marché actuelle = 14%.',
          },
          {
            text: "Quel est le périmètre géographique exact de l'analyse ?",
            is_correct: true,
            feedback: 'Oui. Info clé : France uniquement.',
          },
          {
            text: 'Quel est le coût exact (OPEX) annuel par tour, ventilation détaillée (énergie, sécurité, maintenance) ?',
            is_correct: false,
            feedback:
              "Ce n'est pas prioritaire à ce stade : l'énoncé demande une trajectoire de part de marché et une logique de capture, pas une optimisation fine des coûts.",
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Structuring',
      instruction: 'Prends 2 minutes pour structurer ton approche. Quels sont tes grands axes ?',
      interaction_data: {
        expected_keywords: [
          'taille_du_marche_aujourd_hui',
          'drivers_de_croissance_10_ans',
          'concurrence_nouveaux_entrants',
          'leviers_pour_maximiser_part_de_marche',
          'retention_clients',
          'augmentation_capacite_tours',
          'augmentation_nombre_clients',
        ],
        gold_standard_text:
          "Arbre de résolution (logique cabinet) :\n1) Projeter le marché à 10 ans\n  a) Taille du marché aujourd'hui (nombre de tours, et logique « opérateurs par tour »)\n  b) Drivers sur 10 ans (population, connectivité 4G/5G, croissance des devices connectés, nouveaux usages)\n  c) Concurrence (nouveaux entrants / spécialistes)\n2) Déterminer la part de marché maximale atteignable\n  a) Base existante : part de marché actuelle en volume\n  b) Part du growth capturable (hypothèse d'adressabilité de la croissance)\n3) Décrire les leviers « how »\n  a) Retenir les clients existants (contrats long-terme, offre)\n  b) Augmenter la capacité des tours (R&D, densification, colocation)\n  c) Augmenter le nombre de clients (inciter les opérateurs à se regrouper, approche commerciale)\n4) Tester la faisabilité\n  a) Opérationnelle (supply, opérations, technicité, capacité à opérer partout)\n  b) Financière (capacité de financement, dette)\n  c) Risques (réponse concurrentielle, perte de contrats, faisabilité)",
        gold_standard_image_desc:
          'Schéma en arbre : à gauche la question « max market share en 10 ans », puis deux branches principales « marché à 10 ans » et « comment maximiser notre part ». Sous « marché à 10 ans », des sous-branches « taille aujourd\'hui », « drivers », « concurrence ». Sous « comment », trois sous-branches « retenir clients », « augmenter capacité tours », « augmenter nombre de clients », chacune avec des actions (contrats long-terme, R&D, inciter regroupement opérateurs).',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Quantitative Analysis',
      context:
        "Données fournies : 54 000 tours en France. La demande de data croît de 6% par an sur 10 ans. Attention : on veut exprimer la taille de marché en nombre de tours (pas en nombre d'antennes).",
      instruction:
        'En approximant comme dans le cas, combien de tours comptera le marché français dans 10 ans ?',
      interaction_data: {
        correct_value: 87400,
        tolerance_percent: 5,
        unit: 'tours (pylônes)',
        hint: 'Le cas utilise une approximation linéaire : 10 ans × 6% ≈ 60% de croissance totale.',
        step_by_step_correction:
          "1) Marché actuel : 54 000 tours.\n2) Croissance annuelle : 6% pendant 10 ans.\n3) Approximation utilisée par le cas : 10 × 6% = 60% de croissance cumulée.\n4) Marché à 10 ans = 54 000 × (1 + 0,60) = 54 000 × 1,60 = 86 400.\n5) Le cas présente le résultat comme 87,4k via 54k + 32,4k = 87,4k (arrondi/présentation), et conclut « ~87 000 tours ».\n=> Valeur attendue (format calcul du slide) : 87 400 tours (≈ 87 000).",
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Creativity & Risks',
      instruction:
        "Quels sont les risques ou barrières majeurs pour atteindre une part de marché proche d'1/3 en 10 ans ?",
      interaction_data: {
        checklist_correct_items: [
          'Réponse concurrentielle (actions des autres TowerCos / opérateurs)',
          'Perte de contrats actuels (marché concentré, peu de clients)',
          "Faisabilité opérationnelle : supply (capacité à sourcer/construire), opérations (main-d'œuvre), technicité (opérer autant de tours partout)",
          "Faisabilité financière : capacité de financement, capacité d'endettement",
          'Risque « clients » : les quelques grands opérateurs suivront-ils TDF dans cette trajectoire ?',
        ],
        explanation:
          "Le cas insiste sur une trajectoire ambitieuse : capturer une grande partie de la croissance du marché. Les principaux freins sont : (1) la réaction des concurrents, (2) la dépendance à quelques opérateurs (perte/renégociation de contrats), (3) la capacité industrielle et opérationnelle à déployer et opérer plus d'infrastructures sur tout le territoire, et (4) le financement (capex, dette).",
      },
    },
    {
      step_id: 5,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'Le CEO te demande une recommandation finale en 1 minute.',
      interaction_data: {
        required_elements: ['Recommandation (Go/No-Go)', "Chiffre d'impact", 'Next Steps'],
        model_answer_text:
          "Recommandation : Go — viser ~33% de part de marché en 10 ans est atteignable sur la base des hypothèses du cas.\n\nChiffres clés : aujourd'hui, TDF représente 14% de 54k tours, soit ~12 000 tours. Le marché passerait à ~87k tours en 10 ans (approx.). La croissance de marché « capturable » est supposée être 60% de la croissance : 32,4k × 60% = ~19 400 tours additionnels. TDF atteindrait alors ~31 400 tours, soit environ 1/3 du marché (31,4k / 86,4k ≈ 33%).\n\nHow / Next steps : (1) sécuriser des contrats long-terme avec les clients existants et vérifier la durée/solidité des contrats pour valider l'hypothèse de capture de croissance, (2) s'assurer des capacités opérationnelles et financières pour déployer/faire fonctionner le parc, (3) optimiser la capacité (densification/colocation, R&D, ex. augmenter l'utilisation par site) et mettre en place un plan commercial pour augmenter le nombre de clients.\n\nRisques à monitorer : réponse concurrentielle, perte de contrats (marché concentré), faisabilité opérationnelle et financière.",
      },
    },
  ],
};

// ============================================================
// Demo Cases - Banking ATM Profitability
// Available in both English and French
// ============================================================

export const DEMO_CASE_ATM_PROFITABILITY_FR: CaseJson = {
  meta: {
    case_id: 'banque_distribution_rentabilite_filiale_dab',
    title: 'Banque & distribution — Rentabilité d\'une filiale DAB',
    firm_style: 'BCG',
    industry: 'Banking / Distribution',
    topic: 'Profitability / Cost Reduction',
    difficulty: 'Advanced',
    estimated_time_min: 35,
    tags: ['profitability', 'cost-reduction', 'banking', 'partnership'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        'Tu accompagnes la direction d\'une banque française de détail. Elle te demande d\'analyser la rentabilité de sa filiale en charge de la gestion des DAB (ATM). Les profits de la filiale diminuent depuis quelques années (environ -2% par an). Deux tendances sont mises en avant : (1) baisse structurelle de l\'usage du cash (paiements par carte), (2) prestataires très consolidés (souvent 1 à 3 fournisseurs par service), ce qui limite la pression concurrentielle et le pouvoir de négociation sur les coûts. Objectif : Identifier des leviers concrets pour inverser la baisse des profits et quantifier l\'impact des recommandations. Périmètre : France uniquement, filiale DAB (pas l\'ensemble des activités de la banque).',
      instruction: 'Quelles clarifications dois-tu poser tout de suite pour cadrer le problème (objectif, modèle éco, périmètre, coûts) ?',
      interaction_data: {
        options: [
          {
            text: 'Confirmer l\'objectif chiffré et l\'horizon : cherche-t-on bien à inverser une baisse de profit d\'environ -2% par an ?',
            is_correct: true,
            feedback: 'Objectif confirmé : inverser la baisse actuelle de profit d\'environ -2%/an.',
          },
          {
            text: 'Clarifier le modèle de revenus : la filiale gagne-t-elle via une commission (en % du montant retiré) et surtout sur les retraits de clients d\'autres banques ?',
            is_correct: true,
            feedback: 'Revenus = commission (% du montant retiré), particulièrement sur les retraits de clients d\'autres banques.',
          },
          {
            text: 'Valider le périmètre géographique : France uniquement ?',
            is_correct: true,
            feedback: 'Périmètre confirmé : France uniquement.',
          },
          {
            text: 'Clarifier la frontière de coûts : sécurité/électricité sont-elles portées par la filiale ou par les agences hébergeant les DAB ?',
            is_correct: true,
            feedback: 'Ces charges sont portées par les agences (les DAB y sont intégrés).',
          },
          {
            text: 'Demander la part de marché de la banque sur le crédit immobilier pour comprendre la rentabilité globale du groupe.',
            is_correct: false,
            feedback: 'Hors sujet : la mission vise la filiale DAB, pas la rentabilité globale du groupe.',
          },
          {
            text: 'Demander le NPS de l\'application mobile pour prioriser une refonte digitale.',
            is_correct: false,
            feedback: 'Pas prioritaire ici au regard du modèle économique (commissions sur retraits).',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Structuring',
      instruction: 'Comment décomposes-tu le problème pour trouver des leviers de profit, de façon MECE et actionnable ?',
      interaction_data: {
        expected_keywords: ['revenus', 'coûts', 'prix', 'volume', 'mix', 'prestataires'],
        gold_standard_text:
          'Structurer avec "Profit = Revenus – Coûts".\n\nCôté revenus :\n1) Levier prix (commission)\n2) Levier volume (nombre de retraits / montant moyen)\n3) Optimisation du mix/implantation des DAB\n\nCôté coûts :\nAnalyser les 4 postes liés aux prestataires (achat DAB, cash-in-transit, IT, maintenance) et identifier des leviers structurels (mutualisation/partenariats, optimisation des tournées, renégociation via volumes).',
        gold_standard_image_desc:
          'Arbre : objectif "inverser le déclin de profit -2%/an" → deux branches "Increase revenues" et "Reducing costs". Revenus : prix (élasticité, commission), volume (nb retraits / montant moyen), mix DAB. Coûts : achat DAB, cash-in-transit, IT, maintenance.',
      },
    },
    {
      step_id: 3,
      type: 'brainstorming',
      phase_name: 'Revenue Analysis - Price',
      instruction: 'Étude des revenus — Levier prix : que proposes-tu et quelle est la contrainte clé du marché ?',
      interaction_data: {
        checklist_correct_items: [
          'Proposer d\'analyser l\'élasticité prix (effet d\'une hausse de commission sur les volumes).',
          'Identifier la contrainte concurrentielle : 5 banques concurrentes aux parts de marché similaires.',
          'Conclure : une hausse de commission ferait basculer les clients vers les concurrents → levier prix non exploitable.',
        ],
        explanation:
          'Le cas attend que tu testes le levier prix mais que tu conclues qu\'il est bloqué par la concurrence : si on augmente la commission, les clients arbitrent vers d\'autres banques.',
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Revenue Analysis - Volume',
      instruction: 'Étude des revenus — Levier volume : quels sous-leviers tester et pourquoi sont-ils limités dans ce cas ?',
      interaction_data: {
        checklist_correct_items: [
          'Nombre de retraits : difficile à augmenter car l\'usage du cash baisse structurellement.',
          'Montant moyen : envisager un minimum de retrait plus élevé, mais impact incertain et risque de mécontentement/perte de clients.',
          'Mix DAB : supprimer les DAB les moins rentables (ex. rural vs urbain), mais contrainte client (maintien de la couverture territoriale).',
          'Conclusion : pas de levier revenus crédible dans ce cas.',
        ],
        explanation:
          'Le cas pousse à acter que les leviers revenus sont verrouillés : macro-tendance défavorable et contrainte stratégique de couverture qui empêche une optimisation agressive du réseau.',
      },
    },
    {
      step_id: 5,
      type: 'clarification',
      phase_name: 'Cost Deep-Dive',
      intro_context: 'On bascule sur les coûts. Les coûts principaux sont liés à 4 prestataires : achat de DAB, cash-in-transit (transport de cash), IT, maintenance. Une piste : mutualiser certains services via des partenariats avec des banques concurrentes (optimiser les tournées, augmenter les volumes pour mieux négocier).',
      instruction: 'Quelles clarifications posées maintenant permettent d\'ouvrir un levier coûts (notamment cash-in-transit) ?',
      interaction_data: {
        options: [
          {
            text: 'Confirmer la liste des 4 postes externalisés et leur poids relatif (achat DAB, cash-in-transit, IT, maintenance).',
            is_correct: true,
            feedback: 'Les 4 postes clés sont : achat de DAB, cash-in-transit, IT, maintenance.',
          },
          {
            text: 'Sur une tournée cash-in-transit, le prestataire transporte-t-il uniquement pour notre banque ou également pour d\'autres banques ?',
            is_correct: true,
            feedback: 'Aujourd\'hui : uniquement pour notre banque (pas de mutualisation).',
          },
          {
            text: 'Valider que sécurité/électricité sont portées par les agences et donc hors périmètre de la filiale.',
            is_correct: true,
            feedback: 'Oui : ces charges sont portées par les agences.',
          },
          {
            text: 'Demander le taux d\'attrition des utilisateurs de l\'application mobile pour estimer l\'élasticité aux commissions.',
            is_correct: false,
            feedback: 'Ce n\'est pas le bon niveau d\'analyse ici : le levier prix est déjà considéré non exploitable.',
          },
          {
            text: 'Demander la politique RH des agences pour réduire le temps d\'attente au guichet.',
            is_correct: false,
            feedback: 'Hors périmètre : la problématique est centrée sur les coûts prestataires du réseau DAB.',
          },
        ],
      },
    },
    {
      step_id: 6,
      type: 'brainstorming',
      phase_name: 'Cost Reduction Strategy',
      instruction: 'Réduction des coûts : comment un partenariat avec des banques concurrentes peut-il faire baisser les coûts des prestataires ?',
      interaction_data: {
        checklist_correct_items: [
          'Cash-in-transit : mutualiser les tournées entre banques proches pour réduire les coûts de déplacement et améliorer le taux d\'utilisation des routes.',
          'Maintenance : mutualiser les interventions sur une zone (planification commune) pour réduire temps de trajet et coûts unitaires.',
          'Achat de DAB et IT : obtenir de meilleurs tarifs via l\'effet volume (contrats plus gros / standardisation).',
        ],
        explanation:
          'Le mécanisme central : économies d\'échelle (volume) et optimisation opérationnelle (tournées / interventions).',
      },
    },
    {
      step_id: 7,
      type: 'calculation',
      phase_name: 'Quantitative Analysis',
      context:
        'Données : 10 000 DAB ; 40% ruraux / 60% urbains ; durée de vie 10 ans ; prix d\'achat = 15 000 € ; OPEX = 10 000 € par DAB et par an. Effet partenariat : OPEX -10% rural et -20% urbain ; CAPEX -20%.',
      instruction: 'Quel est le montant d\'économies annuelles totales (Delta coûts) générées par le partenariat ?',
      interaction_data: {
        correct_value: 19,
        tolerance_percent: 5,
        unit: 'M€ / an',
        hint: 'Avant partenariat = OPEX total + CAPEX annualisé (remplacements/an × coût d\'achat). Après partenariat = appliquer les baisses OPEX par segment + baisse CAPEX sur les remplacements annuels.',
        step_by_step_correction:
          '1) Avant partenariat :\n- OPEX = 10 000 × 10 000 € = 100 M€\n- CAPEX annualisé = (10 000 DAB / 10 ans) × 15 000 € = 1 000 × 15 000 € = 15 M€\n- Total = 115 M€\n\n2) Après partenariat :\n- Urbain : 60% × 10 000 = 6 000 DAB ; OPEX remisé 20% → 10 000 × 0,8 = 8 000 €\n  → OPEX urbain = 6 000 × 8 000 € = 48 M€\n- Rural : 40% × 10 000 = 4 000 DAB ; OPEX remisé 10% → 10 000 × 0,9 = 9 000 €\n  → OPEX rural = 4 000 × 9 000 € = 36 M€\n- OPEX total = 48 + 36 = 84 M€\n- CAPEX annualisé : 1 000 remplacements/an ; remise 20% → 15 000 × 0,8 = 12 000 €\n  → CAPEX = 1 000 × 12 000 € = 12 M€\n- Total après = 84 + 12 = 96 M€\n\n3) Économie annuelle = 115 − 96 = 19 M€.',
      },
    },
    {
      step_id: 8,
      type: 'brainstorming',
      phase_name: 'Risks & Next Steps',
      instruction: 'Avant de recommander le partenariat, quels risques et \'next steps\' dois-tu cadrer ?',
      interaction_data: {
        checklist_correct_items: [
          'Faisabilité : les banques concurrentes accepteront-elles de coopérer ?',
          'Timing et complexité : combien de mois/années de négociation, et sur quels verticals (cash-in-transit, maintenance, achats DAB/IT) ?',
          'Risque stratégique : dépendance accrue vis-à-vis d\'autres banques (et gouvernance du partenariat).',
        ],
        explanation:
          'Le slide de conclusion attend explicitement un plan de suite : tester l\'appétit des concurrents, estimer la durée de négociation et choisir les périmètres de mutualisation. Risque clé mentionné : dépendance accrue à d\'autres banques.',
      },
    },
    {
      step_id: 9,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'Le CEO entre dans la pièce. Conclus en 30–45 secondes : recommandation, impact chiffré, risques et prochaine étape.',
      interaction_data: {
        required_elements: ['Recommandation', 'Impact chiffré', 'Risque/Next step'],
        model_answer_text:
          'Aujourd\'hui, nos leviers de revenus sont bloqués : le levier prix est contraint par une concurrence forte (5 acteurs à parts équivalentes) et les leviers volume/mix sont limités par la baisse structurelle du cash et par l\'exigence de couverture territoriale.\n\nEn revanche, nous avons un levier coûts significatif : mettre en place un partenariat opérationnel avec des banques concurrentes pour mutualiser les tournées de cash-in-transit et de maintenance, et renforcer notre pouvoir de négociation sur l\'achat de DAB et les services IT via des volumes plus élevés. Sur la base des données, l\'impact attendu est d\'environ 19 M€ d\'économies annuelles (115 M€ avant vs 96 M€ après).\n\nProchaines étapes : lancer une étude de faisabilité (quelles banques acceptent, quels périmètres), estimer la durée de négociation et piloter un test sur une zone prioritaire. Principal risque à cadrer : la dépendance accrue vis-à-vis d\'autres banques (gouvernance, modalités contractuelles).',
      },
    },
  ],
};

export const DEMO_CASE_ATM_PROFITABILITY_EN: CaseJson = {
  meta: {
    case_id: 'banking_distribution_atm_profitability',
    title: 'Banking & Distribution — ATM Subsidiary Profitability',
    firm_style: 'BCG',
    industry: 'Banking / Distribution',
    topic: 'Profitability / Cost Reduction',
    difficulty: 'Advanced',
    estimated_time_min: 35,
    tags: ['profitability', 'cost-reduction', 'banking', 'partnership'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        'You are working with the leadership team of a French retail bank. They ask you to analyze the profitability of their ATM (DAB) management subsidiary. The subsidiary\'s profits have been declining for a few years (around -2% per year). Two trends are highlighted: (1) structural decline in cash usage as card payments increase; (2) very consolidated service providers (typically 1 to 3 suppliers per service), meaning limited competitive pressure and reduced negotiating leverage on costs. Objective: Identify concrete levers to reverse the profit decline and quantify the impact of your recommendations. Scope: France only. Focus on the ATM subsidiary (not the full bank).',
      instruction: 'Which clarifications should be asked immediately to frame the problem (objective, business model, scope, costs)?',
      interaction_data: {
        options: [
          {
            text: 'Confirm the quantified objective and time horizon: are we trying to offset a profit decline of -2% per year?',
            is_correct: true,
            feedback: 'Objective confirmed: reverse the current profit decline of about -2%/year.',
          },
          {
            text: 'Clarify the revenue model: how does the subsidiary make money (fee as a % of the withdrawal amount) and from whom (customers of other banks)?',
            is_correct: true,
            feedback: 'Revenue = fee (% of the withdrawal amount), especially charged when customers from other banks withdraw from our ATMs.',
          },
          {
            text: 'Validate the geographic scope: France only or international?',
            is_correct: true,
            feedback: 'Scope: France only.',
          },
          {
            text: 'Ask whether electricity/security costs are borne by the subsidiary or by the branches hosting the ATMs.',
            is_correct: true,
            feedback: 'These charges (security, electricity, etc.) are borne by branches: ATMs are integrated there. Do not over-analyze if outside the subsidiary\'s scope.',
          },
          {
            text: 'Measure the bank\'s market share in mortgages to understand overall group profitability.',
            is_correct: false,
            feedback: 'Out of scope: the assignment is about the ATM subsidiary, not the group\'s lending businesses.',
          },
          {
            text: 'Ask for NPS and digital satisfaction scores to estimate the impact of a mobile app redesign.',
            is_correct: false,
            feedback: 'Not a priority given the described business model (fees linked to cash withdrawals).',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Structuring',
      instruction: 'How do you break down the problem to find profit levers, in a MECE and actionable way?',
      interaction_data: {
        expected_keywords: ['revenues', 'costs', 'price', 'volume', 'mix', 'providers'],
        gold_standard_text:
          'Start with a "Profit = Revenues – Costs" decomposition.\n\nOn revenues:\n1) Price lever: increase the % fee per withdrawal\n2) Volume lever: increase the number of withdrawals and/or the average amount withdrawn\n3) Optimize the ATM mix (e.g., rural vs urban, remove the least profitable)\n\nOn costs:\nAnalyze the four provider-driven cost buckets (ATM purchase, cash-in-transit, IT, maintenance) and look for structural levers (pooling/partnerships, route optimization, renegotiation through higher volumes).',
        gold_standard_image_desc:
          'Tree with the objective "reverse profit decline -2%/year", then 2 branches: "Increase revenues" (price lever -> elasticity analysis -> increase fee; volume lever -> drive more withdrawals / increase average amount; ATM mix study) and "Reducing costs" (ATM purchase, cash-in-transit, IT, maintenance).',
      },
    },
    {
      step_id: 3,
      type: 'brainstorming',
      phase_name: 'Revenue Analysis - Price',
      instruction: 'Revenue analysis — Price lever: what do you propose, and what is the key market constraint?',
      interaction_data: {
        checklist_correct_items: [
          'Propose analyzing price elasticity (impact of a fee increase on withdrawal volume).',
          'Identify the competitive constraint: 5 competing banks with similar market shares.',
          'Conclude: if we increase the fee, customers switch to competitors → no viable price lever.',
        ],
        explanation:
          'Even if the candidate suggests an elasticity analysis, the interviewer indicates the market is highly competitive (5 players with similar shares). A fee increase would divert demand to competitors. Interim conclusion: no exploitable price lever to grow revenues.',
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Revenue Analysis - Volume',
      instruction: 'Revenue analysis — Volume lever: which sub-levers would you test, and why do they fail in this case?',
      interaction_data: {
        checklist_correct_items: [
          'Number of withdrawals: hard to increase because cash usage is structurally declining.',
          'Average amount: test a higher minimum withdrawal, but limited impact and risk of losing customers.',
          'ATM mix: consider removing the least profitable ATMs (e.g., rural vs city), but the client refuses because they want to maintain territorial coverage.',
          'Conclusion: no leverage on volumes → no revenue lever.',
        ],
        explanation:
          'The case pushes you to recognize revenue growth levers are blocked: macro trend (less cash), potentially counterproductive volume measures (minimum withdrawal), and a strategic constraint (territorial coverage) that prevents mix optimization. Interim conclusion: no relevant revenue lever.',
      },
    },
    {
      step_id: 5,
      type: 'clarification',
      phase_name: 'Cost Deep-Dive',
      intro_context: 'We switch to costs. The main costs are linked to four providers: ATM purchase, cash-in-transit (cash transport), IT, and maintenance. One suggested path: pool services through partnerships with competing banks (optimize routes, increase volumes to negotiate better).',
      instruction: 'Which clarifying questions unlock a cost lever (cash-in-transit process and scope of cost items)?',
      interaction_data: {
        options: [
          {
            text: 'What are the four outsourced services and their providers (ATM purchase, cash-in-transit, IT, maintenance)?',
            is_correct: true,
            feedback: 'Key costs are linked to these four providers: ATM purchase, cash-in-transit, IT, maintenance.',
          },
          {
            text: 'During a cash-in-transit route, do carriers transport only for our bank or also for other banks?',
            is_correct: true,
            feedback: 'Today, they transport only for our bank (no pooling).',
          },
          {
            text: 'Are security/electricity costs borne by branches (and therefore out of scope for the subsidiary)?',
            is_correct: true,
            feedback: 'Yes: these charges are borne by the branches where ATMs are integrated.',
          },
          {
            text: 'What is the card failure rate for end customers, and its impact on withdrawals?',
            is_correct: false,
            feedback: 'Not a priority: the issue sits in the cost structure of ATM services, not card technology.',
          },
          {
            text: 'What is the branches\' marketing budget to stimulate cash withdrawals via advertising campaigns?',
            is_correct: false,
            feedback: 'Not very relevant here: the case already established there is no credible revenue/volume lever.',
          },
        ],
      },
    },
    {
      step_id: 6,
      type: 'brainstorming',
      phase_name: 'Cost Reduction Strategy',
      instruction: 'Cost reduction: how can a partnership with competing banks reduce provider costs?',
      interaction_data: {
        checklist_correct_items: [
          'Cash-in-transit: pool routes between nearby banks to reduce travel costs (truck/security) and increase route utilization.',
          'Maintenance: pool interventions in a zone (nearby banks) to reduce travel time and unit costs.',
          'ATM purchase and IT: negotiate better prices through higher purchase volumes / larger contracts (scale effect).',
        ],
        explanation:
          'The core cost recommendation is pooling with competitors: reduce variable route-driven costs (cash-in-transit, maintenance) and obtain better terms by increasing volumes (ATM purchase, IT).',
      },
    },
    {
      step_id: 7,
      type: 'calculation',
      phase_name: 'Quantitative Analysis',
      context:
        'Data: 10,000 ATMs; 40% rural / 60% urban; 10-year lifetime; ATM purchase = €15,000; OPEX = €10,000 per ATM per year. Partnership effect: OPEX -10% rural and -20% urban; CAPEX -20%. The solution computes annual costs before and after partnership.',
      instruction: 'What is the total annual savings (cost delta) generated by the partnership?',
      interaction_data: {
        correct_value: 19,
        tolerance_percent: 5,
        unit: 'M€ / year',
        hint: 'Before partnership: compute total annual OPEX + annualized CAPEX (purchase spread over 10 years). After partnership: apply OPEX discounts by segment (urban vs rural) and CAPEX discount on annual replacements.',
        step_by_step_correction:
          '1) Before partnership:\n- OPEX = 10,000 ATMs × €10,000 = €100M\n- Annualized CAPEX = (10,000 ATMs / 10 years) × €15,000 = 1,000 × €15,000 = €15M\n- Total = €115M\n\n2) After partnership:\n- Urban: 60% × 10,000 = 6,000 ATMs; OPEX discounted 20% → €10,000 × 0.8 = €8,000\n  → Urban OPEX = 6,000 × €8,000 = €48M\n- Rural: 40% × 10,000 = 4,000 ATMs; OPEX discounted 10% → €10,000 × 0.9 = €9,000\n  → Rural OPEX = 4,000 × €9,000 = €36M\n- Total OPEX = 48 + 36 = €84M\n- Annualized CAPEX: 1,000 replacements/year; 20% discount → €15,000 × 0.8 = €12,000\n  → CAPEX = 1,000 × €12,000 = €12M\n- Total after = 84 + 12 = €96M\n\n3) Annual savings = 115 − 96 = €19M.',
      },
    },
    {
      step_id: 8,
      type: 'brainstorming',
      phase_name: 'Risks & Next Steps',
      instruction: 'Before recommending the partnership, which risks and next steps should you frame?',
      interaction_data: {
        checklist_correct_items: [
          'Feasibility: will competing banks agree to cooperate?',
          'Timing and complexity: how many months/years of negotiation, and on which verticals (cash-in-transit, maintenance, ATM purchases/IT)?',
          'Strategic risk: increased dependency on other banks (and partnership governance).',
        ],
        explanation:
          'The conclusion slide explicitly expects a next-step plan: test competitors\' appetite, estimate negotiation duration, and choose the pooling scope. Key risk mentioned: increased dependency on other banks.',
      },
    },
    {
      step_id: 9,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'The CEO walks in. Conclude in 30–45 seconds: recommendation, quantified impact, risks, and next step.',
      interaction_data: {
        required_elements: ['Recommendation', 'Quantified impact', 'Risk/Next step'],
        model_answer_text:
          'Today, our revenue levers are blocked: the price lever is constrained by strong competition (5 players with similar shares), and volume/mix levers are limited by the structural decline of cash usage and the requirement to maintain territorial coverage.\n\nHowever, we have a significant cost lever: set up an operational partnership with competing banks to pool cash-in-transit and maintenance routes, and strengthen our negotiating power on ATM purchases and IT services through higher volumes. Based on the data, the expected impact is about €19M in annual savings (€115M before vs €96M after).\n\nNext steps: run a feasibility assessment (which banks are willing, which scopes), estimate negotiation duration, and pilot a test in a priority area. Main risk to manage: increased dependency on other banks (governance, contractual terms).',
      },
    },
  ],
};

// ============================================================
// Demo Cases - McDonald's EV Chargers
// Available in both English and French
// ============================================================

export const DEMO_CASE_MCDONALDS_EV_FR: CaseJson = {
  meta: {
    case_id: 'mcdonalds_bornes_recharge_choix_exploitation',
    title: "McDonald's — Installation de bornes de recharge",
    firm_style: 'McKinsey',
    industry: 'Restaurant / Energy',
    topic: 'Comparative Analysis / Investment Decision',
    difficulty: 'Intermediate',
    estimated_time_min: 30,
    tags: ['comparative', 'investment', 'restaurant', 'energy', 'ev-charging'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        "McDonald's souhaite installer des bornes de recharge électrique sur ses restaurants (restaurants en propre et franchisés). L'entreprise hésite sur le modèle opérationnel : (A) externaliser l'exploitation à un opérateur spécialisé (qui paie un loyer et encaisse les ventes d'électricité) ou (B) internaliser en achetant et exploitant les bornes (objectif : vendre l'électricité à prix coûtant). Objectif : Décider si c'est une bonne idée et, surtout, quelle option choisir, en veillant à ne pas perdre d'argent tout en augmentant le trafic en restaurant. Périmètre : France (McDonald's a ~1 200 restaurants), mais l'évaluation financière doit être faite à l'échelle d'un seul restaurant puis extrapolée.",
      instruction: 'Quelles clarifications sont indispensables AVANT de lancer les calculs ?',
      interaction_data: {
        options: [
          {
            text: 'Confirmer le critère de décision : "ne pas perdre d\'argent" (break-even ou profit positif) tout en augmentant le trafic.',
            is_correct: true,
            feedback: 'Objectif confirmé : augmenter le trafic en restaurant sans perdre d\'argent.',
          },
          {
            text: 'Valider le périmètre de calcul : on raisonne sur un seul restaurant (puis extrapolation ~1 200 restaurants).',
            is_correct: true,
            feedback: 'Le cas demande d\'évaluer les deux options à l\'échelle d\'un restaurant.',
          },
          {
            text: 'Clarifier le business model de l\'option 1 : qui encaisse la vente d\'électricité et que reçoit McDonald\'s (loyer + royalties) ?',
            is_correct: true,
            feedback: 'Option 1 : l\'opérateur encaisse l\'électricité ; McDonald\'s reçoit un loyer par borne + des royalties (% des ventes d\'électricité).',
          },
          {
            text: 'Demander la satisfaction client sur les menus (NPS) pour estimer l\'impact des bornes sur l\'image de marque.',
            is_correct: false,
            feedback: 'Intéressant, mais ce n\'est pas la priorité : la décision repose d\'abord sur la rentabilité relative des deux options.',
          },
          {
            text: 'Demander la structure de coûts du Big Mac (matières premières vs personnel) pour recalculer la marge de la chaîne.',
            is_correct: false,
            feedback: 'Hors scope : le cas fournit une marge simplifiée par client ; on ne refait pas toute la comptabilité produit.',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Framework',
      instruction: 'Propose une structure MECE pour répondre : "Est-ce une bonne idée et quelle option choisir ?"',
      interaction_data: {
        expected_keywords: ['opportunité', 'rentabilité', 'option 1', 'option 2', 'trafic', 'risques'],
        gold_standard_text:
          'Le cas suit un pattern comparatif :\n\n1) Cadrer l\'opportunité (où déployer, combien de bornes, type de charge)\n\n2) Calculer la rentabilité de chaque option séparément :\n   - Option 1 : revenus loyer + royalties\n   - Option 2 : coûts annualisés\n\n3) Estimer le profit additionnel lié au trafic en restaurant (commun aux deux options)\n\n4) Conclure sur le meilleur choix en combinant finance + risques opérationnels / concurrentiels.',
        gold_standard_image_desc:
          'Arbre de structure avec deux blocs : "Opportunity assessment" (flux clients additionnel + termes de l\'offre ; demande EV ; supply ; restaurants ciblés ; type de bornes) et "Which option should you choose?" (revenu additionnel identique dans les deux cas via le flux clients ; Option 1 = revenus de loyer/royalties ; Option 2 = coûts d\'installation/maintenance).',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Option 1 Analysis',
      context:
        'Option 1 — Externaliser l\'exploitation (opérateur installe et exploite).\n\nDonnées : 6 bornes ; prix électricité = 0,60 €/kWh ; puissance/énergie par charge = 80 kWh ; durée d\'ouverture = 20 h/jour ; taux d\'occupation = 10% ; royalties = 10% ; loyer = 2 000 €/borne/an.',
      instruction: 'Quel est le profit annuel additionnel de l\'Option 1 (hors effet trafic restaurant) pour UN restaurant ?',
      interaction_data: {
        correct_value: 33000,
        unit: '€ / an',
        tolerance_percent: 5,
        hint: 'Recettes = loyer par borne + royalties sur la vente d\'électricité. Royalties = (% royalties) × (prix/kWh) × (énergie délivrée) × (temps d\'utilisation).',
        step_by_step_correction:
          '1) Royalties/jour = 6 bornes × 20 h/j × 10% × 0,60 € × 80 kWh × 10%\n= 6 × 20 × 0,1 × 0,6 × 80 × 0,1\n= 57,6 €/jour.\n\n2) Royalties/an = 57,6 × 365 = 21 024 €/an (≈ 21 000 €/an).\n\n3) Loyer/an = 6 × 2 000 = 12 000 €/an.\n\n4) Profit Option 1 (hors trafic) = 21 024 + 12 000 = 33 024 €/an (≈ 33 000 €/an).',
      },
    },
    {
      step_id: 4,
      type: 'calculation',
      phase_name: 'Option 2 Analysis',
      context:
        'Option 2 — Internaliser (McDonald\'s achète et exploite les bornes ; vente d\'électricité à prix coûtant).\n\nDonnées : investissement initial = 40 000 €/borne ; 6 bornes ; installation = 10 000 € (one-shot) ; maintenance = 8 000 €/an ; durée de vie = 10 ans.',
      instruction: 'Quel est le coût annuel (annualisé) de l\'Option 2 pour UN restaurant (sur les 10 premières années) ?',
      interaction_data: {
        correct_value: 33000,
        unit: '€ / an',
        tolerance_percent: 5,
        hint: 'Coûts = investissement initial par borne + installation (one-shot) + maintenance annuelle. Annualiser l\'investissement et l\'installation sur la durée de vie (10 ans).',
        step_by_step_correction:
          '1) CAPEX total initial = 40 000 × 6 + 10 000 = 240 000 + 10 000 = 250 000 €.\n2) CAPEX annualisé = 250 000 / 10 = 25 000 €/an.\n3) Coût total annuel = 25 000 + 8 000 = 33 000 €/an.\n\nComme l\'électricité est vendue à prix coûtant, il n\'y a pas de revenu "électricité" : l\'Option 2 génère donc une charge nette de 33 000 €/an (sur les 10 premières années).',
      },
    },
    {
      step_id: 5,
      type: 'calculation',
      phase_name: 'Traffic Impact',
      context:
        'Hypothèses trafic : pour simplifier, on suppose que 100% de l\'occupation des bornes correspond à de NOUVEAUX clients. Un repas coûte ~10 € et la marge est 20% → profit ~2 € par client. On compte 1 personne par voiture. Chaque charge dure 30 minutes.',
      instruction: 'Quel est le profit annuel additionnel généré par le trafic en restaurant (commun aux deux options) pour UN restaurant ?',
      interaction_data: {
        correct_value: 17520,
        unit: '€ / an',
        tolerance_percent: 5,
        hint: 'Chaque charge dure 30 minutes → 2 charges par heure et par borne. Sessions/an = bornes × heures/jour × (60/30) × taux d\'occupation × 365. Profit = clients × profit/client.',
        step_by_step_correction:
          '1) Charges/heure/borne = 60/30 = 2.\n2) Sessions/jour = 6 bornes × 20 h × 2 × 10% = 6 × 20 × 2 × 0,1 = 24 sessions/jour.\n3) Nouveaux clients/an = 24 × 365 = 8 760.\n4) Profit additionnel/an = 8 760 × 2 € = 17 520 €/an.',
      },
    },
    {
      step_id: 6,
      type: 'calculation',
      phase_name: 'Final Comparison',
      context: 'On combine maintenant la finance "bornes" (Option 1 vs Option 2) avec le profit trafic (commun).',
      instruction: 'Quelle est la profitabilité nette annuelle par restaurant pour chaque option (en incluant le trafic) ?',
      interaction_data: {
        correct_value: 50520,
        unit: '€ / an (Option 1)',
        tolerance_percent: 5,
        hint: 'Option 1 nette = profit bornes + profit trafic. Option 2 nette = profit trafic − coût annualisé.',
        step_by_step_correction:
          'Option 1 nette = profit bornes (≈ 33 000) + profit trafic (17 520) = 50 520 €/an (≈ 50k).\nOption 2 nette = profit trafic (17 520) − coût annualisé (33 000) = −15 480 €/an (≈ −15,5k).\n\nConclusion quantitative : l\'option 1 est largement positive, l\'option 2 reste déficitaire même après trafic.',
      },
    },
    {
      step_id: 7,
      type: 'clarification',
      phase_name: 'Strategic Choice',
      instruction: 'Quelle option recommandes-tu et pourquoi (en 2–3 arguments) ?',
      interaction_data: {
        options: [
          {
            text: 'Choisir l\'Option 1 (externaliser) : profit net ~50k€/restaurant/an, aucun CAPEX/risque d\'exploitation pour McDonald\'s, et le trafic s\'ajoute en bonus.',
            is_correct: true,
            feedback: 'C\'est la conclusion du cas : l\'Option 1 génère une double source de valeur (loyer+royalties) + profit trafic.',
          },
          {
            text: 'Choisir l\'Option 2 (internaliser) : on garde le contrôle et l\'autonomie énergétique, même si cela coûte ~33k€/an.',
            is_correct: false,
            feedback: 'Le cas indique que l\'Option 2 ne s\'autofinance pas : même avec le trafic, elle reste déficitaire (~-15,5k€/an).',
          },
          {
            text: 'Ne rien faire : les bornes attirent des clients \'non-consommateurs\', donc il faut éviter tout déploiement.',
            is_correct: false,
            feedback: 'Le risque existe, mais il se gère (ciblage, offre, incitations). Le cas recommande bien d\'installer des bornes, en choisissant l\'Option 1.',
          },
        ],
      },
    },
    {
      step_id: 8,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'Le CEO entre dans la pièce. Fais une recommandation structurée (reco, justification, next steps, risques).',
      interaction_data: {
        required_elements: ['Recommandation', 'Impact chiffré', 'Extrapolation', 'Next steps', 'Risques'],
        model_answer_text:
          'Nous recommandons d\'installer des bornes de recharge rapide et de choisir l\'Option 1 (externalisation). Financièrement, l\'Option 1 génère ~33k€ de profit annuel par restaurant (loyer + royalties) et, en ajoutant l\'effet trafic estimé à ~17,5k€, on atteint ~50k€ de profit net par restaurant et par an. À l\'échelle d\'environ 1 200 restaurants, cela représente un ordre de grandeur proche de ~60M€ de profit additionnel annuel.\n\nÀ l\'inverse, l\'Option 2 (internalisation) coûte ~33k€/an par restaurant et reste déficitaire même après trafic (~-15,5k€/an), donc elle n\'est pas attractive.\n\nNext steps : (1) cibler les restaurants les plus pertinents (emplacements/flux, routes, zones à forte adoption EV), (2) contractualiser avec un ou deux opérateurs, (3) lancer une campagne marketing locale pour faire connaître le service.\n\nRisques : réaction concurrentielle des autres chaînes de restauration rapide et risque opérationnel de "chargeurs non-consommateurs" (mitigation via ciblage, design de l\'offre, incitations à l\'achat en restaurant).',
      },
    },
  ],
};

export const DEMO_CASE_MCDONALDS_EV_EN: CaseJson = {
  meta: {
    case_id: 'mcdonalds_ev_chargers_operating_model_choice',
    title: "McDonald's — Installing EV Charging Stations",
    firm_style: 'McKinsey',
    industry: 'Restaurant / Energy',
    topic: 'Comparative Analysis / Investment Decision',
    difficulty: 'Intermediate',
    estimated_time_min: 30,
    tags: ['comparative', 'investment', 'restaurant', 'energy', 'ev-charging'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        "McDonald's wants to install electric vehicle (EV) charging stations at its restaurants (company-owned and franchised). The company is unsure about the operating model: (A) outsource operations to a specialized charging operator (who pays rent and keeps electricity sales) or (B) insource by buying and operating the chargers (with the intent to sell electricity at cost). Objective: Decide whether this is a good idea and, most importantly, which option to choose—ensuring McDonald's does not lose money while increasing restaurant traffic. Scope: France (McDonald's has ~1,200 restaurants). The financial evaluation must be done at the level of one restaurant and then extrapolated.",
      instruction: 'Which clarifications are essential BEFORE starting the calculations?',
      interaction_data: {
        options: [
          {
            text: 'Confirm the decision criterion: "do not lose money" (break-even or positive profit) while increasing traffic.',
            is_correct: true,
            feedback: 'Objective confirmed: increase restaurant traffic without losing money.',
          },
          {
            text: 'Confirm the calculation scope: evaluate at the level of one restaurant (then extrapolate to ~1,200 restaurants).',
            is_correct: true,
            feedback: 'The case asks to evaluate both options at the level of a single restaurant.',
          },
          {
            text: 'Clarify Option 1 economics: who captures electricity revenues and what does McDonald\'s receive (rent + royalties)?',
            is_correct: true,
            feedback: 'Option 1: the operator keeps electricity revenues; McDonald\'s receives rent per charger + royalties (% of electricity sales).',
          },
          {
            text: 'Ask for menu customer satisfaction (NPS) to estimate brand image impact of chargers.',
            is_correct: false,
            feedback: 'Interesting, but not the priority: the decision first hinges on the relative profitability of the two options.',
          },
          {
            text: 'Ask for the Big Mac cost breakdown (ingredients vs labor) to recompute chain-wide margins.',
            is_correct: false,
            feedback: 'Out of scope: the case provides a simplified margin per customer; you are not rebuilding full product accounting.',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Framework',
      instruction: 'Propose a MECE structure to answer: "Is this a good idea and which option should we choose?"',
      interaction_data: {
        expected_keywords: ['opportunity', 'profitability', 'option 1', 'option 2', 'traffic', 'risks'],
        gold_standard_text:
          'This is a comparative pattern:\n\n1) Frame the opportunity (where to deploy, how many chargers, type of chargers)\n\n2) Compute profitability of each option separately:\n   - Option 1: rent + royalties revenue\n   - Option 2: annualized costs\n\n3) Estimate incremental restaurant profit from traffic (common to both options)\n\n4) Conclude on the best choice combining economics + operational/competitive risks.',
        gold_standard_image_desc:
          'A tree with two blocks: "Opportunity assessment" (incremental customer flow + offer terms; EV demand; supply; target restaurants; charger type) and "Which option should you choose?" (incremental restaurant revenue identical in both cases via customer flow; Option 1 = rent/royalty revenues; Option 2 = installation/maintenance costs).',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Option 1 Analysis',
      context:
        'Option 1 — Outsource operations (operator installs and operates).\n\nInputs: 6 chargers; electricity price = €0.60/kWh; charging power = 80 kW (~80 kWh delivered per hour); opening hours = 20 h/day; utilization rate = 10%; royalties = 10%; rent = €2,000/charger/year.',
      instruction: 'What is the incremental annual profit of Option 1 (excluding restaurant traffic effect) for ONE restaurant?',
      interaction_data: {
        correct_value: 33000,
        unit: '€ / year',
        tolerance_percent: 5,
        hint: 'Revenue = rent per charger + royalties on electricity sold. Royalties = (royalty %) × (€/kWh) × (energy delivered based on power × usage time).',
        step_by_step_correction:
          '1) Royalties/day = 6 chargers × 20 h/day × 10% × €0.60 × 80 kWh/h × 10%\n= 6 × 20 × 0.1 × 0.6 × 80 × 0.1\n= €57.6/day.\n\n2) Royalties/year = 57.6 × 365 = €21,024/year (~€21k/year).\n\n3) Rent/year = 6 × 2,000 = €12,000/year.\n\n4) Option 1 profit (excluding traffic) = 21,024 + 12,000 = €33,024/year (~€33k/year).',
      },
    },
    {
      step_id: 4,
      type: 'calculation',
      phase_name: 'Option 2 Analysis',
      context:
        "Option 2 — Insource (McDonald's buys and operates the chargers; electricity sold at cost).\n\nInputs: upfront investment = €40,000/charger; 6 chargers; installation = €10,000 (one-off); maintenance = €8,000/year; asset life = 10 years.",
      instruction: 'What is the annual (annualized) cost of Option 2 for ONE restaurant (over the first 10 years)?',
      interaction_data: {
        correct_value: 33000,
        unit: '€ / year',
        tolerance_percent: 5,
        hint: 'Costs = upfront investment per charger + installation (one-off) + annual maintenance. Annualize investment and installation over the asset life (10 years).',
        step_by_step_correction:
          '1) Total initial CAPEX = 40,000 × 6 + 10,000 = 240,000 + 10,000 = €250,000.\n2) Annualized CAPEX = 250,000 / 10 = €25,000/year.\n3) Total annual cost = 25,000 + 8,000 = €33,000/year.\n\nSince electricity is sold at cost, there is no profit from electricity sales: Option 2 is therefore a net cost of €33k/year (over the first 10 years).',
      },
    },
    {
      step_id: 5,
      type: 'calculation',
      phase_name: 'Traffic Impact',
      context:
        'Traffic assumptions: for simplicity, assume 100% of charger utilization corresponds to NEW customers. An average meal costs ~€10 and the margin is 20% → ~€2 profit per customer. Assume 1 person per car. Each charging session lasts 30 minutes.',
      instruction: 'What is the incremental annual profit generated by restaurant traffic (common to both options) for ONE restaurant?',
      interaction_data: {
        correct_value: 17520,
        unit: '€ / year',
        tolerance_percent: 5,
        hint: 'Each charging session lasts 30 minutes → 2 sessions per hour per charger. Sessions/year = chargers × hours/day × (60/30) × utilization rate × 365. Profit = customers × profit per customer.',
        step_by_step_correction:
          '1) Sessions/hour/charger = 60/30 = 2.\n2) Sessions/day = 6 chargers × 20 h × 2 × 10% = 6 × 20 × 2 × 0.1 = 24 sessions/day.\n3) New customers/year = 24 × 365 = 8,760.\n4) Incremental profit/year = 8,760 × €2 = €17,520/year.',
      },
    },
    {
      step_id: 6,
      type: 'calculation',
      phase_name: 'Final Comparison',
      context: 'Now combine "charger economics" (Option 1 vs Option 2) with restaurant traffic profit (common).',
      instruction: 'What is the net annual profitability per restaurant for each option (including traffic)?',
      interaction_data: {
        correct_value: 50520,
        unit: '€ / year (Option 1)',
        tolerance_percent: 5,
        hint: 'Option 1 net = charger profit + traffic profit. Option 2 net = traffic profit − annualized cost.',
        step_by_step_correction:
          'Option 1 net = charger profit (~€33,000) + traffic profit (€17,520) = €50,520/year (~€50k).\nOption 2 net = traffic profit (€17,520) − annualized cost (€33,000) = −€15,480/year (~−€15.5k).\n\nQuant conclusion: Option 1 is strongly positive; Option 2 remains loss-making even after traffic.',
      },
    },
    {
      step_id: 7,
      type: 'clarification',
      phase_name: 'Strategic Choice',
      instruction: 'Which option do you recommend and why (2–3 arguments)?',
      interaction_data: {
        options: [
          {
            text: "Choose Option 1 (outsource): net profit ~€50k/restaurant/year, no CAPEX or operating risk for McDonald's, and traffic comes as an upside.",
            is_correct: true,
            feedback: 'This matches the case conclusion: Option 1 creates value from rent+royalties plus restaurant traffic profit.',
          },
          {
            text: 'Choose Option 2 (insource): keep full control and energy autonomy, even if it costs ~€33k/year.',
            is_correct: false,
            feedback: 'Option 2 does not pay for itself: even with traffic, it remains loss-making (~−€15.5k/year).',
          },
          {
            text: 'Do nothing: chargers attract "non-buying" visitors, so deployment should be avoided.',
            is_correct: false,
            feedback: 'That risk exists, but it can be mitigated (targeting, offer design, incentives). The case recommends installing chargers, choosing Option 1.',
          },
        ],
      },
    },
    {
      step_id: 8,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'The CEO walks in. Deliver a structured recommendation (reco, numbers, risks, next steps).',
      interaction_data: {
        required_elements: ['Recommendation', 'Quantified impact', 'Extrapolation', 'Next steps', 'Key risks'],
        model_answer_text:
          "We recommend installing fast EV chargers and choosing Option 1 (outsourcing). Financially, Option 1 generates ~€33k of annual profit per restaurant (rent + royalties). Adding the restaurant traffic effect estimated at ~€17.5k/year brings net incremental profit to ~€50.5k per restaurant per year.\n\nAt ~1,200 restaurants, this is an order of magnitude of ~€60M net incremental profit per year (50.5k × 1,200), with the traffic component alone representing ~€21M/year (17.5k × 1,200).\n\nBy contrast, Option 2 (insourcing) costs ~€33k/year per restaurant and remains loss-making even after traffic (~−€15.5k/year), so it is not attractive.\n\nNext steps: (1) prioritize the most relevant restaurants (EV adoption, road access, local demand), (2) run a competitive tender and contract with one or two operators, (3) launch local marketing and in-store incentives to convert charging visitors into buyers.\n\nKey risks: competitor reaction from other fast-food chains and operational risk of \"charging-only\" visitors (mitigation via site targeting, offer design, and purchase-linked incentives).",
      },
    },
  ],
};

// ============================================================
// Demo Cases - Metal Alloy Investment (Brainteaser)
// Available in both English and French
// ============================================================

export const DEMO_CASE_METAL_ALLOY_FR: CaseJson = {
  meta: {
    case_id: 'alliage_metallique_investissement_break_even',
    title: 'Alliage métallique — Investir ou pas ? (Payback / Break-even CAPEX)',
    firm_style: 'Bain',
    industry: 'Metals / Manufacturing',
    topic: 'Investment / Breakeven Analysis',
    difficulty: 'Advanced',
    estimated_time_min: 30,
    tags: ['brainteaser', 'investment', 'payback', 'capex', 'manufacturing'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        "Notre client est un acteur de la métallurgie (forge et usinage / fabrication de pièces métalliques). Il veut sécuriser sa chaîne d'approvisionnement amont en investissant dans un nouvel asset (outil de fabrication) permettant de produire un alliage métallique adapté, « clé en main ». Aujourd'hui, le marché ressemble à un marché de commodités (prix très important) et la rentabilité dépendra de la capacité du client à (1) réaliser des économies internes via l'internalisation et (2) vendre une production supplémentaire sur le marché pour bénéficier d'économies d'échelle. Objectif : Déterminer si l'investissement est rentable via une analyse de payback (break-even) avec une cible de récupération entre 5 et 8 ans. Contraintes : produire un volume suffisant (~12 000 T), le client consomme 6 000 T, le reste doit être revendu. Localisation : États-Unis. Scénarios CAPEX : Greenfield (90 M€) ou Brownfield (45 M€).",
      instruction: 'Quelles clarifications sont critiques avant de modéliser le payback ?',
      interaction_data: {
        options: [
          {
            text: "Confirmer la cible de payback (fenêtre d'acceptation) : entre 5 et 8 ans.",
            is_correct: true,
            feedback: 'Objectif confirmé : break-even / payback entre 5 et 8 ans.',
          },
          {
            text: "Valider les volumes : consommation interne (6 000 T) et volume minimal visé pour effet d'échelle (12 000 T).",
            is_correct: true,
            feedback: "Le client consomme 6 000 T et doit viser ~12 000 T pour bénéficier d'économies d'échelle.",
          },
          {
            text: 'Clarifier les scénarios CAPEX : greenfield (90 M€) vs brownfield (45 M€) et la durée de vie de référence.',
            is_correct: true,
            feedback: "Deux scénarios d'investissement sont explicitement proposés : greenfield 90 M€ / brownfield 45 M€.",
          },
          {
            text: "Demander le budget marketing annuel du client pour lancer une marque grand public d'alliages premium.",
            is_correct: false,
            feedback: 'Hors sujet : on est sur une commodité B2B et la décision repose surtout sur volumes, prix, et payback.',
          },
          {
            text: 'Reconstituer la marge nette consolidée du groupe (toutes activités confondues) pour juger la décision.',
            is_correct: false,
            feedback: "Inutile ici : l'exercice est un cas d'investissement avec payback, centré sur cash flows incrémentaux.",
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Framework',
      instruction: "Quelle structure proposes-tu pour traiter un cas d'investissement (CAPEX) avec payback ?",
      interaction_data: {
        expected_keywords: ['cash flow', 'marché', 'CAPEX', 'payback', 'recommandation'],
        gold_standard_text:
          "Structure en 2 parties :\n\nI) Analyser les revenus/économies (CF) et la capacité à vendre la surproduction :\n   - Cash flow récurrent : économies internes + profit sur volume revendu\n   - Validation marché : taille, croissance, concurrence, critères d'achat\n\nII) Intégrer les coûts d'investissement et calculer le payback :\n   - CAPEX selon scénario (greenfield vs brownfield)\n   - Payback : t = I / CF, test vs cible (5-8 ans)\n   - Recommandation : go/no-go + scénario + risques/next steps",
        gold_standard_image_desc:
          'Plan en 2 parties : I) rentabilité (A coûts : CAPEX+OPEX ; B revenus : économies internes + revente sur marché), II) calcul break-even (objectif 5-8 ans) + recommandations selon atteinte de l\'objectif.',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Internal Savings',
      context:
        "Le cas indique une économie d'EBITDA de 75 centimes par kilo si la production d'alliage est internalisée. Le client consomme 6 000 T par an.",
      instruction: 'Quel est le montant annuel d\'économies internes (en € / an) sur les 6 000 T consommées ?',
      interaction_data: {
        correct_value: 4500000,
        unit: '€ / an',
        tolerance_percent: 1,
        hint: '1 tonne = 1 000 kg. 6 000 T = 6 000 000 kg. Économie = 0,75 € × volume (en kg).',
        step_by_step_correction:
          'Volume = 6 000 T = 6 000 000 kg.\nÉconomie annuelle = 0,75 € / kg × 6 000 000 kg = 4 500 000 € / an.',
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Market Criteria',
      instruction: 'Pour évaluer combien de volume supplémentaire peut être vendu au marché, quels critères dois-tu analyser ? Quel est le critère n°1 dans un marché de commodités ?',
      interaction_data: {
        checklist_correct_items: [
          'Prix (critère dominant dans un marché de commodités)',
          "Qualité / spécifications de l'alliage",
          'Capacité de production (volume suffisant)',
          "Délais de livraison + temps de qualification / obtention de contrats",
          'Concurrence et capacité des suppliers existants',
        ],
        explanation:
          "Dans un marché de commodités, le critère dominant est le prix (équilibre offre/demande). Les autres facteurs (qualité, capacité, délais/qualification) conditionnent l'accès au marché et la conversion des clients.",
      },
    },
    {
      step_id: 5,
      type: 'calculation',
      phase_name: 'Market Sizing',
      context:
        'Le cas donne 1 600 "assets" aux US, répartis : Petit 30% (50T/asset), Moyen 30% (100T/asset), Grand 40% (150T/asset).',
      instruction: 'Quelle est la taille de marché totale (TDM) en tonnes ?',
      interaction_data: {
        correct_value: 168000,
        unit: 'T',
        tolerance_percent: 0,
        hint: "Calculer le nombre d'assets par segment : 30%/30%/40% de 1 600. Multiplier par la conso par asset, puis sommer.",
        step_by_step_correction:
          'Petit : 30% × 1 600 = 480 assets → 480 × 50 = 24 000 T.\nMoyen : 30% × 1 600 = 480 assets → 480 × 100 = 48 000 T.\nGrand : 40% × 1 600 = 640 assets → 640 × 150 = 96 000 T.\nTDM = 24 000 + 48 000 + 96 000 = 168 000 T.',
      },
    },
    {
      step_id: 6,
      type: 'calculation',
      phase_name: 'Payback Calculation',
      context:
        "Deux scénarios d'investissement (CAPEX) : greenfield 90 M€ vs brownfield 45 M€. Le cash flow annuel total (profit) retenu est de 9 M€ : 4,5 M€ d'économies internes + 4,5 M€ de profit lié à la vente de 4 500 T supplémentaires.",
      instruction: 'Quel est le délai de récupération (payback period) pour chaque scénario ?',
      interaction_data: {
        correct_value: 5,
        unit: 'années (Brownfield)',
        tolerance_percent: 0,
        hint: 'Payback = CAPEX / CF annuel. CF annuel = 9 M€.',
        step_by_step_correction:
          'CF annuel = 9 M€.\nPayback greenfield = 90 / 9 = 10 ans.\nPayback brownfield = 45 / 9 = 5 ans.\n\nSeul le brownfield respecte la cible de 5-8 ans.',
      },
    },
    {
      step_id: 7,
      type: 'clarification',
      phase_name: 'Strategic Choice',
      instruction: 'En tenant compte de la cible de payback (5-8 ans), quelle décision recommandes-tu ?',
      interaction_data: {
        options: [
          {
            text: 'Investir en brownfield (45 M€) : payback ~5 ans, dans la cible ; greenfield est trop long (~10 ans).',
            is_correct: true,
            feedback: 'Décision alignée avec la cible 5-8 ans : seul le brownfield passe le test.',
          },
          {
            text: "Investir en greenfield (90 M€) : c'est plus ambitieux et on aura une usine neuve, donc c'est forcément mieux.",
            is_correct: false,
            feedback: "Financièrement, le payback (~10 ans) dépasse l'objectif 5-8 ans : le cas ne le valide pas.",
          },
          {
            text: 'Ne pas investir : la demande est incertaine, donc il faut refuser tout scénario.',
            is_correct: false,
            feedback: "Le cas montre qu'avec les hypothèses retenues (CF 9 M€), le brownfield atteint l'objectif (5 ans).",
          },
        ],
      },
    },
    {
      step_id: 8,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'Le CEO veut une réponse nette : investir ou pas, dans quel scénario, et que faire ensuite.',
      interaction_data: {
        required_elements: ['Recommandation', 'Chiffrage', 'Hypothèses', 'Risques', 'Next steps'],
        model_answer_text:
          "Nous recommandons d'investir sous scénario brownfield (45 M€), car le cash flow annuel estimé est de 9 M€ (4,5 M€ d'économies internes sur 6 000 T + 4,5 M€ de profit lié à la vente de 4 500 T), ce qui donne un payback d'environ 5 ans, dans la cible 5-8 ans. Le scénario greenfield (90 M€) n'est pas acceptable car il implique un payback d'environ 10 ans.\n\nHypothèses critiques à valider : capacité réelle à vendre le volume supplémentaire (au moins plusieurs milliers de tonnes), niveau de marge sur la vente, dynamique concurrentielle (réaction des suppliers actuels si augmentation de capacité), et délais de qualification/contractualisation.\n\nNext steps (si go) : sécuriser les débouchés (KPCs / contrats), bâtir le plan logistique et de distribution, dimensionner l'organisation (workflow, expertise), et lancer un pilote commercial.\n\nSi l'investissement n'était pas validé, alternatives pour sécuriser l'amont : racheter un fournisseur, diversifier les fournisseurs, ou sécuriser des contrats long-terme.",
      },
    },
  ],
};

export const DEMO_CASE_METAL_ALLOY_EN: CaseJson = {
  meta: {
    case_id: 'metal_alloy_investment_payback',
    title: 'Metal Alloy — Invest or Not? (CAPEX Payback / Break-even)',
    firm_style: 'Bain',
    industry: 'Metals / Manufacturing',
    topic: 'Investment / Breakeven Analysis',
    difficulty: 'Advanced',
    estimated_time_min: 30,
    tags: ['brainteaser', 'investment', 'payback', 'capex', 'manufacturing'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Context & Clarification',
      intro_context:
        'Our client is a metals player (forging & machining / metal parts manufacturing). They want to secure their upstream supply chain by investing in a new asset (manufacturing equipment/site) to produce a suitable metal alloy as a "turnkey" solution. The market behaves like a commodity market (price is critical). The investment case depends on the client\'s ability to (1) generate internal savings through insourcing and (2) sell additional output externally to capture economies of scale. Objective: Decide whether the investment is attractive using a payback analysis, with a target payback of 5 to 8 years. Constraints: reach ~12,000 tons production, client consumes 6,000 tons, remainder must be sold. Geography: United States. CAPEX scenarios: Greenfield (€90M) or Brownfield (€45M).',
      instruction: 'Which clarifications are critical before building the payback model?',
      interaction_data: {
        options: [
          {
            text: 'Confirm the payback acceptance window: 5 to 8 years.',
            is_correct: true,
            feedback: 'Target confirmed: payback between 5 and 8 years.',
          },
          {
            text: 'Validate volumes: internal consumption (6,000 tons) and the minimum scale target (12,000 tons).',
            is_correct: true,
            feedback: 'The client consumes 6,000 tons and needs ~12,000 tons for scale effects.',
          },
          {
            text: 'Clarify CAPEX scenarios: greenfield (€90M) vs brownfield (€45M), and the reference lifetime for the analysis.',
            is_correct: true,
            feedback: 'Two investment scenarios are explicitly given: greenfield €90M / brownfield €45M.',
          },
          {
            text: 'Ask for the annual marketing budget to launch a consumer premium alloy brand.',
            is_correct: false,
            feedback: 'Out of scope: this is B2B commodity-like; the decision is driven by volume, price, and payback.',
          },
          {
            text: 'Rebuild the group consolidated net margin (all businesses) to judge the decision.',
            is_correct: false,
            feedback: 'Unnecessary: this is a CAPEX payback exercise focused on incremental cash flows.',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Framework',
      instruction: 'What structure would you use for a CAPEX investment case with a payback objective?',
      interaction_data: {
        expected_keywords: ['cash flow', 'market', 'CAPEX', 'payback', 'recommendation'],
        gold_standard_text:
          'Two-part structure:\n\nI) Estimate recurring cash flows and validate market capacity:\n   - Recurring CF: internal savings + profit on external volume sold\n   - Market validation: size, growth, competition, buying criteria\n\nII) Bring in investment costs and compute payback:\n   - CAPEX by scenario (greenfield vs brownfield)\n   - Payback: t = I / CF, test vs target (5-8 years)\n   - Recommendation: go/no-go + scenario + risks/next steps',
        gold_standard_image_desc:
          'Two-part plan: I) profitability (A costs: CAPEX+OPEX; B revenues: internal savings + external sales), II) break-even calculation (target 5-8 years) + recommendations depending on target attainment.',
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Internal Savings',
      context:
        'The document states an EBITDA saving of €0.75 per kg if alloy production is insourced. The client consumes 6,000 tons per year.',
      instruction: 'What are the annual internal savings (in € / year) on the 6,000 tons consumed?',
      interaction_data: {
        correct_value: 4500000,
        unit: '€ / year',
        tolerance_percent: 1,
        hint: '1 ton = 1,000 kg. 6,000 tons = 6,000,000 kg. Savings = €0.75 × volume (in kg).',
        step_by_step_correction:
          'Volume = 6,000 tons = 6,000,000 kg.\nAnnual savings = €0.75/kg × 6,000,000 kg = €4,500,000 per year.',
      },
    },
    {
      step_id: 4,
      type: 'brainstorming',
      phase_name: 'Market Criteria',
      instruction: 'To assess how much incremental volume can be sold externally, what criteria should you analyze? What is the #1 criterion in a commodity market?',
      interaction_data: {
        checklist_correct_items: [
          'Price (dominant criterion in commodity markets)',
          'Quality / alloy specs',
          'Production capacity (sufficient volume)',
          'Delivery lead times + qualification / contracting time',
          "Competition and current suppliers' capacity",
        ],
        explanation:
          'In a commodity market, the dominant criterion is price (supply-demand balance). Other factors (quality, capacity, qualification timelines) determine access and conversion.',
      },
    },
    {
      step_id: 5,
      type: 'calculation',
      phase_name: 'Market Sizing',
      context:
        'The document provides 1,600 "assets" in the US, split as: Small 30% (50T/asset), Medium 30% (100T/asset), Large 40% (150T/asset).',
      instruction: 'What is the total addressable market (TAM) in tons?',
      interaction_data: {
        correct_value: 168000,
        unit: 'T',
        tolerance_percent: 0,
        hint: 'Compute asset counts by segment: 30%/30%/40% of 1,600. Multiply by consumption per asset, then sum.',
        step_by_step_correction:
          'Small: 30% × 1,600 = 480 assets → 480 × 50 = 24,000 T.\nMedium: 30% × 1,600 = 480 assets → 480 × 100 = 48,000 T.\nLarge: 40% × 1,600 = 640 assets → 640 × 150 = 96,000 T.\nTAM = 24,000 + 48,000 + 96,000 = 168,000 T.',
      },
    },
    {
      step_id: 6,
      type: 'calculation',
      phase_name: 'Payback Calculation',
      context:
        'Two CAPEX scenarios: greenfield €90M vs brownfield €45M. The document retains a total annual cash flow (profit) of €9M: €4.5M internal savings + €4.5M profit from selling 4,500 tons of additional volume.',
      instruction: 'What is the payback period for each scenario?',
      interaction_data: {
        correct_value: 5,
        unit: 'years (Brownfield)',
        tolerance_percent: 0,
        hint: 'Payback = CAPEX / Annual CF. Annual CF = €9M.',
        step_by_step_correction:
          'Annual CF = €9M.\nGreenfield payback = 90 / 9 = 10 years.\nBrownfield payback = 45 / 9 = 5 years.\n\nOnly brownfield meets the 5-8 year target.',
      },
    },
    {
      step_id: 7,
      type: 'clarification',
      phase_name: 'Strategic Choice',
      instruction: 'Given the payback target (5-8 years), what decision do you recommend?',
      interaction_data: {
        options: [
          {
            text: 'Invest in the brownfield scenario (€45M): payback ~5 years, within target; greenfield is too long (~10 years).',
            is_correct: true,
            feedback: 'Aligned with the 5-8 year target: only brownfield passes the test.',
          },
          {
            text: 'Invest in greenfield (€90M): it is more ambitious and a new plant is always better.',
            is_correct: false,
            feedback: 'Financially, payback (~10 years) exceeds the 5-8 year target.',
          },
          {
            text: 'Do not invest: demand is uncertain, so reject both scenarios.',
            is_correct: false,
            feedback: 'Under the retained assumptions (CF €9M), brownfield meets the target (5 years).',
          },
        ],
      },
    },
    {
      step_id: 8,
      type: 'synthesis',
      phase_name: 'Conclusion',
      instruction: 'The CEO wants a crisp answer: invest or not, which scenario, and what to do next.',
      interaction_data: {
        required_elements: ['Recommendation', 'Quantified economics', 'Critical assumptions', 'Key risks', 'Next steps'],
        model_answer_text:
          'We recommend investing under the brownfield scenario (€45M), because the estimated annual cash flow is €9M (€4.5M of internal savings on 6,000 tons plus €4.5M of profit from selling 4,500 tons), yielding a ~5-year payback—within the 5-8 year target. The greenfield scenario (€90M) is not attractive because it implies a ~10-year payback.\n\nCritical assumptions to validate include: the actual ability to sell the incremental volume (at least several thousand tons), the achievable margin on external sales, competitive response (suppliers increasing capacity), and qualification/contracting timelines.\n\nNext steps (if go): secure offtake agreements (contracts with buyers), build the logistics and distribution plan, size the organization (workflow, expertise), and launch a commercial pilot.\n\nIf the investment were rejected, alternatives to secure upstream supply include: acquiring a supplier, diversifying suppliers, or securing long-term contracts.',
      },
    },
  ],
};

// ============================================================
// Demo Case 5: Oil & Gas Target Costing (French)
// ============================================================

export const DEMO_CASE_OIL_GAS_FR: CaseJson = {
  meta: {
    case_id: 'gas_oil_target_costing_10_usd_per_barrel_fr',
    title: 'Gas & Oil — Target Costing à 10$/baril',
    firm_style: 'McKinsey',
    industry: 'Oil & Gas / Energy',
    topic: 'Target Costing / Gap Analysis',
    difficulty: 'Advanced',
    estimated_time_min: 35,
    tags: ['target-costing', 'gap-analysis', 'oil-gas', 'cost-reduction', 'out-of-the-box'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Clarification de la cible',
      intro_context:
        "Notre client est un acteur du pétrole et du gaz en Afrique. Il opère actuellement 5 sites de production.\n\nLe prix du baril s'est effondré, ce qui a fait baisser la profitabilité. Pour réagir, le client envisage de vendre 2 de ses 5 sites afin de réduire les coûts.\n\nObjectif : Calculer le coût OPEX actuel par baril et aider le client à l'amener à 10$/baril.\n\nInformations utiles :\n• Localisation : Nigeria ; 3 sites offshore et 2 sites deep offshore.\n• Hypothèse de simplification : les coûts sont équi-répartis entre les 5 sites (sauf les coûts de transport).\n• Chaîne de valeur : extraction + production (le client extrait et produit).",
      instruction:
        "Quelles clarifications sont critiques pour lancer une analyse de 'target costing' (baseline → action évidente → gap → leviers créatifs) ?",
      context: "Le client veut atteindre un coût OPEX cible de 10$/baril. Il pense d'abord vendre 2 sites sur 5 pour réduire les coûts.",
      interaction_data: {
        options: [
          {
            text: 'Confirmer la métrique-cible : OPEX par baril (pas CAPEX, pas coût complet).',
            is_correct: true,
            feedback: 'Objectif confirmé : atteindre 10$/baril en OPEX.',
          },
          {
            text: "Valider l'hypothèse de répartition des coûts entre sites et l'exception (transport).",
            is_correct: true,
            feedback: 'Simplification : coûts répartis équitablement entre 5 sites, sauf transport.',
          },
          {
            text: 'Confirmer le niveau de production actuel (barils/jour) pour annualiser et calculer le coût unitaire.',
            is_correct: true,
            feedback: 'La production utilisée dans le cas est de 60 000 barils/jour (pour annualiser).',
          },
          {
            text: 'Demander le prix de vente du baril afin de recalculer la marge brute et le résultat net complet.',
            is_correct: false,
            feedback: "Ce cas est un 'target costing' : on vise un coût par baril, pas une rentabilité complète.",
          },
          {
            text: 'Demander la croissance de la demande mondiale de pétrole à 10 ans pour décider des investissements CAPEX.',
            is_correct: false,
            feedback: "Hors sujet : l'exercice est centré sur la réduction d'OPEX par baril à court/moyen terme.",
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Framework Gap Analysis',
      instruction: "Propose un plan en 'Gap Analysis' pour atteindre 10$/baril.",
      interaction_data: {
        expected_keywords: [
          'baseline',
          'coût actuel',
          'action évidente',
          'vente sites',
          'gap',
          'écart',
          'leviers créatifs',
          'éliminer',
          'substituer',
          'optimiser',
          'risques',
        ],
        gold_standard_text:
          "Plan en 3 parties :\n\n1) BASELINE : Calculer le coût actuel par baril\n   • Identifier les postes de coûts via la chaîne de valeur\n   • Total OPEX / barils produits annuellement\n\n2) ACTION ÉVIDENTE : Tester l'impact de la vente de 2 sites\n   • Impact sur les coûts (quels coûts baissent, lesquels restent fixes)\n   • Impact sur la production (perte de volume)\n   • Nouveau coût par baril\n\n3) GAP ANALYSIS + LEVIERS CRÉATIFS\n   • Constater si la cible est atteinte (spoiler : non)\n   • Activer d'autres leviers : éliminer / substituer / optimiser\n   • Vue risques court/moyen/long terme (qualité, image, soutenabilité)",
        gold_standard_image_desc:
          "Slide 'Proposed 3-part plan' : I. Calcul du coût actuel par baril ; II. Impact de la vente de deux sites (coûts + production) ; III. Autres leviers de réduction (+ risques CT/MT/LT).",
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Baseline — Coût actuel',
      context:
        "Postes OPEX annuels : machines & maintenance 140M ; énergie/consommables 30M ; main-d'œuvre 15M ; transport & stockage 40M ; fonctions support 30M ; SG&A 15M. Total OPEX = 270M$. Production : 60 000 barils/jour.",
      instruction: 'Quel est le coût OPEX actuel par baril (ordre de grandeur) ?',
      interaction_data: {
        correct_value: 12.27,
        tolerance_percent: 5,
        unit: '$/baril',
        hint: 'Annualiser la production : utiliser 360 jours pour une estimation rapide. Barils/an ≈ 60 000 × 360 ≈ 22M.',
        step_by_step_correction:
          "1) Barils/an ≈ 60 000 × 360 = 21,6M (≈ 22M).\n2) Coût OPEX/baril ≈ 270M / 22M ≈ 12,27 $/baril.\n3) Donc on est ~20% au-dessus de la cible de 10$/baril.",
      },
    },
    {
      step_id: 4,
      type: 'calculation',
      phase_name: 'Action évidente — Vente de 2 sites',
      context:
        "Hypothèses : (i) les coûts hors transport sont répartis équitablement entre sites, (ii) les coûts de transport sont divisés par 2 après la vente. On passe de 5 sites à 3 sites.",
      instruction: 'Après la vente de 2 sites, quel est le nouveau coût par baril (ordre de grandeur) ?',
      interaction_data: {
        correct_value: 13.5,
        tolerance_percent: 7,
        unit: '$/baril',
        hint: "Transport : 40M → 20M. Autres coûts 'core' : prendre 3/5 des montants initiaux. Production : prendre 3/5 des barils annuels.",
        step_by_step_correction:
          "Coûts après vente :\n• Transport = 20M\n• Machines & maintenance : 140/5=28 → ×3 = 84M\n• Main-d'œuvre : 15/5=3 → ×3 = 9M\n• Énergie/consommables : 30/5=6 → ×3 = 18M\n• Fonctions support + SG&A : restent identiques = 30+15 = 45M\n• Total ≈ 20+84+9+18+45 = 176M\n\nProduction après vente : 22M × (3/5) ≈ 13,2M (≈ 13M)\nCoût/baril ≈ 176M / ~13M ≈ 13,5 $/baril\n\n=> La vente éloigne de la cible : le coût unitaire augmente (perte d'échelle).",
      },
    },
    {
      step_id: 5,
      type: 'clarification',
      phase_name: 'Gap Analysis — Après vente',
      instruction: "Avons-nous atteint la cible de 10$/baril après la vente des 2 sites ? Quel est l'écart ?",
      interaction_data: {
        options: [
          {
            text: "Non. On est à ~13,5$/baril, soit ~+3,5$/baril au-dessus de la cible (et on s'est éloigné par rapport à la baseline).",
            is_correct: true,
            feedback:
              "Exact : la 'mesure évidente' (vendre des sites) dégrade le coût unitaire à cause de la perte d'économies d'échelle.",
          },
          {
            text: 'Oui. La vente réduit assez les coûts, on descend sous 10$/baril grâce à la division des coûts par 2.',
            is_correct: false,
            feedback: 'Non : seuls certains coûts baissent, la production baisse aussi, et le coût par baril augmente.',
          },
          {
            text: 'Non. On est à ~11$/baril, il manque seulement ~1$/baril.',
            is_correct: false,
            feedback: "Le document conclut plutôt à ~13,5$/baril après la vente, donc un écart bien plus important.",
          },
        ],
      },
    },
    {
      step_id: 6,
      type: 'brainstorming',
      phase_name: 'Leviers créatifs — Out of the box',
      instruction: 'Propose des leviers opérationnels pour combler le gap (sans vendre de sites).',
      interaction_data: {
        checklist_correct_items: [
          "Réduire 'machines & maintenance' (poste n°1) via maintenance connectée / prédictive (data, capteurs, machine learning)",
          'Éliminer des coûts non nécessaires (ex. externaliser / optimiser certains transports)',
          'Substitution : composants/inputs moins chers, relocalisation, arbitrage insourcing/offshoring',
          "Optimiser l'organisation : capacité des sites, effectifs, salaires (adapter au taux d'occupation)",
          'Réduire les coûts de fonctions support et SG&A via automatisation IT et rationalisation des bureaux',
          'Augmenter la production si certains sites ne tournent pas à pleine capacité (amortir les coûts fixes)',
          "Renforcer le pouvoir d'achat / négociation fournisseurs (éviter les petits volumes, économies d'échelle)",
          "Simplifier le 'système' / l'ingénierie (challenge des ressources nécessaires, design-to-cost)",
          'Aider les fournisseurs à réduire leurs coûts (support technique) pour répercuter des baisses',
          "Standardisation / modularité : développer des modules personnalisables plutôt que refaire 'from scratch'",
        ],
        explanation:
          "Logique 80/20 : attaquer d'abord le poste majeur (machines & maintenance), puis les coûts de structure (support/SG&A), tout en activant des leviers 'éliminer / substituer / optimiser' et en gardant une vue risques CT/MT/LT.",
      },
    },
    {
      step_id: 7,
      type: 'calculation',
      phase_name: 'Résultat après leviers',
      context:
        "Après activation d'un ensemble de leviers (machines & maintenance, SG&A/support, etc.), le document indique qu'on arrive à un coût d'environ 10,6$/baril.",
      instruction: 'Quel est le coût par baril obtenu après ces leviers (selon le cas) ?',
      interaction_data: {
        correct_value: 10.6,
        tolerance_percent: 0,
        unit: '$/baril',
        hint: "C'est une valeur donnée comme conclusion intermédiaire dans le document.",
        step_by_step_correction:
          "Le document indique explicitement qu'après activation des leviers de réduction, le coût atteint ~10,6$/baril.",
      },
    },
    {
      step_id: 8,
      type: 'clarification',
      phase_name: 'Gap Analysis — Final',
      instruction: 'Avec 10,6$/baril, avons-nous atteint la cible de 10$/baril ? Quel est le gap résiduel ?',
      interaction_data: {
        options: [
          {
            text: 'Non. Il reste ~0,6$/baril à gagner pour atteindre 10$/baril.',
            is_correct: true,
            feedback: 'Exact : on est proche, mais encore légèrement au-dessus de la cible.',
          },
          {
            text: 'Oui. 10,6$/baril est inférieur à 10$/baril si on arrondit.',
            is_correct: false,
            feedback: 'Non : même arrondi, 10,6 est au-dessus de 10.',
          },
          {
            text: 'Non. Il reste ~3,5$/baril à gagner.',
            is_correct: false,
            feedback: "3,5$/baril correspond à l'écart après la vente des sites (13,5 vs 10), pas après les leviers (10,6 vs 10).",
          },
        ],
      },
    },
    {
      step_id: 9,
      type: 'synthesis',
      phase_name: 'Recommandation finale',
      context: 'Le CEO veut une recommandation claire : vendre des sites ou non, et quels leviers activer pour atteindre 10$/baril.',
      instruction: 'Formulez votre recommandation au CEO.',
      interaction_data: {
        required_elements: [
          'Position sur la vente des 2 sites',
          'Baseline chiffrée (12,27$/baril)',
          "Résultat après vente (13,5$/baril) et interprétation (perte d'échelle)",
          'Leviers prioritaires out of the box',
          'Plan de mise en œuvre et risques CT/MT/LT',
        ],
        model_answer_text:
          "Recommandation : ne pas vendre les 2 sites. La baseline est d'environ 12,27$/baril (270M$ d'OPEX pour ~22M de barils/an). La vente de 2 sites, bien que 'évidente', dégrade le coût unitaire à ~13,5$/baril, car la production baisse et l'effet d'échelle disparaît (les coûts de structure ne baissent pas proportionnellement).\n\nPour se rapprocher de la cible 10$/baril, il faut plutôt activer des leviers opérationnels sur les gros postes :\n\n1) Machines & maintenance (poste majeur) via maintenance prédictive/connected maintenance, fiabilisation, renégociation fournisseurs et standardisation\n\n2) Fonctions support & SG&A via automatisation IT, rationalisation des surfaces/bureaux et optimisation des effectifs\n\n3) Optimisation du transport, substitution d'inputs, et hausse de l'utilisation des sites (si capacité disponible) pour amortir les coûts fixes\n\nLe cas indique qu'un paquet de leviers permet d'atteindre ~10,6$/baril : il reste ~0,6$/baril à capturer.\n\nNext steps : diagnostiquer finement les drivers de machines & maintenance (fréquence vs sévérité, accessibilité des sites), établir un pipeline d'initiatives avec impacts chiffrés et risques CT/MT/LT (qualité, image sociale, soutenabilité), puis lancer un pilote sur un site avant déploiement.",
      },
    },
  ],
};

// ============================================================
// Demo Case 5: Oil & Gas Target Costing (English)
// ============================================================

export const DEMO_CASE_OIL_GAS_EN: CaseJson = {
  meta: {
    case_id: 'oil_gas_target_costing_10_usd_per_bbl_en',
    title: 'Oil & Gas — Target Costing to $10/bbl',
    firm_style: 'McKinsey',
    industry: 'Oil & Gas / Energy',
    topic: 'Target Costing / Gap Analysis',
    difficulty: 'Advanced',
    estimated_time_min: 35,
    tags: ['target-costing', 'gap-analysis', 'oil-gas', 'cost-reduction', 'out-of-the-box'],
  },
  steps: [
    {
      step_id: 1,
      type: 'clarification',
      phase_name: 'Target Clarification',
      intro_context:
        'Our client is an oil & gas player in Africa. They currently operate 5 production sites.\n\nOil prices have fallen sharply, reducing profitability. As an initial response, the client is considering selling 2 of its 5 sites to reduce costs.\n\nObjective: Compute today\'s OPEX cost per barrel and help the client reach a target of $10 per barrel.\n\nUseful information:\n• Location: Nigeria; 3 offshore sites and 2 deep-offshore sites.\n• Simplifying assumption: costs are evenly split across the 5 sites (except transportation costs).\n• Value chain: extraction + production (the client extracts and produces).',
      instruction:
        "Which clarifications are critical to launch a target-costing analysis (baseline → obvious action → gap → creative levers)?",
      context: "The client targets an OPEX cost of $10/bbl. Their first 'obvious' idea is to sell 2 out of 5 sites to reduce costs.",
      interaction_data: {
        options: [
          {
            text: 'Confirm the target metric: OPEX per barrel (not CAPEX, not full cost).',
            is_correct: true,
            feedback: 'Target confirmed: reach $10/bbl in OPEX.',
          },
          {
            text: 'Validate the cost allocation assumption across sites and the exception (transport).',
            is_correct: true,
            feedback: 'Simplification: costs are evenly split across 5 sites, except transportation.',
          },
          {
            text: 'Confirm current production level (barrels/day) to annualize and compute unit cost.',
            is_correct: true,
            feedback: 'The case uses 60,000 barrels/day to annualize production.',
          },
          {
            text: 'Ask for the oil selling price to recompute gross margin and full net profit.',
            is_correct: false,
            feedback: 'This is target costing: we aim for a unit cost, not a full profitability model.',
          },
          {
            text: 'Ask for 10-year global oil demand growth to decide on long-term CAPEX investments.',
            is_correct: false,
            feedback: 'Out of scope: this exercise focuses on reducing OPEX per barrel in the short to mid term.',
          },
        ],
      },
    },
    {
      step_id: 2,
      type: 'structure',
      phase_name: 'Gap Analysis Framework',
      instruction: "Propose a 'Gap Analysis' plan to reach $10/bbl.",
      interaction_data: {
        expected_keywords: [
          'baseline',
          'current cost',
          'obvious action',
          'sell sites',
          'gap',
          'creative levers',
          'eliminate',
          'substitute',
          'optimize',
          'risks',
        ],
        gold_standard_text:
          "3-part plan:\n\n1) BASELINE: Compute current cost per barrel\n   • Identify cost items via the value chain\n   • Total OPEX / annual barrels produced\n\n2) OBVIOUS ACTION: Test impact of selling 2 sites\n   • Impact on costs (which costs drop, which remain fixed)\n   • Impact on production (volume loss)\n   • New cost per barrel\n\n3) GAP ANALYSIS + CREATIVE LEVERS\n   • Check whether target is reached (spoiler: no)\n   • Activate other levers: eliminate / substitute / optimize\n   • Risk view: short/medium/long term (quality, image, sustainability)",
        gold_standard_image_desc:
          "Slide 'Proposed 3-part plan': I. Current cost per barrel; II. Impact of selling two sites (costs + production); III. Other levers (+ risks ST/MT/LT).",
      },
    },
    {
      step_id: 3,
      type: 'calculation',
      phase_name: 'Baseline — Current Cost',
      context:
        'Annual OPEX items: machines & maintenance 140M; energy/consumables 30M; labor 15M; transport & storage 40M; support functions 30M; SG&A 15M. Total OPEX = $270M. Production: 60,000 bbl/day.',
      instruction: 'What is the current OPEX cost per barrel (order of magnitude)?',
      interaction_data: {
        correct_value: 12.27,
        tolerance_percent: 5,
        unit: '$/bbl',
        hint: 'Annualize production: use 360 days for quick estimation. Barrels/year ≈ 60,000 × 360 ≈ 22M.',
        step_by_step_correction:
          '1) Barrels/year ≈ 60,000 × 360 = 21.6M (≈ 22M).\n2) OPEX/bbl ≈ 270M / 22M ≈ $12.27/bbl.\n3) So we are ~20% above the $10/bbl target.',
      },
    },
    {
      step_id: 4,
      type: 'calculation',
      phase_name: 'Obvious Action — Sell 2 Sites',
      context:
        'Assumptions: (i) non-transport costs are evenly split across sites, (ii) transport costs are halved after the sale. Sites go from 5 to 3.',
      instruction: 'After selling 2 sites, what is the new cost per barrel (order of magnitude)?',
      interaction_data: {
        correct_value: 13.5,
        tolerance_percent: 7,
        unit: '$/bbl',
        hint: "Transport: 40M → 20M. Other 'core' costs: take 3/5 of initial amounts. Production: take 3/5 of annual barrels.",
        step_by_step_correction:
          'Costs after sale:\n• Transport = 20M\n• Machines & maintenance: 140/5=28 → ×3 = 84M\n• Labor: 15/5=3 → ×3 = 9M\n• Energy/consumables: 30/5=6 → ×3 = 18M\n• Support + SG&A: remain unchanged = 30+15 = 45M\n• Total ≈ 20+84+9+18+45 = 176M\n\nProduction after sale: 22M × (3/5) ≈ 13.2M (≈ 13M)\nCost/bbl ≈ 176M / ~13M ≈ $13.5/bbl\n\n=> Selling sites moves us away from the target: unit cost increases due to lost scale.',
      },
    },
    {
      step_id: 5,
      type: 'clarification',
      phase_name: 'Gap Analysis — After Sale',
      instruction: 'Did we reach the $10/bbl target after selling 2 sites? What is the gap?',
      interaction_data: {
        options: [
          {
            text: 'No. We are at ~$13.5/bbl, i.e., ~+$3.5/bbl above target (and worse than the baseline).',
            is_correct: true,
            feedback: "Correct: the 'obvious' action (selling sites) worsens unit cost due to lost scale.",
          },
          {
            text: "Yes. Selling sites reduces costs enough; we go below $10/bbl because costs are divided by 2.",
            is_correct: false,
            feedback: 'No: only some costs drop; production also drops and unit cost increases.',
          },
          {
            text: 'No. We are at ~$11/bbl; only ~+$1/bbl remains.',
            is_correct: false,
            feedback: "The document's conclusion is closer to ~$13.5/bbl after the sale, meaning a larger gap.",
          },
        ],
      },
    },
    {
      step_id: 6,
      type: 'brainstorming',
      phase_name: 'Creative Levers — Out of the Box',
      instruction: 'Propose operational levers to close the gap (without selling sites).',
      interaction_data: {
        checklist_correct_items: [
          "Reduce 'machines & maintenance' (largest bucket) through connected/predictive maintenance (data, sensors, ML)",
          'Eliminate unnecessary costs (e.g., outsource/optimize part of transportation)',
          'Substitution: cheaper components/inputs, relocation, insourcing/offshoring trade-offs',
          'Optimize organization: site utilization, staffing levels, wage structure aligned with actual load',
          'Reduce support and SG&A via IT automation and real-estate footprint rationalization',
          'Increase production if some sites have spare capacity (dilute fixed costs)',
          'Strengthen procurement negotiating power (avoid small volumes, capture scale discounts)',
          'Simplify engineering/system design (challenge required resources, design-to-cost)',
          'Help suppliers reduce their costs (expert/engineer support) to pass through reductions',
          "Standardization/modularity: develop customizable modules instead of bespoke 'from scratch' solutions",
        ],
        explanation:
          "80/20 approach: attack the biggest cost bucket first (machines & maintenance), then structural costs (support/SG&A), while activating 'eliminate / substitute / optimize' levers and keeping a ST/MT/LT risk view.",
      },
    },
    {
      step_id: 7,
      type: 'calculation',
      phase_name: 'Result After Levers',
      context:
        'After activating a set of levers (machines & maintenance, SG&A/support, etc.), the document states we reach a cost of about $10.6/bbl.',
      instruction: 'What cost per barrel is achieved after these levers (as per the case)?',
      interaction_data: {
        correct_value: 10.6,
        tolerance_percent: 0,
        unit: '$/bbl',
        hint: 'This is given as an intermediate conclusion in the document.',
        step_by_step_correction:
          'The document explicitly states that after implementing the reduction levers, cost reaches ~$10.6/bbl.',
      },
    },
    {
      step_id: 8,
      type: 'clarification',
      phase_name: 'Gap Analysis — Final',
      instruction: 'At $10.6/bbl, did we reach the $10/bbl target? What is the residual gap?',
      interaction_data: {
        options: [
          {
            text: 'No. We still need about $0.6/bbl of additional savings to reach $10/bbl.',
            is_correct: true,
            feedback: 'Correct: we are close, but still slightly above target.',
          },
          {
            text: 'Yes. $10.6/bbl is below $10/bbl if we round.',
            is_correct: false,
            feedback: 'No: even rounded, 10.6 is above 10.',
          },
          {
            text: 'No. We still need about $3.5/bbl of savings.',
            is_correct: false,
            feedback: '$3.5/bbl is the gap after selling sites (13.5 vs 10), not after levers (10.6 vs 10).',
          },
        ],
      },
    },
    {
      step_id: 9,
      type: 'synthesis',
      phase_name: 'Final Recommendation',
      context: 'The CEO wants a clear recommendation: sell sites or not, and which levers to activate to reach $10/bbl.',
      instruction: 'Formulate your recommendation to the CEO.',
      interaction_data: {
        required_elements: [
          'Position on selling the 2 sites',
          'Quantified baseline ($12.27/bbl)',
          'Post-sale result ($13.5/bbl) and interpretation (loss of scale)',
          'Priority out-of-the-box levers',
          'Implementation plan and ST/MT/LT risks',
        ],
        model_answer_text:
          "Recommendation: do not sell the 2 sites. The baseline is about $12.27/bbl ($270M OPEX over ~22M bbl/year). Selling 2 sites, while 'obvious', worsens unit cost to ~$13.5/bbl because production falls and scale benefits disappear (overheads do not decline proportionally).\n\nTo move toward the $10/bbl target, we should instead activate operational levers on the largest buckets:\n\n1) Machines & maintenance via predictive/connected maintenance, reliability improvements, supplier renegotiation and standardization\n\n2) Support and SG&A via IT automation, footprint rationalization and staffing optimization\n\n3) Transport optimization, input substitution, and higher site utilization (if spare capacity exists) to dilute fixed costs\n\nThe case indicates these levers can bring cost to ~$10.6/bbl, leaving a residual ~$0.6/bbl gap.\n\nNext steps: deep-dive the drivers of machines & maintenance (frequency vs severity, site accessibility), build an initiative pipeline with quantified impacts and ST/MT/LT risks (quality, social impact, sustainability), then pilot on one site before scaling.",
      },
    },
  ],
};

// ============================================================
// Demo Cases Collection
// ============================================================

export type CaseSubcategory = 'profit' | 'brainteaser' | 'out_of_the_box';

export interface DemoCase {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  difficulty: string;
  estimatedMinutes: number;
  tags: string[];
  subcategory: CaseSubcategory;
  caseEn: CaseJson;
  caseFr: CaseJson;
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: 'tower_operators_tdf',
    titleEn: 'Tower Operators (TDF France)',
    titleFr: 'Tower Operators (TDF France)',
    descriptionEn: 'Market sizing & market share projection for a telecom infrastructure company over 10 years.',
    descriptionFr: "Market sizing & projection de part de marché pour une entreprise d'infrastructure télécom sur 10 ans.",
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    tags: ['market-sizing', 'telecoms', 'infrastructure'],
    subcategory: 'profit',
    caseEn: DEMO_CASE_TOWER_OPERATORS_EN,
    caseFr: DEMO_CASE_TOWER_OPERATORS_FR,
  },
  {
    id: 'banking_atm_profitability',
    titleEn: 'Banking & Distribution — ATM Profitability',
    titleFr: 'Banking & Distribution — Rentabilité filiale DAB',
    descriptionEn: 'Profitability analysis and cost reduction strategy for an ATM subsidiary through partnership.',
    descriptionFr: 'Analyse de rentabilité et stratégie de réduction des coûts pour une filiale DAB via partenariat.',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    tags: ['profitability', 'cost-reduction', 'banking', 'partnership'],
    subcategory: 'profit',
    caseEn: DEMO_CASE_ATM_PROFITABILITY_EN,
    caseFr: DEMO_CASE_ATM_PROFITABILITY_FR,
  },
  {
    id: 'mcdonalds_ev_chargers',
    titleEn: "McDonald's — EV Charging Stations",
    titleFr: "McDonald's — Bornes de recharge",
    descriptionEn: 'Comparative analysis of operating models for EV charging station deployment at restaurants.',
    descriptionFr: 'Analyse comparative des modèles opérationnels pour le déploiement de bornes de recharge.',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    tags: ['comparative', 'investment', 'restaurant', 'energy', 'ev-charging'],
    subcategory: 'profit',
    caseEn: DEMO_CASE_MCDONALDS_EV_EN,
    caseFr: DEMO_CASE_MCDONALDS_EV_FR,
  },
  {
    id: 'metal_alloy_investment',
    titleEn: 'Metal Alloy — Invest or Not?',
    titleFr: 'Alliage métallique — Investir ou pas ?',
    descriptionEn: 'CAPEX investment analysis with payback calculation for manufacturing insourcing.',
    descriptionFr: "Analyse d'investissement CAPEX avec calcul de payback pour internalisation de production.",
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    tags: ['brainteaser', 'investment', 'payback', 'capex', 'manufacturing'],
    subcategory: 'brainteaser',
    caseEn: DEMO_CASE_METAL_ALLOY_EN,
    caseFr: DEMO_CASE_METAL_ALLOY_FR,
  },
  {
    id: 'oil_gas_target_costing',
    titleEn: 'Oil & Gas — Target Costing to $10/bbl',
    titleFr: 'Gas & Oil — Target Costing à 10$/baril',
    descriptionEn: 'Gap analysis to reduce OPEX per barrel through creative operational levers instead of asset sales.',
    descriptionFr: 'Analyse de gap pour réduire l\'OPEX par baril via des leviers opérationnels créatifs plutôt que la vente d\'actifs.',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    tags: ['target-costing', 'gap-analysis', 'oil-gas', 'cost-reduction', 'out-of-the-box'],
    subcategory: 'out_of_the_box',
    caseEn: DEMO_CASE_OIL_GAS_EN,
    caseFr: DEMO_CASE_OIL_GAS_FR,
  },
];

// Helper function to get demo case by language
export function getDemoCaseByLanguage(caseId: string, language: 'fr' | 'en'): CaseJson | undefined {
  const demoCase = DEMO_CASES.find((c) => c.id === caseId);
  if (!demoCase) return undefined;
  return language === 'fr' ? demoCase.caseFr : demoCase.caseEn;
}

// Get all demo cases for display
export function getAllDemoCases(): DemoCase[] {
  return DEMO_CASES;
}
