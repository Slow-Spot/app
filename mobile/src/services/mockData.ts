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
  {
    id: 1,
    title: 'Morning Awakening',
    description: 'Start your day with clarity and focus. A gentle 5-minute practice to center yourself.',
    languageCode: 'en',
    durationSeconds: 300, // 5 minutes
    level: 1,
    ambientFrequency: 432, // Natural harmonic
    chimeFrequency: 528, // Love/healing frequency
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Breath Awareness',
    description: 'Focus on your natural breath. A foundational practice for beginners.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 1,
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
    ambientFrequency: 528, // Love frequency
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
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Evening Wind Down',
    description: 'Release the day\'s tensions and prepare for restful sleep.',
    languageCode: 'en',
    durationSeconds: 480, // 8 minutes
    level: 1,
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'Stress Relief',
    description: 'Quick relief from stress and anxiety. Perfect for busy days.',
    languageCode: 'en',
    durationSeconds: 420, // 7 minutes
    level: 1,
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    title: 'Mindful Walking',
    description: 'Bring awareness to each step. A moving meditation practice.',
    languageCode: 'en',
    durationSeconds: 600, // 10 minutes
    level: 2,
    ambientFrequency: 432,
    chimeFrequency: 528,
    createdAt: new Date().toISOString(),
  },
];
