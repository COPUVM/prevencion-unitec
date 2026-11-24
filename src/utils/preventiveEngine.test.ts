import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePreventivePlan,
  generatePreventiveStudyPlan,
  DEFAULT_PROFILE,
  getActiveRiskFactorKeys,
  getRollingMonths,
  PREVENTIVE_MATRIX,
} from './preventiveEngine.ts';
import { generateIcsContent } from './exportCalendar.ts';
import type { UserHealthProfile } from '../types/calendar.ts';

test('matrix contains all 14 preventive recommendations', () => {
  assert.equal(PREVENTIVE_MATRIX.length, 14);
});

test('generates studies with matrix descriptions, no R-XX code in summary, and no recurring habits', () => {
  const studies = generatePreventiveStudyPlan(DEFAULT_PROFILE);
  assert.ok(studies.length > 0, 'Should generate at least one study');

  for (const study of studies) {
    assert.ok(study.description.length > 10);
    assert.ok(study.preparation.length > 10);
    assert.equal(study.event.recurrence, undefined, 'Should not generate recurring habit events');
    assert.ok(!/\[R-\d+\]/.test(study.event.summary), 'Summary should not expose internal R-XX code');
    assert.ok(study.event.description.includes(study.description));
    assert.ok(study.event.description.includes(study.preparation));
  }
});

test('woman aged 32 with 0 risk factors gets Citología cervical (25-99), Vacunación, and Presión arterial', () => {
  const profile32: UserHealthProfile = {
    age: 32,
    gender: 'female',
    isSedentary: false,
    riskFactors: {
      smoking: false,
      vaping: false,
      alcohol: false,
      ultraprocessed: false,
    },
    timeZone: 'America/Mexico_City',
  };

  const ids = generatePreventiveStudyPlan(profile32).map((s) => s.matrixId);
  assert.ok(ids.includes('R-02'), 'Woman aged 32 (range 25-99) must receive Citología cervical even without smoking');
  assert.ok(ids.includes('R-12'), 'Woman aged 32 must receive Esquema de vacunación');
  assert.ok(ids.includes('R-13'), 'Woman aged 32 must receive Presión arterial');
  assert.ok(!ids.includes('R-01'), 'Woman aged 32 is below 35-99 range for Mastografía');
});

test('woman aged 35+ with 0 risk factors gets Mastografía bilateral (35-99) and Citología cervical (25-99)', () => {
  const profile36: UserHealthProfile = {
    age: 36,
    gender: 'female',
    isSedentary: false,
    riskFactors: {
      smoking: false,
      vaping: false,
      alcohol: false,
      ultraprocessed: false,
    },
    timeZone: 'America/Mexico_City',
  };

  const ids = generatePreventiveStudyPlan(profile36).map((s) => s.matrixId);
  assert.deepEqual(ids, ['R-01', 'R-02', 'R-04', 'R-12', 'R-13', 'R-14']);
});

test('male 50 with vaping gets R-06, R-07, R-09, R-12, R-13, R-14 and excludes R-15 (age > 45)', () => {
  const profile: UserHealthProfile = {
    age: 50,
    gender: 'male',
    isSedentary: false,
    riskFactors: {
      smoking: false,
      vaping: true,
      alcohol: false,
      ultraprocessed: false,
    },
    timeZone: 'America/Mexico_City',
  };

  const ids = generatePreventiveStudyPlan(profile).map((s) => s.matrixId);
  assert.deepEqual(ids, ['R-04', 'R-06', 'R-07', 'R-09', 'R-12', 'R-13', 'R-14']);
  assert.equal(getActiveRiskFactorKeys(profile).length, 1);
});

test('young male (25) with 0 risk factors gets R-12, R-13, R-15', () => {
  const profile: UserHealthProfile = {
    age: 25,
    gender: 'male',
    isSedentary: false,
    riskFactors: {
      smoking: false,
      vaping: false,
      alcohol: false,
      ultraprocessed: false,
    },
    timeZone: 'America/Mexico_City',
  };

  const ids = generatePreventiveStudyPlan(profile).map((s) => s.matrixId);
  assert.deepEqual(ids, ['R-12', 'R-13', 'R-15']);
});

test('distributes studies across 12 upcoming rolling months without saturating a single month', () => {
  const maxRiskFemale: UserHealthProfile = {
    age: 55,
    gender: 'female',
    isSedentary: true,
    riskFactors: {
      smoking: true,
      vaping: true,
      alcohol: true,
      ultraprocessed: true,
    },
    timeZone: 'America/Mexico_City',
  };

  const reqDate = new Date('2026-11-24T18:00:00Z');
  const events = generatePreventivePlan(maxRiskFemale, reqDate);
  assert.equal(events.length, 12);
  const uniqueMonths = new Set(events.map((e) => e.start.dateTime.slice(0, 7)));
  assert.equal(uniqueMonths.size, 12, 'All 12 studies should occupy 12 distinct YYYY-MM months');

  for (const ev of events) {
    assert.ok(
      new Date(ev.start.dateTime).getTime() > reqDate.getTime(),
      `Event ${ev.summary} (${ev.start.dateTime}) must be scheduled strictly after request date`
    );
  }
});

test('rolling months advance to next month when requested late in the month (>= 25)', () => {
  const lateDate = new Date('2027-02-27T18:00:00Z');
  const slots = getRollingMonths(lateDate, 'America/Mexico_City');
  assert.equal(slots.length, 12);
  assert.deepEqual(slots[0], { year: 2027, month: 3, baseDay: 12 });
  assert.deepEqual(slots[11], { year: 2028, month: 2, baseDay: 12 });

  const events = generatePreventivePlan(DEFAULT_PROFILE, lateDate);
  for (const ev of events) {
    assert.ok(
      new Date(ev.start.dateTime).getTime() > lateDate.getTime(),
      `Event ${ev.start.dateTime} must be in the future after 2027-02-27`
    );
  }
});

test('generateIcsContent escapes text and produces valid VCALENDAR output with rolling future DTSTART', () => {
  const reqDate = new Date('2026-11-24T18:00:00Z');
  const events = generatePreventivePlan(DEFAULT_PROFILE, reqDate);
  const ics = generateIcsContent(events);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('DTSTART:20270212T'), 'Feb study requested in Nov 2026 should land in Feb 2027');
});
