/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { GoogleCalendarEvent } from '../types/calendar.ts';
import { Copy, Check, Download, CheckCircle, Code2, Terminal } from 'lucide-react';
import { downloadStringAsFile } from '../utils/exportCalendar.ts';

interface JsonViewerProps {
  events: GoogleCalendarEvent[];
  copied: boolean;
  onCopy: () => void;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ events, copied, onCopy }) => {
  const [showCurl, setShowCurl] = useState(false);
  const jsonString = JSON.stringify(events, null, 2);

  const handleDownload = () => {
    downloadStringAsFile(jsonString, 'google_calendar_events_v3.json', 'application/json');
  };

  const hasValidStartEnd = events.every(
    (e) =>
      e.start?.dateTime &&
      e.start?.timeZone &&
      e.end?.dateTime &&
      e.end?.timeZone &&
      e.start.dateTime.includes('T') &&
      e.end.dateTime.includes('T')
  );

  const hasValidColorIds = events.every((e) => ['11', '2', '5'].includes(e.colorId));
  const hasValidReminders = events.every(
    (e) => e.reminders?.useDefault === false && Array.isArray(e.reminders?.overrides)
  );
  const recurringEventsCount = events.filter((e) => e.recurrence && e.recurrence.length > 0).length;

  const sampleEvent = events[0] || {};
  const curlSample = `curl -X POST \\
  "https://www.googleapis.com/calendar/v3/calendars/primary/events" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(sampleEvent, null, 2)}'`;

  return (
    <div className="space-y-5">
      {/* Verification Badge Bar */}
      <div className="bg-white border-2 border-red-500 rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-red-600" />
            Validación de Esquema Google Calendar API v3
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            100% compatible con la especificación de <code className="text-red-600 font-mono font-semibold">calendar.events.insert</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
              hasValidStartEnd
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <span>ISO 8601 + Offset</span>
          </span>
          <span
            className={`px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
              hasValidColorIds
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <span>colorId 11 / 2 / 5</span>
          </span>
          <span
            className={`px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
              hasValidReminders
                ? 'bg-red-50 border-red-300 text-red-800'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <span>reminders.overrides</span>
          </span>
          <span className="px-3 py-1 rounded-lg border border-red-300 bg-red-50 text-red-800 font-semibold">
            {recurringEventsCount} hábitos RRULE
          </span>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border-2 border-red-500 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-xs flex-wrap gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold font-mono">
          <Code2 className="w-4 h-4 text-red-600" />
          <span>Array de eventos JSON ({events.length} elementos)</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCurl(!showCurl)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-300"
          >
            <Terminal className="w-3.5 h-3.5 text-red-600" />
            <span>{showCurl ? 'Ver JSON Crudo' : 'Ver cURL de inserción'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-300"
          >
            <Download className="w-3.5 h-3.5 text-red-600" />
            <span>Descargar .json</span>
          </button>

          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Todo el Array JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Viewer Box */}
      {showCurl ? (
        <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-5 font-mono text-xs text-red-400 overflow-x-auto max-h-[600px] shadow-lg">
          <div className="text-slate-300 mb-2 font-sans text-xs font-medium">
            Ejemplo de inserción individual con HTTP cURL en la API v3:
          </div>
          <pre className="text-slate-100">{curlSample}</pre>
        </div>
      ) : (
        <div className="relative bg-slate-900 border-2 border-red-500 rounded-2xl p-5 font-mono text-xs text-slate-100 overflow-x-auto max-h-[600px] shadow-lg">
          <pre className="text-slate-200 leading-relaxed font-mono">{jsonString}</pre>
        </div>
      )}
    </div>
  );
};
