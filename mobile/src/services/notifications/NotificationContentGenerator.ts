/**
 * ══════════════════════════════════════════════════════════════
 * Notification Content Generator
 * ══════════════════════════════════════════════════════════════
 *
 * Generates inspiring, varied notification content for meditation reminders.
 * Content is localized and rotates to keep reminders fresh and engaging.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationContent, NotificationContentCategory } from '../../types/notifications';
import { STORAGE_KEYS } from './constants';

/**
 * Content pools organized by language
 * Each pool contains varied, inspiring messages across different categories
 */
/**
 * Streak alert content pools organized by language
 * Urgent but motivating messages to protect the user's streak
 */
const STREAK_ALERT_POOLS: Record<string, NotificationContent[]> = {
  // ENGLISH
  en: [
    { title: '🔥 Protect your streak!', body: "You haven't meditated today. A few minutes is all it takes!", category: 'streak_protection' },
    { title: '⚡ Your streak is waiting', body: "Don't let today slip by. Your progress is worth protecting!", category: 'streak_protection' },
    { title: '🌟 Keep the momentum', body: 'You have built something beautiful. Take a moment to continue your journey', category: 'streak_protection' },
    { title: '💪 Almost there!', body: "Your meditation streak misses you. It's not too late to practice today!", category: 'streak_protection' },
    { title: '🏆 Don\'t break the chain', body: 'Every day counts. Your future self will thank you for staying consistent', category: 'streak_protection' },
  ],

  // POLISH
  pl: [
    { title: '🔥 Chroń swoją passę!', body: 'Nie medytowałeś dziś. Wystarczy kilka minut!', category: 'streak_protection' },
    { title: '⚡ Twoja passa czeka', body: 'Nie pozwól, by ten dzień Ci uciekł. Warto chronić postępy!', category: 'streak_protection' },
    { title: '🌟 Utrzymaj tempo', body: 'Zbudowałeś coś pięknego. Poświęć chwilę na kontynuację', category: 'streak_protection' },
    { title: '💪 Jeszcze zdążysz!', body: 'Twoja passa medytacyjna tęskni. Nie jest jeszcze za późno!', category: 'streak_protection' },
    { title: '🏆 Nie przerywaj łańcucha', body: 'Każdy dzień się liczy. Twoje przyszłe ja podziękuje za wytrwałość', category: 'streak_protection' },
  ],

  // GERMAN
  de: [
    { title: '🔥 Schütze deine Serie!', body: 'Du hast heute noch nicht meditiert. Ein paar Minuten reichen!', category: 'streak_protection' },
    { title: '⚡ Deine Serie wartet', body: 'Lass den Tag nicht verstreichen. Dein Fortschritt ist es wert!', category: 'streak_protection' },
    { title: '🌟 Behalte den Schwung', body: 'Du hast etwas Schönes aufgebaut. Nimm dir einen Moment Zeit', category: 'streak_protection' },
    { title: '💪 Du schaffst das!', body: 'Deine Meditationsserie vermisst dich. Es ist noch nicht zu spät!', category: 'streak_protection' },
  ],

  // SPANISH
  es: [
    { title: '🔥 ¡Protege tu racha!', body: 'No has meditado hoy. ¡Solo necesitas unos minutos!', category: 'streak_protection' },
    { title: '⚡ Tu racha te espera', body: 'No dejes que el día pase. ¡Tu progreso vale la pena proteger!', category: 'streak_protection' },
    { title: '🌟 Mantén el impulso', body: 'Has construido algo hermoso. Tómate un momento para continuar', category: 'streak_protection' },
    { title: '💪 ¡Casi lo logras!', body: 'Tu racha de meditación te extraña. ¡Aún no es tarde!', category: 'streak_protection' },
  ],

  // FRENCH
  fr: [
    { title: '🔥 Protège ta série !', body: "Tu n'as pas médité aujourd'hui. Quelques minutes suffisent !", category: 'streak_protection' },
    { title: '⚡ Ta série t\'attend', body: 'Ne laisse pas cette journée passer. Ton progrès vaut la peine !', category: 'streak_protection' },
    { title: '🌟 Garde l\'élan', body: 'Tu as construit quelque chose de beau. Prends un moment pour continuer', category: 'streak_protection' },
    { title: '💪 Tu y es presque !', body: 'Ta série de méditation te manque. Il n\'est pas trop tard !', category: 'streak_protection' },
  ],

  // HINDI
  hi: [
    { title: '🔥 अपनी लकीर बचाएं!', body: 'आज आपने ध्यान नहीं किया। बस कुछ मिनट काफी हैं!', category: 'streak_protection' },
    { title: '⚡ आपकी लकीर इंतज़ार कर रही है', body: 'आज का दिन न जाने दें। आपकी प्रगति महत्वपूर्ण है!', category: 'streak_protection' },
    { title: '🌟 गति बनाए रखें', body: 'आपने कुछ सुंदर बनाया है। एक पल रुकें और जारी रखें', category: 'streak_protection' },
    { title: '💪 अभी भी समय है!', body: 'आपकी ध्यान श्रृंखला आपको याद कर रही है। देर नहीं हुई!', category: 'streak_protection' },
  ],

  // CHINESE
  zh: [
    { title: '🔥 保护你的连续记录！', body: '你今天还没有冥想。只需几分钟！', category: 'streak_protection' },
    { title: '⚡ 你的连续记录在等待', body: '不要让今天溜走。你的进步值得保护！', category: 'streak_protection' },
    { title: '🌟 保持势头', body: '你已经建立了美好的习惯。花一点时间继续前进', category: 'streak_protection' },
    { title: '💪 还来得及！', body: '你的冥想连续记录想念你。现在开始还不晚！', category: 'streak_protection' },
  ],
};

const CONTENT_POOLS: Record<string, NotificationContent[]> = {
  // ══════════════════════════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════════════════════════
  en: [
    // Encouragement
    { title: '🧘 Time for calm', body: 'A few minutes of stillness can transform your entire day', category: 'encouragement' },
    { title: '✨ Your moment awaits', body: 'Step away from the noise. Your practice is calling', category: 'encouragement' },
    { title: '💜 You deserve this', body: 'Gift yourself a moment of peace today', category: 'encouragement' },
    { title: '🌟 Ready when you are', body: "Your meditation cushion is waiting. Let's find your center", category: 'encouragement' },

    // Mindfulness
    { title: '🌬️ Breathe', body: 'Right now is the perfect time to return to your breath', category: 'mindfulness' },
    { title: '🕊️ Present moment', body: 'This breath, this moment — nothing else matters', category: 'mindfulness' },
    { title: '🌸 Just be', body: 'No goals, no judgment. Just awareness', category: 'mindfulness' },
    { title: '🍃 Pause', body: 'Take a mindful pause. Your mind will thank you', category: 'mindfulness' },

    // Gratitude
    { title: '🌅 Morning stillness', body: 'Begin with gratitude. What are you thankful for today?', category: 'gratitude' },
    { title: '💫 A grateful heart', body: 'Meditation opens us to the abundance around us', category: 'gratitude' },

    // Calm
    { title: '🎯 Find your center', body: 'Amidst the chaos, there is stillness within you', category: 'calm' },
    { title: '🌊 Inner peace', body: 'Calm is not the absence of storms, but finding stillness within', category: 'calm' },
    { title: '☁️ Let go', body: 'Release what no longer serves you. Breathe and be free', category: 'calm' },

    // Reflection
    { title: '💭 Pause and reflect', body: 'What would it feel like to slow down, just for a moment?', category: 'reflection' },
    { title: '🌙 Quiet the mind', body: 'In silence, we discover what truly matters', category: 'reflection' },
  ],

  // ══════════════════════════════════════════════════════════════
  // POLISH
  // ══════════════════════════════════════════════════════════════
  pl: [
    // Zachęta
    { title: '🧘 Czas na spokój', body: 'Kilka minut ciszy może odmienić cały dzień', category: 'encouragement' },
    { title: '✨ Twoja chwila czeka', body: 'Oderwij się od hałasu. Twoja praktyka wzywa', category: 'encouragement' },
    { title: '💜 Zasługujesz na to', body: 'Podaruj sobie chwilę spokoju', category: 'encouragement' },
    { title: '🌟 Gotowy gdy zechcesz', body: 'Twoja poduszka do medytacji czeka. Znajdźmy Twój środek', category: 'encouragement' },

    // Uważność
    { title: '🌬️ Oddychaj', body: 'Właśnie teraz jest idealny moment, by wrócić do oddechu', category: 'mindfulness' },
    { title: '🕊️ Obecna chwila', body: 'Ten oddech, ta chwila — nic więcej się nie liczy', category: 'mindfulness' },
    { title: '🌸 Po prostu bądź', body: 'Bez celów, bez oceniania. Tylko świadomość', category: 'mindfulness' },
    { title: '🍃 Zatrzymaj się', body: 'Zrób uważną przerwę. Twój umysł ci podziękuje', category: 'mindfulness' },

    // Wdzięczność
    { title: '🌅 Poranna cisza', body: 'Zacznij od wdzięczności. Za co dziś jesteś wdzięczny?', category: 'gratitude' },
    { title: '💫 Wdzięczne serce', body: 'Medytacja otwiera nas na obfitość wokół nas', category: 'gratitude' },

    // Spokój
    { title: '🎯 Znajdź swój środek', body: 'Pośród chaosu jest w Tobie cisza', category: 'calm' },
    { title: '🌊 Wewnętrzny spokój', body: 'Spokój to nie brak burz, ale odnalezienie ciszy w sobie', category: 'calm' },
    { title: '☁️ Puść', body: 'Uwolnij to, co już Ci nie służy. Oddychaj i bądź wolny', category: 'calm' },

    // Refleksja
    { title: '💭 Zatrzymaj się i pomyśl', body: 'Jak by to było zwolnić, choć na chwilę?', category: 'reflection' },
    { title: '🌙 Ucisz umysł', body: 'W ciszy odkrywamy, co naprawdę jest ważne', category: 'reflection' },
  ],

  // ══════════════════════════════════════════════════════════════
  // GERMAN
  // ══════════════════════════════════════════════════════════════
  de: [
    { title: '🧘 Zeit für Ruhe', body: 'Ein paar Minuten Stille können deinen ganzen Tag verändern', category: 'encouragement' },
    { title: '✨ Dein Moment wartet', body: 'Entferne dich vom Lärm. Deine Praxis ruft', category: 'encouragement' },
    { title: '💜 Du verdienst das', body: 'Schenke dir heute einen Moment des Friedens', category: 'encouragement' },
    { title: '🌬️ Atme', body: 'Jetzt ist der perfekte Moment, um zu deinem Atem zurückzukehren', category: 'mindfulness' },
    { title: '🕊️ Gegenwärtiger Moment', body: 'Dieser Atemzug, dieser Moment — nichts anderes zählt', category: 'mindfulness' },
    { title: '🌸 Einfach sein', body: 'Keine Ziele, kein Urteilen. Nur Bewusstsein', category: 'mindfulness' },
    { title: '🎯 Finde deine Mitte', body: 'Inmitten des Chaos gibt es Stille in dir', category: 'calm' },
    { title: '🌊 Innerer Friede', body: 'Ruhe ist nicht die Abwesenheit von Stürmen, sondern Stille in sich zu finden', category: 'calm' },
  ],

  // ══════════════════════════════════════════════════════════════
  // SPANISH
  // ══════════════════════════════════════════════════════════════
  es: [
    { title: '🧘 Tiempo de calma', body: 'Unos minutos de quietud pueden transformar todo tu día', category: 'encouragement' },
    { title: '✨ Tu momento te espera', body: 'Aléjate del ruido. Tu práctica te llama', category: 'encouragement' },
    { title: '💜 Te lo mereces', body: 'Regálate un momento de paz hoy', category: 'encouragement' },
    { title: '🌬️ Respira', body: 'Ahora mismo es el momento perfecto para volver a tu respiración', category: 'mindfulness' },
    { title: '🕊️ Momento presente', body: 'Esta respiración, este momento — nada más importa', category: 'mindfulness' },
    { title: '🌸 Solo ser', body: 'Sin metas, sin juicios. Solo conciencia', category: 'mindfulness' },
    { title: '🎯 Encuentra tu centro', body: 'En medio del caos, hay quietud dentro de ti', category: 'calm' },
    { title: '🌊 Paz interior', body: 'La calma no es la ausencia de tormentas, sino encontrar quietud interior', category: 'calm' },
  ],

  // ══════════════════════════════════════════════════════════════
  // FRENCH
  // ══════════════════════════════════════════════════════════════
  fr: [
    { title: '🧘 Temps de calme', body: 'Quelques minutes de silence peuvent transformer ta journée', category: 'encouragement' },
    { title: '✨ Ton moment t\'attend', body: 'Éloigne-toi du bruit. Ta pratique t\'appelle', category: 'encouragement' },
    { title: '💜 Tu le mérites', body: 'Offre-toi un moment de paix aujourd\'hui', category: 'encouragement' },
    { title: '🌬️ Respire', body: 'C\'est le moment parfait pour revenir à ton souffle', category: 'mindfulness' },
    { title: '🕊️ Moment présent', body: 'Ce souffle, ce moment — rien d\'autre ne compte', category: 'mindfulness' },
    { title: '🌸 Juste être', body: 'Pas d\'objectifs, pas de jugement. Juste la conscience', category: 'mindfulness' },
    { title: '🎯 Trouve ton centre', body: 'Au milieu du chaos, il y a le calme en toi', category: 'calm' },
    { title: '🌊 Paix intérieure', body: 'Le calme n\'est pas l\'absence de tempêtes, mais trouver la sérénité en soi', category: 'calm' },
  ],

  // ══════════════════════════════════════════════════════════════
  // HINDI
  // ══════════════════════════════════════════════════════════════
  hi: [
    { title: '🧘 शांति का समय', body: 'कुछ मिनटों की शांति आपके पूरे दिन को बदल सकती है', category: 'encouragement' },
    { title: '✨ आपका पल इंतज़ार कर रहा है', body: 'शोर से दूर हो जाएं। आपकी साधना बुला रही है', category: 'encouragement' },
    { title: '💜 आप इसके लायक हैं', body: 'आज खुद को शांति का उपहार दें', category: 'encouragement' },
    { title: '🌬️ सांस लें', body: 'अभी अपनी सांस पर लौटने का सही समय है', category: 'mindfulness' },
    { title: '🕊️ वर्तमान क्षण', body: 'यह सांस, यह पल — और कुछ मायने नहीं रखता', category: 'mindfulness' },
    { title: '🎯 अपना केंद्र खोजें', body: 'अराजकता के बीच, आपके भीतर शांति है', category: 'calm' },
    { title: '🌊 आंतरिक शांति', body: 'शांति तूफान की अनुपस्थिति नहीं, बल्कि भीतर स्थिरता पाना है', category: 'calm' },
  ],

  // ══════════════════════════════════════════════════════════════
  // CHINESE (Simplified)
  // ══════════════════════════════════════════════════════════════
  zh: [
    { title: '🧘 平静时刻', body: '几分钟的宁静可以改变你的一整天', category: 'encouragement' },
    { title: '✨ 你的时刻在等待', body: '远离喧嚣，你的修行在召唤', category: 'encouragement' },
    { title: '💜 你值得拥有', body: '今天给自己一个平静的时刻', category: 'encouragement' },
    { title: '🌬️ 呼吸', body: '现在正是回归呼吸的完美时刻', category: 'mindfulness' },
    { title: '🕊️ 当下', body: '这一呼吸，这一刻——其他都不重要', category: 'mindfulness' },
    { title: '🌸 只是存在', body: '没有目标，没有评判。只有觉知', category: 'mindfulness' },
    { title: '🎯 找到你的中心', body: '在混乱中，你内心有一片宁静', category: 'calm' },
    { title: '🌊 内心平静', body: '平静不是没有风暴，而是在内心找到宁静', category: 'calm' },
  ],
};

/**
 * Generates inspiring, varied notification content
 * Content is localized and rotates to keep reminders fresh
 */
export class NotificationContentGenerator {
  private lastUsedIndex: Record<string, number> = {};

  /**
   * Load the last used content index from storage
   */
  async loadContentIndex(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONTENT_INDEX);
      if (stored) {
        this.lastUsedIndex = JSON.parse(stored);
      }
    } catch {
      // Ignore errors, start fresh
    }
  }

  /**
   * Save the current content index to storage
   */
  private async saveContentIndex(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONTENT_INDEX,
        JSON.stringify(this.lastUsedIndex)
      );
    } catch {
      // Ignore errors
    }
  }

  /**
   * Generate daily notification content
   * Rotates through content pool for variety
   */
  async generateDaily(language: string): Promise<NotificationContent> {
    // Load index if not loaded
    if (Object.keys(this.lastUsedIndex).length === 0) {
      await this.loadContentIndex();
    }

    // Get language code (e.g., 'en' from 'en-US')
    const langCode = language.split('-')[0].toLowerCase();

    // Fallback to English if language not supported
    const pool = CONTENT_POOLS[langCode] || CONTENT_POOLS['en'];

    // Get next content (rotate through pool)
    const lastIndex = this.lastUsedIndex[langCode] ?? -1;
    const nextIndex = (lastIndex + 1) % pool.length;
    this.lastUsedIndex[langCode] = nextIndex;

    // Save index for next time
    await this.saveContentIndex();

    return pool[nextIndex];
  }

  /**
   * Generate content for specific category
   */
  generateByCategory(
    language: string,
    category: NotificationContentCategory
  ): NotificationContent {
    const langCode = language.split('-')[0].toLowerCase();
    const pool = CONTENT_POOLS[langCode] || CONTENT_POOLS['en'];
    const categoryPool = pool.filter((c) => c.category === category);

    if (categoryPool.length === 0) {
      // Fallback to any content
      return pool[Math.floor(Math.random() * pool.length)];
    }

    return categoryPool[Math.floor(Math.random() * categoryPool.length)];
  }

  /**
   * Get a random content item for testing
   */
  getRandomContent(language: string): NotificationContent {
    const langCode = language.split('-')[0].toLowerCase();
    const pool = CONTENT_POOLS[langCode] || CONTENT_POOLS['en'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Generate streak alert notification content
   * Rotates through streak protection pool for variety
   */
  async generateStreakAlert(language: string): Promise<NotificationContent> {
    // Load index if not loaded
    if (Object.keys(this.lastUsedIndex).length === 0) {
      await this.loadContentIndex();
    }

    // Get language code (e.g., 'en' from 'en-US')
    const langCode = language.split('-')[0].toLowerCase();

    // Fallback to English if language not supported
    const pool = STREAK_ALERT_POOLS[langCode] || STREAK_ALERT_POOLS['en'];

    // Get next content (rotate through pool with separate index)
    const indexKey = `streak_${langCode}`;
    const lastIndex = this.lastUsedIndex[indexKey] ?? -1;
    const nextIndex = (lastIndex + 1) % pool.length;
    this.lastUsedIndex[indexKey] = nextIndex;

    // Save index for next time
    await this.saveContentIndex();

    return pool[nextIndex];
  }

  /**
   * Get a random streak alert content for testing
   */
  getRandomStreakAlertContent(language: string): NotificationContent {
    const langCode = language.split('-')[0].toLowerCase();
    const pool = STREAK_ALERT_POOLS[langCode] || STREAK_ALERT_POOLS['en'];
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

// Export singleton instance
export const notificationContentGenerator = new NotificationContentGenerator();
