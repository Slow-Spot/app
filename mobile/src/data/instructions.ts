// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Database
// Structural data only - all text comes from i18n translations
// ══════════════════════════════════════════════════════════════

import { PreSessionInstruction } from '../types/instructions';

export const PRE_SESSION_INSTRUCTIONS: Record<string, PreSessionInstruction> = {
  // ══════════════════════════════════════════════════════════════
  // LEVEL 1: BEGINNER - Breath Awareness
  // ══════════════════════════════════════════════════════════════
  'level1_breath': {
    id: 'level1_breath',
    sessionLevel: 1,
    technique: 'breath_awareness',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'chair',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 3,
        icon: 'praying-hands',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
      {
        order: 4,
        icon: 'eye',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 60,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 120,
        message: '', // Fetched from translations
        type: 'gentle',
      },
      {
        time: 300,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 1: BEGINNER - Body Scan
  // ══════════════════════════════════════════════════════════════
  'level1_body_scan': {
    id: 'level1_body_scan',
    sessionLevel: 1,
    technique: 'body_scan',
    timeOfDay: 'evening',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'bed',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'walking',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 3,
        icon: 'thermometer',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 45,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 180,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 2: INTERMEDIATE - Breath Counting
  // ══════════════════════════════════════════════════════════════
  'level2_breath_counting': {
    id: 'level2_breath_counting',
    sessionLevel: 2,
    technique: 'breath_awareness',
    timeOfDay: 'morning',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'anchor',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 90,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 150,
        message: '', // Fetched from translations
        type: 'technique',
      },
      {
        time: 420,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 3: INTERMEDIATE - Loving-Kindness
  // ══════════════════════════════════════════════════════════════
  'level3_loving_kindness': {
    id: 'level3_loving_kindness',
    sessionLevel: 3,
    technique: 'loving_kindness',
    timeOfDay: 'afternoon',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'heart',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'smile',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 60,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 200,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
      {
        time: 450,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 4: ADVANCED - Open Awareness
  // ══════════════════════════════════════════════════════════════
  'level4_open_awareness': {
    id: 'level4_open_awareness',
    sessionLevel: 4,
    technique: 'open_awareness',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'water',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'eye',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 120,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 240,
        message: '', // Fetched from translations
        type: 'technique',
      },
      {
        time: 540,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 5: MASTER - Vipassana
  // ══════════════════════════════════════════════════════════════
  'level5_vipassana': {
    id: 'level5_vipassana',
    sessionLevel: 5,
    technique: 'vipassana',
    timeOfDay: 'morning',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'mountain',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 180,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 300,
        message: '', // Fetched from translations
        type: 'technique',
      },
      {
        time: 600,
        message: '', // Fetched from translations
        type: 'technique',
      },
      {
        time: 900,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // ZEN MEDITATION (Cross-Level)
  // ══════════════════════════════════════════════════════════════
  'zen_meditation': {
    id: 'zen_meditation',
    sessionLevel: 3,
    technique: 'zen',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'eye',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 3,
        icon: 'bullseye',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    duringSessionReminders: [
      {
        time: 360,
        message: '', // Fetched from translations
        type: 'gentle',
      },
      {
        time: 720,
        message: '', // Fetched from translations
        type: 'technique',
      },
    ],
  },

  // Alias for zen_meditation
  'zen_zazen': {
    id: 'zen_zazen',
    sessionLevel: 3,
    technique: 'zen',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations (zazen specific posture)
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'eye',
        title: '', // Fetched from translations (half-open eyes)
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 3,
        icon: 'praying-hands',
        title: '', // Fetched from translations (cosmic mudra)
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (shikantaza - just sitting)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    duringSessionReminders: [
      {
        time: 360,
        message: '', // Fetched from translations
        type: 'gentle',
      },
      {
        time: 720,
        message: '', // Fetched from translations
        type: 'technique',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 3: INTERMEDIATE - Mindfulness/Insight
  // ══════════════════════════════════════════════════════════════
  'level3_mindfulness': {
    id: 'level3_mindfulness',
    sessionLevel: 3,
    technique: 'vipassana',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'anchor',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (observe impermanence)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 60,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 240,
        message: '', // Fetched from translations (anicca - impermanence)
        type: 'technique',
      },
      {
        time: 600,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // LEVEL 4: ADVANCED - Vipassana Body Scan
  // ══════════════════════════════════════════════════════════════
  'level4_vipassana_scan': {
    id: 'level4_vipassana_scan',
    sessionLevel: 4,
    technique: 'vipassana',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'mountain',
        title: '', // Fetched from translations (equanimity)
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations
      focusPoint: '', // Fetched from translations (systematic body scanning)
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 120,
      pattern: 'box',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 360,
        message: '', // Fetched from translations (observe without reaction)
        type: 'technique',
      },
      {
        time: 900,
        message: '', // Fetched from translations (equanimity)
        type: 'gentle',
      },
      {
        time: 1200,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // OCCASION-BASED INSTRUCTIONS
  // ══════════════════════════════════════════════════════════════

  // MORNING ENERGY (Level 1)
  'morning_energy': {
    id: 'morning_energy',
    sessionLevel: 1,
    technique: 'breath_awareness',
    timeOfDay: 'morning',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'chair',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (energize for the day)
      focusPoint: '', // Fetched from translations (breath)
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 45,
      pattern: 'equal',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 120,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
      {
        time: 240,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // STRESS RELIEF (Level 1)
  'stress_relief': {
    id: 'stress_relief',
    sessionLevel: 1,
    technique: 'breath_awareness',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'chair',
        title: '', // Fetched from translations (can be anywhere)
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'spa',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (release tension)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 30,
      pattern: 'calm',
      instruction: '', // Fetched from translations (3-6 breathing)
    },

    duringSessionReminders: [
      {
        time: 90,
        message: '', // Fetched from translations
        type: 'gentle',
      },
      {
        time: 180,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
    ],
  },

  // SLEEP PREPARATION (Level 1)
  'sleep_preparation': {
    id: 'sleep_preparation',
    sessionLevel: 1,
    technique: 'body_scan',
    timeOfDay: 'evening',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'bed',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'thermometer',
        title: '', // Fetched from translations (cool room)
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (prepare for rest)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 45,
      pattern: '4-7-8',
      instruction: '', // Fetched from translations (deep relaxation)
    },

    duringSessionReminders: [
      {
        time: 180,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },

  // ANXIETY CALM (Level 1)
  'anxiety_calm': {
    id: 'anxiety_calm',
    sessionLevel: 1,
    technique: 'breath_awareness',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'chair',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'anchor',
        title: '', // Fetched from translations (grounding)
        description: '', // Fetched from translations
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (calm anxiety)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 45,
      pattern: '4-7-8',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 120,
        message: '', // Fetched from translations (you are safe)
        type: 'gentle',
      },
      {
        time: 240,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
    ],
  },

  // GRATITUDE PRACTICE (Level 1)
  'gratitude_practice': {
    id: 'gratitude_practice',
    sessionLevel: 1,
    technique: 'loving_kindness',
    timeOfDay: 'any',
    title: '', // Fetched from translations
    subtitle: '', // Fetched from translations

    physicalSetup: [
      {
        order: 1,
        icon: 'heart',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: false,
      },
      {
        order: 2,
        icon: 'smile',
        title: '', // Fetched from translations
        description: '', // Fetched from translations
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: '', // Fetched from translations (cultivate gratitude)
      focusPoint: '', // Fetched from translations
      commonChallenges: [], // Fetched from translations
    },

    sessionTips: [], // Fetched from translations

    breathingPrep: {
      duration: 30,
      pattern: 'calm',
      instruction: '', // Fetched from translations
    },

    duringSessionReminders: [
      {
        time: 150,
        message: '', // Fetched from translations
        type: 'encouragement',
      },
      {
        time: 360,
        message: '', // Fetched from translations
        type: 'gentle',
      },
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// Helper Function: Get Instruction by Session with Translations
// ══════════════════════════════════════════════════════════════

export const getInstructionForSession = (
  level: number,
  technique: string = 'breath_awareness'
): PreSessionInstruction => {
  const key = `level${level}_${technique}`;
  const instruction = PRE_SESSION_INSTRUCTIONS[key] ?? PRE_SESSION_INSTRUCTIONS['level1_breath'];
  if (!instruction) {
    throw new Error(`No instruction found for key: ${key}`);
  }
  return instruction;
};

// ══════════════════════════════════════════════════════════════
// Time-of-Day Recommendations (Translation keys only)
// ══════════════════════════════════════════════════════════════

export const getTimeOfDayRecommendationKey = (hour: number): string => {
  if (hour >= 5 && hour < 12) {
    return 'instructions.timeOfDay.morningRecommendation';
  } else if (hour >= 12 && hour < 17) {
    return 'instructions.timeOfDay.afternoonRecommendation';
  } else if (hour >= 17 && hour < 22) {
    return 'instructions.timeOfDay.eveningRecommendation';
  } else {
    return 'instructions.timeOfDay.nightRecommendation';
  }
};
