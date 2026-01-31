import type { Language } from '@/lib/store/language-store';

export interface Translations {
  // Common
  common: {
    back: string;
    next: string;
    previous: string;
    skip: string;
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    close: string;
    continue: string;
    loading: string;
    error: string;
    success: string;
  };

  // Session
  session: {
    title: string;
    practiceSession: string;
    correct: string;
    accuracy: string;
    xpEarned: string;
    duration: string;
    perfectSession: string;
    greatJob: string;
    sessionComplete: string;
    keepItUp: string;
    continueLearning: string;
    backToDashboard: string;
    loadingSession: string;
    skipPenalty: string;
  };

  // Flashcard
  flashcard: {
    showAnswer: string;
    rateYourAnswer: string;
    forgotten: string;
    hard: string;
    medium: string;
    good: string;
    perfect: string;
    forgottenDesc: string;
    hardDesc: string;
    mediumDesc: string;
    goodDesc: string;
    perfectDesc: string;
    pressSpace: string;
    pressKeys: string;
    typeYourAnswer: string;
    yourAnswer: string;
    correctAnswer: string;
    incorrect: string;
    checkAnswer: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    todaysMission: string;
    quickDrill: string;
    quickDrillDesc: string;
    reviewDue: string;
    itemsReadyForReview: string;
    weaknessFocus: string;
    focusOn: string;
    allAreasBalanced: string;
    recommended: string;
    continueLeaning: string;
    continueLearning: string;
    skillRadar: string;
    skillOverview: string;
    startSession: string;
    level: string;
    streak: string;
    xp: string;
    recentAchievements: string;
    viewAllAchievements: string;
    thisWeek: string;
    daysCompleted: string;
    keepGoing: string;
    viewAll: string;
    focusArea: string;
    completeMoreDrills: string;
    humanCalculator: string;
    trainYourBrain: string;
    trainNow: string;
    personalBest: string;
    readyToCrush: string;
    notifications: string;
    viewAllNotifications: string;
    profile: string;
    soundEffects: string;
    darkMode: string;
    helpSupport: string;
    signOut: string;
    weekWarrior: string;
    streakAchieved: string;
    risingStar: string;
    earnedXp: string;
    sessions: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
    // Pillar card
    complete: string;
    items: string;
    completePreviousPillar: string;
  };

  // Math content
  math: {
    squareOf: string;
    cubeOf: string;
    squareExplanation: string;
    cubeExplanation: string;
  };

  // Case module
  case: {
    importCase: string;
    casePlayer: string;
    step: string;
    reveal: string;
    onPaper: string;
    onScreen: string;
    yourResponse: string;
    modelAnswer: string;
    selfEval: string;
    bad: string;
    medium: string;
    good: string;
    excellent: string;
    createFlashcard: string;
    memoPlaceholder: string;
  };

  // Flashcards deck
  flashcardsDeck: {
    title: string;
    noFlashcards: string;
    filter: string;
    allCases: string;
    allTypes: string;
    reset: string;
    filtered: string;
    reviewMode: string;
    listMode: string;
    returnToCase: string;
    personalNote: string;
    createdOn: string;
  };

  // Profile
  profile: {
    title: string;
    statistics: string;
    settings: string;
    account: string;
    totalXp: string;
    currentStreak: string;
    longestStreak: string;
    casesCompleted: string;
    achievementsUnlocked: string;
    practiceTime: string;
    minutes: string;
    hours: string;
    days: string;
    soundEffects: string;
    soundEffectsDesc: string;
    darkMode: string;
    darkModeDesc: string;
    language: string;
    languageDesc: string;
    dailyGoal: string;
    dailyGoalDesc: string;
    viewAchievements: string;
    memberSince: string;
    editProfile: string;
    targetCompany: string;
    experienceLevel: string;
    student: string;
    youngProfessional: string;
    experienced: string;
    careerChanger: string;
  };

  // Help
  help: {
    title: string;
    faq: string;
    contact: string;
    about: string;
    version: string;
    howToUse: string;
    pillarsExplained: string;
    gamificationExplained: string;
    flashcardsExplained: string;
    casesExplained: string;
    calculatorExplained: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    common: {
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      skip: 'Passer',
      confirm: 'Confirmer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      close: 'Fermer',
      continue: 'Continuer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    session: {
      title: 'Session',
      practiceSession: 'Session de pratique',
      correct: 'Correct',
      accuracy: 'Précision',
      xpEarned: 'XP Gagnés',
      duration: 'Durée',
      perfectSession: 'Session parfaite !',
      greatJob: 'Excellent travail !',
      sessionComplete: 'Session terminée',
      keepItUp: 'Continuez comme ça !',
      continueLearning: 'Continuer à apprendre',
      backToDashboard: 'Retour au tableau de bord',
      loadingSession: 'Chargement de la session...',
      skipPenalty: 'Passer (-5 XP)',
    },
    flashcard: {
      showAnswer: 'Voir la réponse',
      rateYourAnswer: 'À quel point connaissiez-vous cette réponse ?',
      forgotten: 'Oublié',
      hard: 'Difficile',
      medium: 'Moyen',
      good: 'Bien',
      perfect: 'Parfait',
      forgottenDesc: 'Je ne savais pas du tout',
      hardDesc: 'Beaucoup de difficulté',
      mediumDesc: 'Correct avec effort',
      goodDesc: 'Correct avec hésitation',
      perfectDesc: 'Rappel instantané',
      pressSpace: 'Appuyez sur Espace pour révéler',
      pressKeys: 'Appuyez sur 1-5 pour évaluer',
      typeYourAnswer: 'Tapez votre réponse...',
      yourAnswer: 'Votre réponse',
      correctAnswer: 'Bonne réponse !',
      incorrect: 'Incorrect',
      checkAnswer: 'Vérifier',
    },
    dashboard: {
      title: 'Tableau de bord',
      welcome: 'Bienvenue',
      todaysMission: 'Mission du jour',
      quickDrill: 'Drill rapide (5m)',
      quickDrillDesc: 'Pratique ciblée de 5 minutes',
      reviewDue: 'Révisions dues',
      itemsReadyForReview: 'éléments à réviser',
      weaknessFocus: 'Point faible',
      focusOn: 'Focus sur',
      allAreasBalanced: 'Tous les domaines équilibrés !',
      recommended: 'Recommandé',
      continueLeaning: 'Continuer',
      continueLearning: 'Continuer à apprendre',
      skillRadar: 'Radar de compétences',
      skillOverview: 'Vue des compétences',
      startSession: 'Commencer',
      level: 'Niveau',
      streak: 'Série',
      xp: 'XP',
      recentAchievements: 'Succès récents',
      viewAllAchievements: 'Voir tous les succès',
      thisWeek: 'Cette semaine',
      daysCompleted: 'jours complétés cette semaine',
      keepGoing: 'Continuez comme ça !',
      viewAll: 'Voir tout',
      focusArea: 'Zone de focus',
      completeMoreDrills: 'drills de plus pour débloquer Industrie: Tech',
      humanCalculator: 'Calculateur Humain',
      trainYourBrain: 'Entraînez votre cerveau',
      trainNow: 'Entraîner maintenant',
      personalBest: 'Meilleur score',
      readyToCrush: 'Prêt à réussir vos entretiens consulting ?',
      notifications: 'Notifications',
      viewAllNotifications: 'Voir toutes les notifications',
      profile: 'Profil',
      soundEffects: 'Effets sonores',
      darkMode: 'Mode sombre',
      helpSupport: 'Aide & Support',
      signOut: 'Se déconnecter',
      weekWarrior: 'Guerrier de la semaine',
      streakAchieved: 'jours de série atteints',
      risingStar: 'Étoile montante',
      earnedXp: 'XP gagnés',
      sessions: 'sessions',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mer',
      thu: 'Jeu',
      fri: 'Ven',
      sat: 'Sam',
      sun: 'Dim',
      complete: 'complété',
      items: 'éléments',
      completePreviousPillar: 'Terminez le pilier précédent pour débloquer',
    },
    math: {
      squareOf: 'Carré de',
      cubeOf: 'Cube de',
      squareExplanation: 'Un nombre au carré est le produit du nombre par lui-même.',
      cubeExplanation: "Le cube d'un nombre est n×n×n.",
    },
    case: {
      importCase: 'Importer un cas',
      casePlayer: 'Lecteur de cas',
      step: 'Étape',
      reveal: 'Révéler',
      onPaper: 'Sur papier',
      onScreen: 'À l\'écran',
      yourResponse: 'Votre réponse',
      modelAnswer: 'Réponse modèle',
      selfEval: 'Auto-évaluation',
      bad: 'Pas du tout',
      medium: 'Moyen',
      good: 'Bien',
      excellent: 'Très bien',
      createFlashcard: 'Créer une flashcard',
      memoPlaceholder: 'Note pour la flashcard...',
    },
    flashcardsDeck: {
      title: 'Révision Cas',
      noFlashcards: 'Aucune flashcard',
      filter: 'Filtrer',
      allCases: 'Tous les cas',
      allTypes: 'Tous les types',
      reset: 'Réinitialiser',
      filtered: 'filtrées',
      reviewMode: 'Review',
      listMode: 'Liste',
      returnToCase: 'Retour au cas',
      personalNote: 'Note personnelle',
      createdOn: 'Créée le',
    },
    profile: {
      title: 'Profil',
      statistics: 'Statistiques',
      settings: 'Paramètres',
      account: 'Compte',
      totalXp: 'XP Total',
      currentStreak: 'Série actuelle',
      longestStreak: 'Plus longue série',
      casesCompleted: 'Cas complétés',
      achievementsUnlocked: 'Succès débloqués',
      practiceTime: 'Temps de pratique',
      minutes: 'minutes',
      hours: 'heures',
      days: 'jours',
      soundEffects: 'Effets sonores',
      soundEffectsDesc: 'Sons de feedback pour les réponses',
      darkMode: 'Mode sombre',
      darkModeDesc: 'Thème sombre pour les yeux',
      language: 'Langue',
      languageDesc: 'Choisir la langue de l\'interface',
      dailyGoal: 'Objectif quotidien',
      dailyGoalDesc: 'Minutes de pratique par jour',
      viewAchievements: 'Voir les succès',
      memberSince: 'Membre depuis',
      editProfile: 'Modifier le profil',
      targetCompany: 'Entreprise cible',
      experienceLevel: 'Niveau d\'expérience',
      student: 'Étudiant',
      youngProfessional: 'Jeune professionnel',
      experienced: 'Expérimenté',
      careerChanger: 'Reconversion',
    },
    help: {
      title: 'Aide & Support',
      faq: 'Questions fréquentes',
      contact: 'Nous contacter',
      about: 'À propos',
      version: 'Version',
      howToUse: 'Comment utiliser ConsultPrep',
      pillarsExplained: 'Les 5 piliers expliqués',
      gamificationExplained: 'XP, niveaux et séries',
      flashcardsExplained: 'Système de flashcards',
      casesExplained: 'Pratique des cas',
      calculatorExplained: 'Calculateur humain',
    },
  },
  en: {
    common: {
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      continue: 'Continue',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    session: {
      title: 'Session',
      practiceSession: 'Practice Session',
      correct: 'Correct',
      accuracy: 'Accuracy',
      xpEarned: 'XP Earned',
      duration: 'Duration',
      perfectSession: 'Perfect Session!',
      greatJob: 'Great Job!',
      sessionComplete: 'Session Complete',
      keepItUp: 'Keep up the great work!',
      continueLearning: 'Continue Learning',
      backToDashboard: 'Back to Dashboard',
      loadingSession: 'Loading session...',
      skipPenalty: 'Skip (-5 XP)',
    },
    flashcard: {
      showAnswer: 'Show Answer',
      rateYourAnswer: 'How well did you know this?',
      forgotten: 'Forgot',
      hard: 'Hard',
      medium: 'Medium',
      good: 'Good',
      perfect: 'Perfect',
      forgottenDesc: "Didn't know at all",
      hardDesc: 'Very difficult',
      mediumDesc: 'Correct with effort',
      goodDesc: 'Correct with hesitation',
      perfectDesc: 'Instant recall',
      pressSpace: 'Press Space to reveal',
      pressKeys: 'Press 1-5 to rate',
      typeYourAnswer: 'Type your answer...',
      yourAnswer: 'Your answer',
      correctAnswer: 'Correct!',
      incorrect: 'Incorrect',
      checkAnswer: 'Check',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      todaysMission: "Today's Mission",
      quickDrill: 'Quick Drill (5m)',
      quickDrillDesc: '5-minute focused practice',
      reviewDue: 'Review Due',
      itemsReadyForReview: 'items ready for review',
      weaknessFocus: 'Weakness Focus',
      focusOn: 'Focus on',
      allAreasBalanced: 'All areas balanced!',
      recommended: 'Recommended',
      continueLeaning: 'Continue',
      continueLearning: 'Continue Learning',
      skillRadar: 'Skill Radar',
      skillOverview: 'Skill Overview',
      startSession: 'Start',
      level: 'Level',
      streak: 'Streak',
      xp: 'XP',
      recentAchievements: 'Recent Achievements',
      viewAllAchievements: 'View all achievements',
      thisWeek: 'This Week',
      daysCompleted: 'days completed this week',
      keepGoing: 'Keep going!',
      viewAll: 'View all',
      focusArea: 'Focus area',
      completeMoreDrills: 'more drills to unlock Industry: Tech',
      humanCalculator: 'Human Calculator',
      trainYourBrain: 'Train your mental math speed for case interviews',
      trainNow: 'Train Now',
      personalBest: 'Personal Best',
      readyToCrush: 'Ready to crush your consulting interview prep?',
      notifications: 'Notifications',
      viewAllNotifications: 'View all notifications',
      profile: 'Profile',
      soundEffects: 'Sound effects',
      darkMode: 'Dark mode',
      helpSupport: 'Help & Support',
      signOut: 'Sign out',
      weekWarrior: 'Week Warrior',
      streakAchieved: 'day streak achieved',
      risingStar: 'Rising Star',
      earnedXp: 'Earned',
      sessions: 'sessions',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
      complete: 'complete',
      items: 'items',
      completePreviousPillar: 'Complete previous pillar to unlock',
    },
    math: {
      squareOf: 'Square of',
      cubeOf: 'Cube of',
      squareExplanation: 'A squared number is the product of a number by itself.',
      cubeExplanation: 'The cube of a number is n×n×n.',
    },
    case: {
      importCase: 'Import Case',
      casePlayer: 'Case Player',
      step: 'Step',
      reveal: 'Reveal',
      onPaper: 'On Paper',
      onScreen: 'On Screen',
      yourResponse: 'Your response',
      modelAnswer: 'Model answer',
      selfEval: 'Self-evaluation',
      bad: 'Not at all',
      medium: 'Medium',
      good: 'Good',
      excellent: 'Excellent',
      createFlashcard: 'Create flashcard',
      memoPlaceholder: 'Note for flashcard...',
    },
    flashcardsDeck: {
      title: 'Case Review',
      noFlashcards: 'No flashcards',
      filter: 'Filter',
      allCases: 'All cases',
      allTypes: 'All types',
      reset: 'Reset',
      filtered: 'filtered',
      reviewMode: 'Review',
      listMode: 'List',
      returnToCase: 'Return to case',
      personalNote: 'Personal note',
      createdOn: 'Created on',
    },
    profile: {
      title: 'Profile',
      statistics: 'Statistics',
      settings: 'Settings',
      account: 'Account',
      totalXp: 'Total XP',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      casesCompleted: 'Cases Completed',
      achievementsUnlocked: 'Achievements Unlocked',
      practiceTime: 'Practice Time',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      soundEffects: 'Sound Effects',
      soundEffectsDesc: 'Feedback sounds for answers',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Dark theme for your eyes',
      language: 'Language',
      languageDesc: 'Choose interface language',
      dailyGoal: 'Daily Goal',
      dailyGoalDesc: 'Minutes of practice per day',
      viewAchievements: 'View Achievements',
      memberSince: 'Member since',
      editProfile: 'Edit Profile',
      targetCompany: 'Target Company',
      experienceLevel: 'Experience Level',
      student: 'Student',
      youngProfessional: 'Young Professional',
      experienced: 'Experienced',
      careerChanger: 'Career Changer',
    },
    help: {
      title: 'Help & Support',
      faq: 'Frequently Asked Questions',
      contact: 'Contact Us',
      about: 'About',
      version: 'Version',
      howToUse: 'How to use ConsultPrep',
      pillarsExplained: 'The 5 pillars explained',
      gamificationExplained: 'XP, levels and streaks',
      flashcardsExplained: 'Flashcard system',
      casesExplained: 'Case practice',
      calculatorExplained: 'Human calculator',
    },
  },
};

// Hook helper to get translations
export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
