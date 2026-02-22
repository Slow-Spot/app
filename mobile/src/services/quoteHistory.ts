/**
 * Quote History Service
 * Tracks shown quotes to prevent repetition
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'shown_quotes';

export interface QuoteHistory {
  [languageCode: string]: number[]; // Map of language -> array of shown quote IDs
}

/**
 * Zod schema dla walidacji QuoteHistory z AsyncStorage
 */
const QuoteHistorySchema = z.record(z.string(), z.array(z.number()));

/**
 * Get the history of shown quotes for a specific language
 */
export const getShownQuotes = async (languageCode: string): Promise<number[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];

    const parsed = QuoteHistorySchema.safeParse(JSON.parse(historyJson));
    if (!parsed.success) {
      logger.warn('Invalid quote history data in storage, returning empty array');
      return [];
    }
    return parsed.data[languageCode] || [];
  } catch (error) {
    logger.error('Error reading quote history:', error);
    return [];
  }
};

/**
 * Mark a quote as shown for a specific language
 */
export const markQuoteAsShown = async (
  languageCode: string,
  quoteId: number
): Promise<void> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    let history: QuoteHistory = {};
    if (historyJson) {
      const parsed = QuoteHistorySchema.safeParse(JSON.parse(historyJson));
      if (!parsed.success) {
        logger.warn('Invalid quote history data in storage, resetting');
      } else {
        history = parsed.data;
      }
    }

    if (!history[languageCode]) {
      history[languageCode] = [];
    }

    // Add quote ID if not already in history
    if (!history[languageCode].includes(quoteId)) {
      history[languageCode].push(quoteId);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    logger.error('Error saving quote history:', error);
  }
};

/**
 * Reset quote history for a specific language (when all quotes have been shown)
 */
export const resetQuoteHistory = async (languageCode: string): Promise<void> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!historyJson) return;

    const parsed = QuoteHistorySchema.safeParse(JSON.parse(historyJson));
    if (!parsed.success) {
      logger.warn('Invalid quote history data in storage, clearing');
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }
    const history = parsed.data;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete history[languageCode];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    logger.error('Error resetting quote history:', error);
  }
};

/**
 * Clear all quote history (all languages)
 */
export const clearAllQuoteHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logger.error('Error clearing quote history:', error);
  }
};

/**
 * Get a non-repeating random quote from a list
 * Automatically resets history if all quotes have been shown
 */
export const getUniqueRandomQuote = async <T extends { id: number }>(
  quotes: T[],
  languageCode: string
): Promise<T> => {
  if (quotes.length === 0) {
    throw new Error('No quotes available');
  }

  // Get shown quotes for this language
  const shownQuotes = await getShownQuotes(languageCode);

  // Filter out already shown quotes
  const unseenQuotes = quotes.filter((q) => !shownQuotes.includes(q.id));

  // If all quotes have been shown, reset and show all quotes again
  if (unseenQuotes.length === 0) {
    await resetQuoteHistory(languageCode);
    const randomQuoteFromAll = quotes[Math.floor(Math.random() * quotes.length)];
    if (!randomQuoteFromAll) {
      throw new Error('No quotes available after reset');
    }
    return randomQuoteFromAll;
  }

  // Pick a random unseen quote
  const randomQuote = unseenQuotes[Math.floor(Math.random() * unseenQuotes.length)];
  if (!randomQuote) {
    throw new Error('No unseen quotes available');
  }

  // Mark as shown
  await markQuoteAsShown(languageCode, randomQuote.id);

  return randomQuote;
};
