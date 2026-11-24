/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GoogleCalendarEvent } from '../types/calendar.ts';

/**
 * Creates a direct Google Calendar web create URL for an individual event
 */
export function generateGoogleCalendarWebLink(event: GoogleCalendarEvent): string {
  const toUtcCompact = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    } catch {
      return isoStr.replace(/[-:]/g, '');
    }
  };

  const startUtc = toUtcCompact(event.start.dateTime);
  const endUtc = toUtcCompact(event.end.dateTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.summary,
    details: `${event.description}\n\n[Plan Preventivo Anual - Prevención UNITEC]`,
    dates: `${startUtc}/${endUtc}`,
    ctz: event.start.timeZone || 'UTC',
  });

  if (event.recurrence && event.recurrence[0]) {
    params.set('recur', event.recurrence[0]);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Converts events into a valid iCalendar (.ics) RFC-5545 string
 */
export function generateIcsContent(events: GoogleCalendarEvent[]): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const escapeIcsText = (str: string) =>
    str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  const formatIcsDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PreventiCal//Plan Preventivo Anual//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Plan Preventivo Anual de Salud',
  ];

  events.forEach((event, index) => {
    const uid = `preventical-${Date.now()}-${index}@preventical.internal`;
    const dtStamp = formatIcsDate(new Date().toISOString());
    const dtStart = formatIcsDate(event.start.dateTime);
    const dtEnd = formatIcsDate(event.end.dateTime);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeIcsText(event.summary)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);

    if (event.recurrence) {
      event.recurrence.forEach((rrule) => {
        lines.push(rrule);
      });
    }

    // Reminders / VALARM
    if (event.reminders && event.reminders.overrides && event.reminders.overrides.length > 0) {
      const firstOverride = event.reminders.overrides[0];
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeIcsText(event.summary)}`);
      lines.push(`TRIGGER:-PT${firstOverride.minutes}M`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Safely copies text to clipboard with legacy textarea fallback
 */
export async function copyToClipboardSafe(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Ignore and proceed to fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Downloads a string as a file in the browser
 */
export function downloadStringAsFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
