// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions Database
// Comprehensive instructions for all levels and techniques
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
    title: 'Welcome to Your First Meditation',
    subtitle: 'Let\'s build the foundation together',

    physicalSetup: [
      {
        order: 1,
        icon: '🪑',
        title: 'Find Your Seat',
        description: 'Sit on a chair, cushion, or cross-legged on the floor. Your comfort matters most.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '🧘',
        title: 'Posture Check',
        description: 'Keep your spine straight but not rigid. Imagine a string gently pulling your head toward the sky.',
        isOptional: false,
      },
      {
        order: 3,
        icon: '🙏',
        title: 'Hand Placement',
        description: 'Rest your hands on your knees or in your lap. Let your shoulders relax down and back.',
        isOptional: true,
      },
      {
        order: 4,
        icon: '👀',
        title: 'Eyes',
        description: 'You can close your eyes or keep them softly focused on a point in front of you.',
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: 'Simply notice your breath without trying to change it',
      focusPoint: 'The natural rhythm of breathing in and out',
      commonChallenges: [
        'Mind wandering is completely normal',
        'You don\'t need to empty your mind',
        'There\'s no "perfect" meditation',
      ],
    },

    sessionTips: [
      'Start with just noticing when you breathe in and when you breathe out',
      'When your mind wanders, gently bring attention back to your breath',
      'Be patient and kind with yourself—this is a practice',
      'Every moment of awareness counts, no matter how brief',
    ],

    breathingPrep: {
      duration: 60,
      pattern: 'equal',
      instruction: 'Take 5 slow, deep breaths to settle in. Breathe in for 4 counts, out for 4 counts.',
    },

    duringSessionReminders: [
      {
        time: 120,
        message: 'Notice the sensation of breath at your nostrils or belly',
        type: 'gentle',
      },
      {
        time: 300,
        message: 'Mind wandered? That\'s perfectly normal. Gently return to the breath.',
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
    title: 'Relax with Body Awareness',
    subtitle: 'Release tension from head to toe',

    physicalSetup: [
      {
        order: 1,
        icon: '🛏️',
        title: 'Lie Down Comfortably',
        description: 'Lie on your back with arms at your sides, palms facing up. Use a pillow if needed.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '🦶',
        title: 'Legs Uncrossed',
        description: 'Let your feet fall naturally to the sides. No need to hold any position.',
        isOptional: false,
      },
      {
        order: 3,
        icon: '🌡️',
        title: 'Temperature',
        description: 'Cover yourself with a blanket if you tend to feel cold during rest.',
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: 'Systematically relax each part of your body',
      focusPoint: 'Sensations in different body parts as you scan through them',
      commonChallenges: [
        'Falling asleep is okay—your body needs rest',
        'You might not feel much in some areas, and that\'s normal',
        'Tension might increase before it releases',
      ],
    },

    sessionTips: [
      'Don\'t try to force relaxation—just observe what you feel',
      'Notice warmth, coolness, tingling, or nothing at all',
      'If you fall asleep, consider this a successful relaxation',
      'There\'s no need to remember the exact order—the voice will guide you',
    ],

    breathingPrep: {
      duration: 45,
      pattern: 'calm',
      instruction: 'Take 3 deep sighs. Breathe in through your nose, sigh out loudly through your mouth.',
    },

    duringSessionReminders: [
      {
        time: 180,
        message: 'Allow each body part to become heavy and relaxed',
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
    title: 'Sharpen Your Focus',
    subtitle: 'Build concentration through breath counting',

    physicalSetup: [
      {
        order: 1,
        icon: '🧘',
        title: 'Stable Posture',
        description: 'Sit with your spine naturally upright. Find a posture you can maintain comfortably.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '⚓',
        title: 'Root Down',
        description: 'Feel your sitting bones or feet connecting to the ground. This is your anchor.',
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: 'Develop single-pointed concentration',
      focusPoint: 'Counting each exhale from 1 to 10, then starting over',
      commonChallenges: [
        'Losing count is part of the practice',
        'The mind will try to jump ahead or drift',
        'Frustration is normal—meet it with curiosity',
      ],
    },

    sessionTips: [
      'Count silently at the end of each out-breath: "one", "two", "three"...',
      'When you reach 10, start again at 1',
      'Lost count? No problem. Start over at 1 with kindness',
      'Notice the temptation to rush or anticipate the next number',
    ],

    breathingPrep: {
      duration: 90,
      pattern: 'box',
      instruction: 'Box breathing: Inhale 4, hold 4, exhale 4, hold 4. Repeat 3 times.',
    },

    duringSessionReminders: [
      {
        time: 150,
        message: 'Notice the quality of your attention. Are you present with each count?',
        type: 'technique',
      },
      {
        time: 420,
        message: 'You\'re building powerful focus. Each return to counting strengthens your mind.',
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
    title: 'Cultivate Compassion',
    subtitle: 'Extend kindness to yourself and others',

    physicalSetup: [
      {
        order: 1,
        icon: '❤️',
        title: 'Heart-Centered Posture',
        description: 'Sit comfortably with your chest open. You might place one hand over your heart.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '😊',
        title: 'Gentle Expression',
        description: 'Let your face soften, perhaps allowing a slight smile.',
        isOptional: true,
      },
    ],

    mentalPreparation: {
      intention: 'Generate warmth and goodwill toward yourself and others',
      focusPoint: 'Phrases of loving-kindness repeated mentally',
      commonChallenges: [
        'It might feel awkward or fake at first',
        'Difficult emotions may arise—this is healing',
        'Some people are harder to wish well for',
      ],
    },

    sessionTips: [
      'Start with someone easy to love, like a pet or close friend',
      'Repeat phrases silently: "May you be happy, may you be healthy, may you be safe"',
      'Feel the meaning behind the words, not just the words themselves',
      'If resistance comes up, acknowledge it with compassion',
    ],

    breathingPrep: {
      duration: 60,
      pattern: 'calm',
      instruction: 'Breathe naturally while placing your hand over your heart. Feel your chest rise and fall.',
    },

    duringSessionReminders: [
      {
        time: 200,
        message: 'You deserve kindness just as much as anyone else',
        type: 'encouragement',
      },
      {
        time: 450,
        message: 'Notice any warmth or softness in your heart area',
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
    title: 'Rest in Pure Awareness',
    subtitle: 'Be present with whatever arises',

    physicalSetup: [
      {
        order: 1,
        icon: '🌊',
        title: 'Relaxed Alertness',
        description: 'Find a posture that balances ease and wakefulness. You know your body best now.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '👁️',
        title: 'Open Gaze (Optional)',
        description: 'Try meditating with eyes slightly open, gaze soft and unfocused.',
        isOptional: true,
      },
    },

    mentalPreparation: {
      intention: 'Allow experience to flow without grasping or pushing away',
      focusPoint: 'The spacious awareness itself, not any particular object',
      commonChallenges: [
        'Mind might feel too scattered without an anchor',
        'Boredom or restlessness is common',
        'Subtle grasping at "good" meditation moments',
      ],
    },

    sessionTips: [
      'Begin with breath, then expand to include all sensations',
      'Let sounds, thoughts, and feelings arise and pass naturally',
      'You\'re not trying to achieve a state—you\'re recognizing awareness itself',
      'If lost, gently return to body or breath as an anchor',
    ],

    breathingPrep: {
      duration: 120,
      pattern: '4-7-8',
      instruction: '4-7-8 breath: Inhale for 4, hold for 7, exhale for 8. This deeply calms the nervous system.',
    },

    duringSessionReminders: [
      {
        time: 240,
        message: 'Notice awareness itself—the space in which all experience happens',
        type: 'technique',
      },
      {
        time: 540,
        message: 'Whatever arises, let it be. You are the sky, not the weather.',
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
    title: 'Insight Through Direct Observation',
    subtitle: 'See the three characteristics: impermanence, unsatisfactoriness, non-self',

    physicalSetup: [
      {
        order: 1,
        icon: '🪷',
        title: 'Traditional Posture',
        description: 'Sit in your established meditation posture. Stillness supports insight.',
        isOptional: false,
      },
      {
        order: 2,
        icon: '⛰️',
        title: 'Mountain-Like',
        description: 'Embody stability and presence, unmoved by passing phenomena.',
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: 'Investigate the nature of experience with precision and equanimity',
      focusPoint: 'Arising and passing of sensations, thoughts, and mental states',
      commonChallenges: [
        'Strong sensations (pain, heat, tingling) will arise',
        'Don\'t react—observe with equanimity',
        'Insights can be destabilizing; take breaks if needed',
      ],
    },

    sessionTips: [
      'Scan body systematically, noting sensations: "tingling", "warmth", "pressure"',
      'Observe how everything arises, changes, and passes away',
      'When pain arises, investigate its edges, quality, and impermanence',
      'Maintain equanimity—not seeking pleasant or avoiding unpleasant',
    ],

    breathingPrep: {
      duration: 180,
      pattern: 'equal',
      instruction: 'Settle with 10 minutes of breath awareness before beginning the scan. (Or use session time.)',
    },

    duringSessionReminders: [
      {
        time: 300,
        message: 'Notice: arising, persisting, passing away. Everything is in flux.',
        type: 'technique',
      },
      {
        time: 600,
        message: 'Strong sensations are opportunities for insight, not obstacles.',
        type: 'technique',
      },
      {
        time: 900,
        message: 'Equanimity is the key. Observe, don\'t react.',
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
    title: 'Zazen: Just Sitting',
    subtitle: 'The practice of shikantaza—"nothing but precisely sitting"',

    physicalSetup: [
      {
        order: 1,
        icon: '🧘‍♂️',
        title: 'Zen Posture',
        description: 'Sit in half-lotus, full-lotus, or seiza. Hands in cosmic mudra (left hand resting in right).',
        isOptional: false,
      },
      {
        order: 2,
        icon: '👁️',
        title: 'Eyes Half-Open',
        description: 'Gaze down at 45° angle, 3-4 feet ahead. Eyes neither fully open nor closed.',
        isOptional: false,
      },
      {
        order: 3,
        icon: '🎯',
        title: 'Precise Alignment',
        description: 'Ears over shoulders, nose over navel. Rock side to side to find center.',
        isOptional: false,
      },
    ],

    mentalPreparation: {
      intention: 'Simply sit. No goal, no attainment, no becoming.',
      focusPoint: 'The totality of being in this moment',
      commonChallenges: [
        'The simplicity feels too simple',
        'Mind wants something to "do"',
        'Doubt: "Am I doing this right?"',
      ],
    },

    sessionTips: [
      'When thoughts arise, don\'t follow them. Let them pass like clouds.',
      'If you need an anchor, count breaths from 1 to 10, then start over',
      'Posture is practice. Maintain form with gentle discipline.',
      'This is not about achieving peace—it\'s about being fully present.',
    ],

    duringSessionReminders: [
      {
        time: 360,
        message: 'Just this. Just sitting. Nothing extra needed.',
        type: 'gentle',
      },
      {
        time: 720,
        message: 'Maintain your posture with gentle persistence.',
        type: 'technique',
      },
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// Helper Function: Get Instruction by Session
// ══════════════════════════════════════════════════════════════

export const getInstructionForSession = (
  level: number,
  technique: string = 'breath_awareness'
): PreSessionInstruction => {
  const key = `level${level}_${technique}`;
  return PRE_SESSION_INSTRUCTIONS[key] || PRE_SESSION_INSTRUCTIONS['level1_breath'];
};

// ══════════════════════════════════════════════════════════════
// Time-of-Day Recommendations
// ══════════════════════════════════════════════════════════════

export const getTimeOfDayRecommendation = (hour: number): string => {
  if (hour >= 5 && hour < 12) {
    return 'Morning meditations set the tone for your day. Try breath counting or visualization.';
  } else if (hour >= 12 && hour < 17) {
    return 'Afternoon practice refreshes your mind. Consider loving-kindness or a walking meditation.';
  } else if (hour >= 17 && hour < 22) {
    return 'Evening sessions help you unwind. Body scan or gentle breath awareness work beautifully.';
  } else {
    return 'Late night meditation can prepare you for restful sleep. Body scan is highly recommended.';
  }
};
