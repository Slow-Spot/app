export interface SessionConfiguration {
  id: string;
  name: string;
  durationMinutes: number;
  ambientSound?: string;
  intervalBellMinutes?: number;
  voiceGuidanceEnabled?: boolean;
  wakeUpChimeEnabled?: boolean;
  usageCount?: number;
  lastUsedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
