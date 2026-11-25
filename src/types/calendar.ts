/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleCalendarDateTime {
  dateTime: string; // ISO 8601 with offset, e.g. "2026-11-10T09:00:00-07:00"
  timeZone: string; // e.g. "America/Los_Angeles"
}

export interface GoogleCalendarReminderOverride {
  method: 'popup' | 'email';
  minutes: number;
}

export interface GoogleCalendarReminders {
  useDefault: boolean;
  overrides?: GoogleCalendarReminderOverride[];
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  recurrence?: string[];
  colorId: '11' | '2' | '5' | string;
  reminders: GoogleCalendarReminders;
  location?: string;
}

export type RiskFactorKey =
  | 'sedentary'
  | 'smoking'
  | 'vaping'
  | 'alcohol'
  | 'ultraprocessed';

export interface PreventiveMatrixRow {
  id: string;
  title: string;
  emoji: string;
  categoryTag: string;
  sex: 'Femenino' | 'Masculino' | 'Ambos';
  minAge: number;
  maxAge: number;
  factors: Array<RiskFactorKey | 'none' | 'age'>;
  routineByAgeSex?: boolean;
  description: string;
  preparation: string;
  preferredMonth: number; // 1-12 for balanced non-saturated annual spacing
  preferredHour: number;
  preferredMin: number;
  durationMin: number;
  colorId: '11' | '5';
}

export interface ScheduledPreventiveStudy {
  matrixId: string;
  title: string;
  categoryTag: string;
  description: string;
  preparation: string;
  matchedReasons: string[];
  event: GoogleCalendarEvent;
}

export interface UserHealthProfile {
  age: number;
  gender: 'female' | 'male';
  isSedentary: boolean;
  riskFactors: {
    smoking: boolean;
    vaping: boolean;
    alcohol: boolean;
    ultraprocessed: boolean;
  };
  year?: number;
  timeZone: string;
}

export interface ProfileDraft {
  age: string;
  gender: 'female' | 'male' | null;
  isSedentary: boolean | null;
  riskFactors: {
    smoking: boolean;
    vaping: boolean;
    alcohol: boolean;
    ultraprocessed: boolean;
  };
  timeZone: string;
}
