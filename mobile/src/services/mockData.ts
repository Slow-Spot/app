import { Quote, MeditationSession } from './api';

export const MOCK_QUOTES: Quote[] = [
  // BUDDHIST WISDOM - Buddha
  {
    id: 1,
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Inner Peace',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    text: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    text: 'Meditation brings wisdom; lack of meditation leaves ignorance.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Self-Compassion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    text: 'The root of suffering is attachment.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    text: 'Nothing can harm you as much as your own thoughts unguarded.',
    author: 'Buddha',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },

  // THÍCH NHẤT HẠNH
  {
    id: 10,
    text: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    text: 'Meditation is not evasion; it is a serene encounter with reality.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    text: 'Breathing in, I calm body and mind. Breathing out, I smile.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 13,
    text: 'Walk as if you are kissing the Earth with your feet.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 14,
    text: 'The miracle is not to walk on water. The miracle is to walk on the green earth in the present moment.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Presence',
    createdAt: new Date().toISOString(),
  },

  // DALAI LAMA
  {
    id: 20,
    text: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 21,
    text: 'If you want others to be happy, practice compassion. If you want to be happy, practice compassion.',
    author: 'Dalai Lama',
    languageCode: 'en',
    category: 'Compassion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 22,
    text: 'The purpose of our lives is to be happy.',
    author: 'Dalai Lama',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 23,
    text: 'Sleep is the best meditation.',
    author: 'Dalai Lama',
    languageCode: 'en',
    category: 'Rest',
    createdAt: new Date().toISOString(),
  },

  // JON KABAT-ZINN
  {
    id: 30,
    text: 'The goal of meditation is not to get rid of thoughts or emotions. The goal is to become more aware of your thoughts and emotions.',
    author: 'Jon Kabat-Zinn',
    languageCode: 'en',
    category: 'Awareness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 31,
    text: 'Mindfulness is about being fully awake in our lives.',
    author: 'Jon Kabat-Zinn',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 32,
    text: 'You can\'t stop the waves, but you can learn to surf.',
    author: 'Jon Kabat-Zinn',
    languageCode: 'en',
    category: 'Acceptance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 33,
    text: 'The little things? The little moments? They aren\'t little.',
    author: 'Jon Kabat-Zinn',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },

  // ECKHART TOLLE
  {
    id: 40,
    text: 'Wherever you are, be there totally.',
    author: 'Eckhart Tolle',
    languageCode: 'en',
    category: 'Presence',
    createdAt: new Date().toISOString(),
  },
  {
    id: 41,
    text: 'Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.',
    author: 'Eckhart Tolle',
    languageCode: 'en',
    category: 'Presence',
    createdAt: new Date().toISOString(),
  },
  {
    id: 42,
    text: 'The power for creating a better future is contained in the present moment.',
    author: 'Eckhart Tolle',
    languageCode: 'en',
    category: 'Presence',
    createdAt: new Date().toISOString(),
  },
  {
    id: 43,
    text: 'Stillness is the language God speaks, and everything else is a bad translation.',
    author: 'Eckhart Tolle',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },

  // RUMI (Sufi)
  {
    id: 50,
    text: 'The quieter you become, the more you can hear.',
    author: 'Rumi',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 51,
    text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    author: 'Rumi',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 52,
    text: 'Let silence be the art you practice.',
    author: 'Rumi',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 53,
    text: 'The wound is the place where the Light enters you.',
    author: 'Rumi',
    languageCode: 'en',
    category: 'Healing',
    createdAt: new Date().toISOString(),
  },

  // LAO TZU (Taoist)
  {
    id: 60,
    text: 'Nature does not hurry, yet everything is accomplished.',
    author: 'Lao Tzu',
    languageCode: 'en',
    category: 'Patience',
    createdAt: new Date().toISOString(),
  },
  {
    id: 61,
    text: 'Silence is a source of great strength.',
    author: 'Lao Tzu',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 62,
    text: 'When I let go of what I am, I become what I might be.',
    author: 'Lao Tzu',
    languageCode: 'en',
    category: 'Acceptance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 63,
    text: 'Knowing others is intelligence; knowing yourself is true wisdom.',
    author: 'Lao Tzu',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 64,
    text: 'Do you have the patience to wait till your mud settles and the water is clear?',
    author: 'Lao Tzu',
    languageCode: 'en',
    category: 'Patience',
    createdAt: new Date().toISOString(),
  },

  // ALAN WATTS
  {
    id: 70,
    text: 'The only way to make sense out of change is to plunge into it, move with it, and join the dance.',
    author: 'Alan Watts',
    languageCode: 'en',
    category: 'Acceptance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 71,
    text: 'You are the universe experiencing itself.',
    author: 'Alan Watts',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 72,
    text: 'The meaning of life is just to be alive. It is so plain and so obvious and so simple.',
    author: 'Alan Watts',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 73,
    text: 'Muddy water is best cleared by leaving it alone.',
    author: 'Alan Watts',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },

  // JACK KORNFIELD
  {
    id: 80,
    text: 'In the end, just three things matter: How well we have lived. How well we have loved. How well we have learned to let go.',
    author: 'Jack Kornfield',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 81,
    text: 'The trouble is, you think you have time.',
    author: 'Jack Kornfield',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 82,
    text: 'Meditation is not about getting anywhere else. It is about being where you are and knowing it.',
    author: 'Jack Kornfield',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },

  // SHARON SALZBERG
  {
    id: 90,
    text: 'Meditation is the ultimate mobile device; you can use it anywhere, anytime, unobtrusively.',
    author: 'Sharon Salzberg',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 91,
    text: 'You don\'t have to be good at meditating. You just have to do it.',
    author: 'Sharon Salzberg',
    languageCode: 'en',
    category: 'Encouragement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 92,
    text: 'Mindfulness isn\'t difficult, we just need to remember to do it.',
    author: 'Sharon Salzberg',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },

  // PEMA CHÖDRÖN
  {
    id: 100,
    text: 'The most fundamental aggression to ourselves is remaining ignorant by not having the courage to look at ourselves honestly and gently.',
    author: 'Pema Chödrön',
    languageCode: 'en',
    category: 'Self-Awareness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 101,
    text: 'Compassion is not a relationship between the healer and the wounded. It\'s a relationship between equals.',
    author: 'Pema Chödrön',
    languageCode: 'en',
    category: 'Compassion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 102,
    text: 'Meditation practice isn\'t about trying to throw ourselves away and become something better. It\'s about befriending who we are.',
    author: 'Pema Chödrön',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },

  // MARCUS AURELIUS (Stoic)
  {
    id: 110,
    text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 111,
    text: 'Confine yourself to the present.',
    author: 'Marcus Aurelius',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 112,
    text: 'When you arise in the morning, think of what a precious privilege it is to be alive - to breathe, to think, to enjoy, to love.',
    author: 'Marcus Aurelius',
    languageCode: 'en',
    category: 'Gratitude',
    createdAt: new Date().toISOString(),
  },

  // DOGEN (Zen)
  {
    id: 120,
    text: 'To study the self is to forget the self. To forget the self is to be enlightened by all things.',
    author: 'Dogen',
    languageCode: 'en',
    category: 'Zen',
    createdAt: new Date().toISOString(),
  },
  {
    id: 121,
    text: 'Sitting peacefully doing nothing, spring comes and the grass grows by itself.',
    author: 'Dogen',
    languageCode: 'en',
    category: 'Zen',
    createdAt: new Date().toISOString(),
  },

  // SHUNRYU SUZUKI (Zen)
  {
    id: 130,
    text: 'In the beginner\'s mind there are many possibilities, but in the expert\'s there are few.',
    author: 'Shunryu Suzuki',
    languageCode: 'en',
    category: 'Zen',
    createdAt: new Date().toISOString(),
  },
  {
    id: 131,
    text: 'The most important point is to accept yourself and stand on your two feet.',
    author: 'Shunryu Suzuki',
    languageCode: 'en',
    category: 'Self-Acceptance',
    createdAt: new Date().toISOString(),
  },

  // PARAMAHANSA YOGANANDA (Vedic)
  {
    id: 140,
    text: 'The season of failure is the best time for sowing the seeds of success.',
    author: 'Paramahansa Yogananda',
    languageCode: 'en',
    category: 'Wisdom',
    createdAt: new Date().toISOString(),
  },
  {
    id: 141,
    text: 'Calmness is the ideal state in which we should receive all life\'s experiences.',
    author: 'Paramahansa Yogananda',
    languageCode: 'en',
    category: 'Calmness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 142,
    text: 'The happiness of one\'s own heart alone cannot satisfy the soul; one must try to include, as necessary to one\'s own happiness, the happiness of others.',
    author: 'Paramahansa Yogananda',
    languageCode: 'en',
    category: 'Compassion',
    createdAt: new Date().toISOString(),
  },

  // KRISHNAMURTI
  {
    id: 150,
    text: 'The ability to observe without evaluating is the highest form of intelligence.',
    author: 'Jiddu Krishnamurti',
    languageCode: 'en',
    category: 'Awareness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 151,
    text: 'Meditation is the ending of thought. It is only then that there is a different dimension which is beyond time.',
    author: 'Jiddu Krishnamurti',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 152,
    text: 'The moment you have in your heart this extraordinary thing called love and feel the depth, the delight, the ecstasy of it, you will discover that for you the world is transformed.',
    author: 'Jiddu Krishnamurti',
    languageCode: 'en',
    category: 'Love',
    createdAt: new Date().toISOString(),
  },

  // VARIOUS WISDOM TRADITIONS
  {
    id: 160,
    text: 'Meditation is a way for nourishing and blossoming the divinity within you.',
    author: 'Amit Ray',
    languageCode: 'en',
    category: 'Growth',
    createdAt: new Date().toISOString(),
  },
  {
    id: 161,
    text: 'Quiet the mind and the soul will speak.',
    author: 'Ma Jaya Sati Bhagavati',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 162,
    text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
    author: 'Thích Nhất Hạnh',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 163,
    text: 'Your calm mind is the ultimate weapon against your challenges.',
    author: 'Bryant McGill',
    languageCode: 'en',
    category: 'Calmness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 164,
    text: 'The thing about meditation is: You become more and more you.',
    author: 'David Lynch',
    languageCode: 'en',
    category: 'Self-Discovery',
    createdAt: new Date().toISOString(),
  },
  {
    id: 165,
    text: 'Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings.',
    author: 'Arianna Huffington',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 166,
    text: 'Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.',
    author: 'Hermann Hesse',
    languageCode: 'en',
    category: 'Stillness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 167,
    text: 'Meditation is the tongue of the soul and the language of our spirit.',
    author: 'Jeremy Taylor',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 168,
    text: 'In meditation, we discover our inherent restlessness. Sometimes we get up and leave. Sometimes we sit there but our bodies wiggle and squirm and our minds go far away.',
    author: 'Pema Chödrön',
    languageCode: 'en',
    category: 'Practice',
    createdAt: new Date().toISOString(),
  },
  {
    id: 169,
    text: 'Be here now. Be someplace else later. Is that so complicated?',
    author: 'David M. Bader',
    languageCode: 'en',
    category: 'Mindfulness',
    createdAt: new Date().toISOString(),
  },
  {
    id: 170,
    text: 'Meditation is all about the pursuit of nothingness. It\'s like the ultimate rest.',
    author: 'Hugh Jackman',
    languageCode: 'en',
    category: 'Rest',
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
