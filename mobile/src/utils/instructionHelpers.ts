import { logger } from './logger';
// ══════════════════════════════════════════════════════════════
// Instruction Helpers - Validation & Fallback System
// ══════════════════════════════════════════════════════════════

import { PRE_SESSION_INSTRUCTIONS } from '../data/instructions';
import type { PreSessionInstruction, TechniqueType } from '../types/instructions';
import type { MeditationSession } from '../services/api';

/**
 * Get instruction by ID with validation
 * @param instructionId - The instruction ID to look up
 * @returns PreSessionInstruction or null if not found
 */
export const getInstructionById = (
  instructionId?: string
): PreSessionInstruction | null => {
  if (!instructionId) {
    logger.warn('⚠️ No instructionId provided');
    return null;
  }

  const instruction = PRE_SESSION_INSTRUCTIONS[instructionId];

  if (!instruction) {
    logger.warn(`⚠️ Missing instruction: ${instructionId}`);
    return null;
  }

  return instruction;
};

/**
 * Get instruction with intelligent fallback
 * @param instructionId - Preferred instruction ID
 * @param sessionLevel - Session difficulty level (1-5)
 * @param technique - Optional technique type for better matching
 * @returns PreSessionInstruction (never null)
 */
export const getInstructionWithFallback = (
  instructionId?: string,
  sessionLevel: number = 1,
  _technique?: TechniqueType
): PreSessionInstruction => {
  // Try to get the specified instruction
  const instruction = getInstructionById(instructionId);
  if (instruction) return instruction;

  // Fallback logic based on level
  const levelFallbacks: Record<number, string[]> = {
    1: ['level1_breath', 'morning_energy'],
    2: ['level2_breath_counting', 'level1_breath'],
    3: ['level3_mindfulness', 'level3_loving_kindness'],
    4: ['level4_open_awareness', 'level4_vipassana_scan'],
    5: ['level5_vipassana', 'level4_open_awareness'],
  };

  // Try level-appropriate fallbacks
  const fallbacks = levelFallbacks[sessionLevel] ?? levelFallbacks[1] ?? [];
  for (const fallbackId of fallbacks) {
    const fallbackInstruction = PRE_SESSION_INSTRUCTIONS[fallbackId];
    if (fallbackInstruction) {
      logger.log(`Using fallback instruction: ${fallbackId} for level ${sessionLevel}`);
      return fallbackInstruction;
    }
  }

  // Ultimate fallback - always exists
  const ultimateFallback = PRE_SESSION_INSTRUCTIONS['level1_breath'];
  if (!ultimateFallback) {
    throw new Error('No fallback instruction found for level1_breath');
  }
  return ultimateFallback;
};

/**
 * Get instruction for a session with smart matching
 * @param session - The meditation session
 * @returns PreSessionInstruction
 */
export const getInstructionForSession = (
  session: MeditationSession
): PreSessionInstruction => {
  return getInstructionWithFallback(
    session.instructionId,
    session.level
  );
};

/**
 * Validate all sessions have valid instructions
 * @param sessions - Array of meditation sessions
 * @returns Validation report
 */
export const validateSessionInstructions = (
  sessions: MeditationSession[]
): {
  valid: number;
  invalid: number;
  missing: number;
  issues: Array<{ sessionId: string | number; sessionTitle: string; issue: string }>;
} => {
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  const issues: Array<{ sessionId: string | number; sessionTitle: string; issue: string }> = [];

  sessions.forEach((session) => {
    if (!session.instructionId) {
      missing++;
      issues.push({
        sessionId: session.id,
        sessionTitle: session.title,
        issue: 'No instructionId specified',
      });
    } else if (!PRE_SESSION_INSTRUCTIONS[session.instructionId]) {
      invalid++;
      issues.push({
        sessionId: session.id,
        sessionTitle: session.title,
        issue: `Invalid instructionId: ${session.instructionId}`,
      });
    } else {
      valid++;
    }
  });

  return { valid, invalid, missing, issues };
};

/**
 * Get all available instruction IDs
 * @returns Array of instruction IDs
 */
export const getAvailableInstructionIds = (): string[] => {
  return Object.keys(PRE_SESSION_INSTRUCTIONS);
};

/**
 * Check if an instruction ID exists
 * @param instructionId - The instruction ID to check
 * @returns boolean
 */
export const instructionExists = (instructionId: string): boolean => {
  return instructionId in PRE_SESSION_INSTRUCTIONS;
};
