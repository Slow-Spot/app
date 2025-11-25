/**
 * Calendar Service
 * Handles calendar permissions and meditation event scheduling
 */

import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

const CALENDAR_NAME = 'Slow Spot Meditation';
const REMINDER_SETTINGS_KEY = '@slow_spot_reminder_settings';
const CALENDAR_ID_KEY = '@slow_spot_calendar_id';

export interface ReminderSettings {
  enabled: boolean;
  time: string; // Format: "HH:mm" (24-hour)
  eventId?: string;
  calendarId?: string;
}

export interface MeditationEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  alarms?: Calendar.Alarm[];
}

/**
 * Request calendar permissions from the user
 */
export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Calendar.getCalendarPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    logger.error('Error requesting calendar permissions:', error);
    return false;
  }
};

/**
 * Check if calendar permissions are granted
 */
export const checkCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    logger.error('Error checking calendar permissions:', error);
    return false;
  }
};

/**
 * Get or create the Slow Spot Meditation calendar
 */
export const getOrCreateCalendar = async (): Promise<string | null> => {
  try {
    const hasPermission = await checkCalendarPermissions();
    if (!hasPermission) {
      logger.error('Calendar permissions not granted');
      return null;
    }

    // Check if we have a stored calendar ID
  const storedCalendarId = await AsyncStorage.getItem(CALENDAR_ID_KEY);
  if (storedCalendarId) {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const found = calendars.find((cal) => cal.id === storedCalendarId);
      if (found) return storedCalendarId;
    } catch (error) {
      // Calendar might have been deleted, continue to create new one
      logger.log('Stored calendar not found, creating new one');
    }
  }

    // Get all calendars
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

    // Look for existing Slow Spot calendar
    const existingCalendar = calendars.find(cal => cal.title === CALENDAR_NAME);

    if (existingCalendar) {
      await AsyncStorage.setItem(CALENDAR_ID_KEY, existingCalendar.id);
      return existingCalendar.id;
    }

    // Create new calendar
    let defaultCalendarSource;

    if (Platform.OS === 'ios') {
      const defaultCalendar = calendars.find(
        cal => cal.allowsModifications && cal.source.name === 'Default'
      );
      defaultCalendarSource = defaultCalendar?.source || calendars[0]?.source;
    } else if (Platform.OS === 'android') {
      const localSource = calendars.find(
        cal => cal.source.name === 'Local' || cal.source.type === 'local'
      );
      defaultCalendarSource = localSource?.source || calendars[0]?.source;
    }

    if (!defaultCalendarSource) {
      logger.error('No suitable calendar source found');
      return null;
    }

    const calendarId = await Calendar.createCalendarAsync({
      title: CALENDAR_NAME,
      color: '#4FA8FF', // App theme color
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: CALENDAR_NAME,
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    await AsyncStorage.setItem(CALENDAR_ID_KEY, calendarId);
    return calendarId;
  } catch (error) {
    logger.error('Error creating/getting calendar:', error);
    return null;
  }
};

/**
 * Create a single meditation event
 */
export const createMeditationEvent = async (
  event: MeditationEvent
): Promise<string | null> => {
  try {
    const hasPermission = await checkCalendarPermissions();
    if (!hasPermission) {
      return null;
    }

    const calendarId = await getOrCreateCalendar();
    if (!calendarId) {
      return null;
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      notes: event.notes,
      alarms: event.alarms || [
        { relativeOffset: -5, method: Calendar.AlarmMethod.ALERT },
      ],
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return eventId;
  } catch (error) {
    logger.error('Error creating meditation event:', error);
    return null;
  }
};

/**
 * Create a recurring daily reminder at a specific time
 */
export const createRecurringReminder = async (
  time: string // Format: "HH:mm"
): Promise<ReminderSettings | null> => {
  try {
    const hasPermission = await checkCalendarPermissions();
    if (!hasPermission) {
      return null;
    }

    const calendarId = await getOrCreateCalendar();
    if (!calendarId) {
      return null;
    }

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);

    // Create event for tomorrow (recurring events start from a specific date)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30); // 30-minute duration

    // Create recurring event (for iOS, use recurrence rule)
    const recurrenceRule: Calendar.RecurrenceRule = {
      frequency: Calendar.Frequency.DAILY,
      interval: 1,
    };

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: 'Daily Meditation Time',
      startDate,
      endDate,
      notes: 'Time for your daily meditation session with Slow Spot',
      alarms: [
        { relativeOffset: 0, method: Calendar.AlarmMethod.ALERT },
      ],
      recurrenceRule,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const settings: ReminderSettings = {
      enabled: true,
      time,
      eventId,
      calendarId,
    };

    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    logger.error('Error creating recurring reminder:', error);
    return null;
  }
};

/**
 * Delete a meditation event
 */
export const deleteMeditationEvent = async (eventId: string): Promise<boolean> => {
  try {
    const hasPermission = await checkCalendarPermissions();
    if (!hasPermission) {
      return false;
    }

    await Calendar.deleteEventAsync(eventId);
    return true;
  } catch (error) {
    logger.error('Error deleting meditation event:', error);
    return false;
  }
};

/**
 * Cancel the current recurring reminder
 */
export const cancelRecurringReminder = async (): Promise<boolean> => {
  try {
    const settings = await getReminderSettings();

    if (settings && settings.eventId) {
      const deleted = await deleteMeditationEvent(settings.eventId);

      if (deleted) {
        await AsyncStorage.removeItem(REMINDER_SETTINGS_KEY);
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Error canceling recurring reminder:', error);
    return false;
  }
};

/**
 * Get current reminder settings
 */
export const getReminderSettings = async (): Promise<ReminderSettings | null> => {
  try {
    const settingsJson = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);

    if (!settingsJson) {
      return null;
    }

    return JSON.parse(settingsJson);
  } catch (error) {
    logger.error('Error getting reminder settings:', error);
    return null;
  }
};

/**
 * Get upcoming meditation events from calendar
 */
export const getUpcomingMeditations = async (
  daysAhead: number = 7
): Promise<Calendar.Event[]> => {
  try {
    const hasPermission = await checkCalendarPermissions();
    if (!hasPermission) {
      return [];
    }

    const calendarId = await getOrCreateCalendar();
    if (!calendarId) {
      return [];
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    const events = await Calendar.getEventsAsync(
      [calendarId],
      startDate,
      endDate
    );

    return events;
  } catch (error) {
    logger.error('Error getting upcoming meditations:', error);
    return [];
  }
};

/**
 * Update recurring reminder time
 */
export const updateRecurringReminder = async (
  newTime: string
): Promise<ReminderSettings | null> => {
  try {
    // Cancel existing reminder
    await cancelRecurringReminder();

    // Create new reminder with new time
    return await createRecurringReminder(newTime);
  } catch (error) {
    logger.error('Error updating recurring reminder:', error);
    return null;
  }
};
