/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { GoogleCalendarEvent } from '../types/calendar.ts';
import { generateGoogleCalendarWebLink, copyToClipboardSafe } from '../utils/exportCalendar.ts';
import {
  Calendar,
  Clock,
  Repeat,
  Bell,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EventCardProps {
  event: GoogleCalendarEvent;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showJsonDetails, setShowJsonDetails] = useState(false);

  const copyEventJson = async () => {
    await copyToClipboardSafe(JSON.stringify(event, null, 2));
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const gcalUrl = generateGoogleCalendarWebLink(event);

  // Formatting date
  const startDate = new Date(event.start.dateTime);
  const formattedDate = startDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const startTime = startDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isMedical = event.colorId === '11';
  const isHabit = event.colorId === '2';
  const isLifestyle = event.colorId === '5';

  return (
    <div className="bg-white border-2 border-red-500 rounded-2xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_36px_rgba(239,68,68,0.14)] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
      <div>
        {/* Top bar with category & date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          {/* Category Pill with Google Calendar Color Code */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                isMedical
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : isHabit
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isMedical ? 'bg-red-600' : isHabit ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              ></span>
              {isMedical
                ? 'Examen Médico / Vacuna'
                : isHabit
                ? 'Micro-hábito Saludable'
                : 'Nutrición y Estilo de Vida'}
              <span className="font-mono text-[10px] opacity-75">(colorId: {event.colorId})</span>
            </span>

            {event.recurrence && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                <Repeat className="w-3 h-3 text-red-600" />
                Recurrente (RRULE)
              </span>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{startTime}</span>
          </div>
        </div>

        {/* Summary Title */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          {event.summary}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
          {event.description}
        </p>

        {/* Recurrence Rule Details */}
        {event.recurrence && event.recurrence.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50/50 border border-red-200 text-xs font-mono text-red-900 flex items-start gap-2">
            <Repeat className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
            <div className="overflow-x-auto text-[11px] leading-tight">
              <span className="text-slate-500 font-sans block text-[10px] mb-0.5">Regla de repetición API v3:</span>
              {event.recurrence[0]}
            </div>
          </div>
        )}

        {/* Reminders Pill List */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap text-[11px] text-slate-500">
          <Bell className="w-3 h-3 text-red-500" />
          <span className="font-semibold text-slate-700">Recordatorios v3:</span>
          {event.reminders?.overrides?.map((rem, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] font-medium"
            >
              {rem.method === 'email' ? '📧 Email' : '🔔 Pop-up'}:{' '}
              {rem.minutes >= 1440
                ? `${Math.round(rem.minutes / 1440)}d antes`
                : rem.minutes >= 60
                ? `${Math.round(rem.minutes / 60)}h antes`
                : `${rem.minutes}m antes`}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-red-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-semibold transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-600" />
            <span>Abrir en Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={copyEventJson}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-all cursor-pointer shadow-sm"
            title="Copiar JSON v3 de este evento específico"
          >
            {copiedSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-red-600" />
                <span className="text-red-600 font-semibold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Evento</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowJsonDetails(!showJsonDetails)}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-mono transition-colors cursor-pointer font-medium"
        >
          <span>{showJsonDetails ? 'Ocultar JSON' : 'Ver payload API'}</span>
          {showJsonDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Collapsible raw JSON snippet for the event */}
      {showJsonDetails && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-red-400 overflow-x-auto">
          <pre>{JSON.stringify(event, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
