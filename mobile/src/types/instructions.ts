// ══════════════════════════════════════════════════════════════
// Pre-Session Instructions System
// Better than Headspace - Context-aware, Interactive, Personalized
// ══════════════════════════════════════════════════════════════

export interface PreSessionInstruction {
  id: string;
  sessionLevel: number; // 1-5
  technique: TechniqueType;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';

  // Main instruction content
  title: string;
  subtitle: string;

  // Physical preparation
  physicalSetup: PhysicalSetupStep[];

  // Mental preparation
  mentalPreparation: {
    intention: string;
    focusPoint: string;
    commonChallenges: string[];
  };

  // Session-specific tips
  sessionTips: string[];

  // Quick breathing prep (optional mini-exercise before main session)
  breathingPrep?: {
    duration: number; // seconds
    pattern: 'box' | '4-7-8' | 'equal' | 'calm';
    instruction: string;
  };

  // Reminders (shown during session)
  duringSessionReminders: {
    time: number; // seconds from start
    message: string;
    type: 'gentle' | 'encouragement' | 'technique';
  }[];
}

export type TechniqueType =
  | 'breath_awareness'
  | 'body_scan'
  | 'loving_kindness'
  | 'open_awareness'
  | 'visualization'
  | 'mantra'
  | 'walking'
  | 'zen'
  | 'vipassana';

export interface PhysicalSetupStep {
  order: number;
  icon: string;
  title: string;
  description: string;
  isOptional: boolean;
  visualGuide?: string; // URL to illustration
}

export interface PreSessionChecklist {
  items: ChecklistItem[];
  completedCount: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
}

// ══════════════════════════════════════════════════════════════
// Pre-Session State
// ══════════════════════════════════════════════════════════════

export interface PreSessionState {
  instruction: PreSessionInstruction;
  checklist: PreSessionChecklist;
  breathingPrepCompleted: boolean;
  userIntention: string;
  estimatedStartTime: Date;
}
