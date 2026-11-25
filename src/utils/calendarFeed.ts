/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { UserHealthProfile } from '../types/calendar.ts';
import { generatePreventivePlan } from './preventiveEngine.ts';
import { generateIcsContent } from './exportCalendar.ts';
import { getDefaultTimeZone } from './timezone.ts';

export function buildCalendarFeedQuery(
  profile: UserHealthProfile,
  requestDate: Date = new Date()
): string {
  const rf = [
    profile.riskFactors.smoking ? '1' : '0',
    profile.riskFactors.vaping ? '1' : '0',
    profile.riskFactors.alcohol ? '1' : '0',
    profile.riskFactors.ultraprocessed ? '1' : '0',
  ].join('');

  const params = new URLSearchParams({
    age: String(profile.age),
    g: profile.gender === 'female' ? 'f' : 'm',
    sed: profile.isSedentary ? '1' : '0',
    rf,
    tz: profile.timeZone || getDefaultTimeZone(),
    ts: String(requestDate.getTime()),
  });

  return params.toString();
}

export function buildCalendarFeedUrl(
  profile: UserHealthProfile,
  requestDate: Date,
  host: string,
  scheme: 'webcal' | 'https' | 'http' = 'webcal'
): string {
  const query = buildCalendarFeedQuery(profile, requestDate);
  return `${scheme}://${host}/api/calendar.ics?${query}`;
}

export function parseCalendarFeedQuery(searchParams: URLSearchParams): {
  profile: UserHealthProfile;
  requestDate: Date;
} {
  const rawAge = Number(searchParams.get('age'));
  const age = Number.isInteger(rawAge) ? Math.min(95, Math.max(18, rawAge)) : 30;

  const g = searchParams.get('g');
  const gender: 'female' | 'male' = g === 'm' ? 'male' : 'female';

  const isSedentary = searchParams.get('sed') === '1';

  const rf = searchParams.get('rf') || '0000';
  const riskFactors = {
    smoking: rf[0] === '1',
    vaping: rf[1] === '1',
    alcohol: rf[2] === '1',
    ultraprocessed: rf[3] === '1',
  };

  const tz = searchParams.get('tz') || 'America/Mexico_City';

  const rawTs = Number(searchParams.get('ts'));
  const requestDate =
    Number.isFinite(rawTs) && rawTs > 0 ? new Date(rawTs) : new Date();

  return {
    profile: {
      age,
      gender,
      isSedentary,
      riskFactors,
      timeZone: tz,
    },
    requestDate,
  };
}

export function generateIcsFromQuery(searchParams: URLSearchParams): string {
  const { profile, requestDate } = parseCalendarFeedQuery(searchParams);
  const events = generatePreventivePlan(profile, requestDate);
  return generateIcsContent(events);
}
