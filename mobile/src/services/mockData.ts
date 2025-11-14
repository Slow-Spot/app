import { Quote, MeditationSession } from './api';

export const MOCK_QUOTES: Quote[] = [
  {
    id: 1,
    text: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: 'Meditation is not evasion; it is a serene encounter with reality.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Inner Peace',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    text: 'Meditation is a way for nourishing and blossoming the divinity within you.',
    author: 'Amit Ray',
    languageCode: 'en',
    category: 'Growth',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    text: 'Quiet the mind and the soul will speak.',
    author: 'Ma Jaya Sati Bhagavati',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    text: 'Wherever you are, be there totally.',
    author: 'Eckhart Tolle',
    languageCode: 'en',
    category: 'Presence',
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    text: 'The goal of meditation is not to get rid of thoughts or emotions. The goal is to become more aware of your thoughts and emotions.',
    author: 'Jon Kabat-Zinn',
    languageCode: 'en',
    category: 'Awareness',
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_SESSIONS: MeditationSession[] = [
  // TRADITIONAL BEGINNER SESSIONS (Level 1)
  {
    id: 1,
    title: 'Morning Awakening',
    description: 'Start your day with clarity and focus. A gentle 5-minute practice to center yourself.',
    languageCode: 'en',
    durationSeconds: 300, // 5 minutes
    level: 1,
    cultureTag: 'traditional',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Breath Awareness',
    description: 'Focus on your natural breath. A foundational practice for beginners.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 1,
    cultureTag: 'traditional',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Body Scan Relaxation',
    description: 'Progressive relaxation technique moving attention through the body.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'traditional',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Loving Kindness',
    description: 'Cultivate compassion and goodwill toward yourself and others.',
    languageCode: 'en',
    durationSeconds: 720, // 12 minutes
    level: 2,
    cultureTag: 'traditional',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Deep Meditation',
    description: 'Extended practice for experienced meditators. Dive into stillness.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'traditional',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // OCCASION-SPECIFIC SESSIONS
  // Morning Energy
  {
    id: 10,
    title: 'Morning Energy Boost',
    description: 'Energize your body and mind for the day ahead with breath techniques.',
    languageCode: 'en',
    durationSeconds: 480, // 8 minutes
    level: 1,
    cultureTag: 'occasion_morning',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    title: 'Sunrise Meditation',
    description: 'Greet the new day with gratitude and intention setting.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 2,
    cultureTag: 'occasion_morning',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Stress Relief
  {
    id: 20,
    title: 'Quick Stress Relief',
    description: 'Release tension in just 5 minutes. Perfect for work breaks.',
    languageCode: 'en',
    durationSeconds: 300, // 5 minutes
    level: 1,
    cultureTag: 'occasion_stress',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 21,
    title: 'Deep Stress Release',
    description: 'Comprehensive stress relief through progressive relaxation.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'occasion_stress',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Sleep Preparation
  {
    id: 30,
    title: 'Evening Wind Down',
    description: 'Release the day\'s tensions and prepare for restful sleep.',
    languageCode: 'en',
    durationSeconds: 480, // 8 minutes
    level: 1,
    cultureTag: 'occasion_sleep',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 31,
    title: 'Sleep Sanctuary',
    description: 'Deep body scan and relaxation for profound rest.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 2,
    cultureTag: 'occasion_sleep',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Deep Focus
  {
    id: 40,
    title: 'Concentration Builder',
    description: 'Sharpen your focus and eliminate distractions.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 2,
    cultureTag: 'occasion_focus',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 41,
    title: 'Flow State Activation',
    description: 'Enter deep concentration for work or study.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 3,
    cultureTag: 'occasion_focus',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Anxiety Release
  {
    id: 50,
    title: 'Calm Anxiety',
    description: 'Soothe anxious thoughts with gentle breath awareness.',
    languageCode: 'en',
    durationSeconds: 420, // 7 minutes
    level: 1,
    cultureTag: 'occasion_anxiety',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 51,
    title: 'Anxiety Release Practice',
    description: 'Ground yourself and release worry through body awareness.',
    languageCode: 'en',
    durationSeconds: 720, // 12 minutes
    level: 2,
    cultureTag: 'occasion_anxiety',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Grief & Loss
  {
    id: 60,
    title: 'Healing Through Grief',
    description: 'A gentle space to honor loss and find peace.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'occasion_grief',
    ambientFrequency: 528, // Healing frequency
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 61,
    title: 'Embracing Loss',
    description: 'Compassionate meditation for processing difficult emotions.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'occasion_grief',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Gratitude Practice
  {
    id: 70,
    title: 'Gratitude Reflection',
    description: 'Cultivate appreciation for life\'s blessings.',
    languageCode: 'en',
    durationSeconds: 480, // 8 minutes
    level: 1,
    cultureTag: 'occasion_gratitude',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 71,
    title: 'Deep Gratitude Journey',
    description: 'Explore profound thankfulness and joy.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'occasion_gratitude',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Creative Inspiration
  {
    id: 80,
    title: 'Creative Awakening',
    description: 'Unlock your creative potential through open awareness.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 2,
    cultureTag: 'occasion_creativity',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 81,
    title: 'Inspiration Flow',
    description: 'Access your inner muse and creative genius.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 3,
    cultureTag: 'occasion_creativity',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // CULTURALLY DIVERSE MEDITATION SESSIONS
  // Zen (Japanese)
  {
    id: 100,
    title: 'Zazen - Zen Sitting',
    description: 'Traditional Zen meditation. Just sitting, observing breath and thoughts.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'zen',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 101,
    title: 'Kinhin - Zen Walking',
    description: 'Slow, mindful walking between sitting periods.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 2,
    cultureTag: 'zen',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 102,
    title: 'Beginner Zazen',
    description: 'Introduction to Zen sitting meditation practice.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 1,
    cultureTag: 'zen',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Vipassana (Buddhist)
  {
    id: 110,
    title: 'Vipassana Body Scan',
    description: 'Systematic awareness of sensations throughout the body.',
    languageCode: 'en',
    durationSeconds: 1800, // 30 minutes
    level: 4,
    cultureTag: 'vipassana',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 111,
    title: 'Insight Meditation',
    description: 'Observe the impermanent nature of all phenomena.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'vipassana',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 112,
    title: 'Beginner Vipassana',
    description: 'Introduction to insight meditation practice.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'vipassana',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Vedic (Hindu)
  {
    id: 120,
    title: 'Om Meditation',
    description: 'Chant and meditate on the primordial sound Om.',
    languageCode: 'en',
    durationSeconds: 720, // 12 minutes
    level: 2,
    cultureTag: 'vedic',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 121,
    title: 'Transcendental Meditation',
    description: 'Settle into deep inner silence with mantra practice.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'vedic',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 122,
    title: 'Chakra Awareness',
    description: 'Journey through the seven energy centers.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'vedic',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Taoist (Chinese)
  {
    id: 130,
    title: 'Qigong Meditation',
    description: 'Cultivate Qi energy through breath and visualization.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'taoist',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 131,
    title: 'Inner Smile Practice',
    description: 'Taoist meditation for cultivating inner peace and joy.',
    languageCode: 'en',
    durationSeconds: 720, // 12 minutes
    level: 2,
    cultureTag: 'taoist',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 132,
    title: 'Wu Wei - Effortless Being',
    description: 'Flow with the natural way of things.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'taoist',
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Sufi (Islamic)
  {
    id: 140,
    title: 'Dhikr - Remembrance',
    description: 'Rhythmic remembrance of the Divine.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'sufi',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 141,
    title: 'Muraqaba - Heart Meditation',
    description: 'Sufi contemplation of the heart center.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 3,
    cultureTag: 'sufi',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 142,
    title: 'Breath of Compassion',
    description: 'Sufi breathing practice for opening the heart.',
    languageCode: 'en',
    durationSeconds: 720, // 12 minutes
    level: 2,
    cultureTag: 'sufi',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },

  // Christian Contemplative
  {
    id: 150,
    title: 'Centering Prayer',
    description: 'Silent communion with God through sacred word.',
    languageCode: 'en',
    durationSeconds: 1200, // 20 minutes
    level: 2,
    cultureTag: 'christian',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 151,
    title: 'Lectio Divina',
    description: 'Contemplative scripture reading and meditation.',
    languageCode: 'en',
    durationSeconds: 900, // 15 minutes
    level: 2,
    cultureTag: 'christian',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 152,
    title: 'Contemplative Silence',
    description: 'Rest in the presence of the Divine.',
    languageCode: 'en',
    durationSeconds: 1500, // 25 minutes
    level: 3,
    cultureTag: 'christian',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 153,
    title: 'Breath Prayer',
    description: 'Rhythmic prayer synchronized with breathing.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 1,
    cultureTag: 'christian',
    ambientFrequency: 528,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
];
