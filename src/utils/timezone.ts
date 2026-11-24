/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Gets the system default timeZone (e.g. "America/Los_Angeles", "America/Mexico_City", "Europe/Madrid")
 */
export function getDefaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
  } catch {
    return 'America/Los_Angeles';
  }
}

/**
 * Returns formatted ISO 8601 time zone offset (e.g., "-07:00" or "+02:00") for a specific date and timeZone.
 */
export function getTimeZoneOffsetString(date: Date, timeZone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart && tzPart.value.startsWith('GMT')) {
      const rawOffset = tzPart.value.replace('GMT', '');
      if (!rawOffset) return '+00:00';
      // Format GMT-7 to -07:00 or GMT-07:00
      if (rawOffset.includes(':')) {
        const sign = rawOffset[0];
        const rest = rawOffset.slice(1);
        const [h, m] = rest.split(':');
        return `${sign}${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
      } else {
        const sign = rawOffset[0];
        const h = rawOffset.slice(1);
        return `${sign}${h.padStart(2, '0')}:00`;
      }
    }
  } catch {
    // Fallback using Date offset
  }

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (absMinutes % 60).toString().padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

/**
 * Formats a given Date into ISO 8601 with timezone offset: "YYYY-MM-DDTHH:mm:ss±HH:mm"
 */
export function formatToIsoWithOffset(
  year: number,
  month: number, // 1 to 12
  day: number,
  hours: number,
  minutes: number,
  timeZone: string
): string {
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  // Estimate offset for that particular date in that timezone
  const sampleDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const offsetStr = getTimeZoneOffsetString(sampleDate, timeZone);

  return `${year}-${paddedMonth}-${paddedDay}T${paddedHours}:${paddedMinutes}:00${offsetStr}`;
}
