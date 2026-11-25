/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { GoogleCalendarEvent, UserHealthProfile } from '../types/calendar.ts';
import {
  generateIcsContent,
  downloadStringAsFile,
  generateGoogleCalendarWebLink,
  isAppleMobileDevice,
  isAndroidDevice,
  isMobileDevice,
} from '../utils/exportCalendar.ts';
import { buildCalendarFeedQuery } from '../utils/calendarFeed.ts';
import {
  Calendar,
  Download,
  Check,
  HelpCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';

interface ExportCalendarFooterProps {
  events: GoogleCalendarEvent[];
  profile?: UserHealthProfile;
  requestDate?: Date;
}

const MONTH_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export const ExportCalendarFooter: React.FC<ExportCalendarFooterProps> = ({
  events,
  profile,
  requestDate,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [showGoogleList, setShowGoogleList] = useState(false);
  const [addedIndices, setAddedIndices] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isAppleMobileDevice()) {
      setPlatform('ios');
    } else if (isAndroidDevice()) {
      setPlatform('android');
      setShowGoogleList(true);
    } else if (isMobileDevice()) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  useEffect(() => {
    setAddedIndices({});
  }, [events]);

  const appleCalendarUrl = useMemo(() => {
    if (typeof window === 'undefined' || !profile) return '#';
    const query = buildCalendarFeedQuery(profile, requestDate || new Date());
    if (window.location.protocol === 'https:') {
      return `webcal://${window.location.host}/api/calendar.ics?${query}`;
    }
    return `/api/calendar.ics?${query}`;
  }, [profile, requestDate]);

  const httpsIcsUrl = useMemo(() => {
    if (typeof window === 'undefined' || !profile) return '#';
    const query = buildCalendarFeedQuery(profile, requestDate || new Date());
    return `${window.location.origin}/api/calendar.ics?${query}`;
  }, [profile, requestDate]);

  const handleDesktopDownload = () => {
    const icsContent = generateIcsContent(events);
    downloadStringAsFile(icsContent, 'plan_preventivo_unitec.ics', 'text/calendar');
    setDownloaded(true);
    setShowInstructions(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const markEventAdded = (idx: number) => {
    setAddedIndices((prev) => ({ ...prev, [idx]: true }));
  };

  const addedCount = Object.values(addedIndices).filter(Boolean).length;

  return (
    <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-6 sm:p-7 shadow-[0_16px_45px_rgba(0,111,186,0.08)] space-y-4 relative overflow-hidden">
      {/* Decorative gradient aura */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-[#F68B1F]/10 via-[#006FBA]/5 to-transparent rounded-bl-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#006FBA] via-[#00529B] to-[#0A2540] flex items-center justify-center text-white shadow-lg shadow-[#006FBA]/25 ring-2 ring-[#006FBA]/20 shrink-0">
            {platform === 'desktop' ? (
              <Calendar className="w-6 h-6 text-white" />
            ) : (
              <Smartphone className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#003865] tracking-tight">
              Exportar plan anual a mi calendario
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {platform === 'ios'
                ? `Agrega tus ${events.length} estudios directamente a Apple Calendar en 1 toque o guárdalos uno a uno en Google Calendar.`
                : platform === 'android'
                ? `Guarda tus ${events.length} estudios directo en la app de Google Calendar con un toque en cada fecha.`
                : `Descarga tu archivo de calendario universal (.ICS) con tus ${events.length} estudios y valoraciones preventivas para importarlo en cualquier plataforma.`}
            </p>
          </div>
        </div>

        {/* Action Controls: Desktop stays identical, Mobile gets friction-free 1-tap controls */}
        {platform === 'desktop' ? (
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDesktopDownload}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F68B1F] via-[#E87E13] to-[#D56B02] hover:from-[#FA9938] hover:to-[#E57A0F] text-white text-xs font-extrabold shadow-lg shadow-[#F68B1F]/30 hover:shadow-xl hover:shadow-[#F68B1F]/40 active:scale-95 transition-all cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Calendario descargado (.ICS)!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Descargar archivo de calendario (.ICS)</span>
                </>
              )}
            </button>
          </div>
        ) : platform === 'ios' ? (
          <div className="flex flex-col items-stretch gap-2.5 shrink-0">
            <a
              href={appleCalendarUrl}
              target="_top"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F68B1F] via-[#E87E13] to-[#D56B02] hover:from-[#FA9938] hover:to-[#E57A0F] text-white text-xs font-extrabold shadow-lg shadow-[#F68B1F]/30 active:scale-95 transition-all cursor-pointer text-center"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Agregar todo a Apple Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => setShowGoogleList((prev) => !prev)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#006FBA]/10 hover:bg-[#006FBA]/15 border border-[#006FBA]/25 text-[#003865] text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#006FBA]" />
              <span>
                {showGoogleList
                  ? 'Ocultar lista para Google Calendar'
                  : '¿Usas Google Calendar? Agrégalos en 1 toque'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDesktopDownload}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#006FBA] underline underline-offset-2 text-center cursor-pointer"
            >
              {downloaded ? '¡Archivo .ICS descargado!' : 'O descargar archivo .ICS (Outlook)'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-stretch gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowGoogleList((prev) => !prev)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F68B1F] via-[#E87E13] to-[#D56B02] hover:from-[#FA9938] hover:to-[#E57A0F] text-white text-xs font-extrabold shadow-lg shadow-[#F68B1F]/30 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>
                {showGoogleList
                  ? `Agendar en Google Calendar (${addedCount}/${events.length})`
                  : 'Agregar a Google Calendar (1 toque)'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#006FBA]">
              <a
                href={httpsIcsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[#00529B]"
              >
                Abrir .ICS (Outlook / Samsung)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Mobile 1-tap Google Calendar study list */}
      {platform !== 'desktop' && showGoogleList && (
        <div className="relative z-10 p-4 rounded-2xl bg-slate-50 border border-[#006FBA]/15 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold text-[#003865]">
                Agregar directo a Google Calendar
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Toca «Agendar» en cada estudio: se abrirá tu calendario con todo listo, solo presiona Guardar.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#006FBA] bg-white px-2.5 py-1 rounded-full border border-[#006FBA]/20 shrink-0">
              {addedCount}/{events.length}
            </span>
          </div>

          <div className="space-y-2">
            {[...events]
              .sort((a, b) => a.start.dateTime.localeCompare(b.start.dateTime))
              .map((ev, idx) => {
                const yearStr = ev.start.dateTime.slice(0, 4);
                const monthIdx = parseInt(ev.start.dateTime.slice(5, 7), 10) - 1;
                const dayNum = ev.start.dateTime.slice(8, 10);
                const isAdded = Boolean(addedIndices[idx]);

                return (
                  <div
                    key={ev.id || idx}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      isAdded
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-[#006FBA] uppercase tracking-wider">
                        {dayNum} {MONTH_SHORT[monthIdx] || ''} {yearStr}
                      </div>
                      <div className="text-xs font-bold text-[#003865] leading-snug">
                        {ev.summary}
                      </div>
                    </div>
                    <a
                      href={generateGoogleCalendarWebLink(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markEventAdded(idx)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#006FBA] hover:bg-[#00529B] text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Listo</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Agendar</span>
                        </>
                      )}
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Compatibility & Instructions Toggle */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs relative z-10">
        <div className="text-slate-600 flex items-center gap-2 font-medium">
          <span className="h-2 w-2 rounded-full bg-[#006FBA] shrink-0"></span>
          <span>
            Compatible con <strong>Google Calendar</strong>, <strong>Apple Calendar</strong> y <strong>Microsoft Outlook</strong>.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-xs font-bold text-[#006FBA] hover:text-[#00529B] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#F68B1F]" />
          <span>{showInstructions ? 'Ocultar guía de importación' : '¿Cómo importarlo en mi calendario?'}</span>
        </button>
      </div>

      {showInstructions && (
        <div className="p-4 rounded-2xl bg-[#006FBA]/5 border border-[#006FBA]/15 text-xs text-slate-700 space-y-2.5 font-medium relative z-10">
          <div className="font-extrabold text-[#003865] text-xs">
            Cómo agregar tu plan a tu calendario favorito:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
            <div className="bg-white/90 rounded-xl p-3 border border-[#006FBA]/10">
              <div className="font-bold text-[#003865] mb-1">Google Calendar</div>
              <p className="text-slate-600">
                En computadora abre Configuración &rarr; <em>Importar y exportar</em> con tu archivo <code>.ics</code>. En celular usa la opción directa <strong>Agregar a Google Calendar</strong>.
              </p>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-[#006FBA]/10">
              <div className="font-bold text-[#003865] mb-1">Apple Calendar (Mac / iOS)</div>
              <p className="text-slate-600">
                En iPhone/iPad presiona <strong>Agregar todo a Apple Calendar</strong> y confirma <em>Suscribir / Agregar</em>. En Mac haz doble clic sobre el archivo <code>.ics</code>.
              </p>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-[#006FBA]/10">
              <div className="font-bold text-[#003865] mb-1">Microsoft Outlook</div>
              <p className="text-slate-600">
                Ve a <em>Agregar calendario &rarr; Cargar desde archivo</em> (en web) o abre directamente el archivo <code>.ics</code> en tu equipo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
