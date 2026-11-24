/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { GoogleCalendarEvent } from '../types/calendar.ts';
import { generateIcsContent, downloadStringAsFile } from '../utils/exportCalendar.ts';
import { Calendar, Download, Check, HelpCircle } from 'lucide-react';

interface ExportCalendarFooterProps {
  events: GoogleCalendarEvent[];
}

export const ExportCalendarFooter: React.FC<ExportCalendarFooterProps> = ({ events }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDownloadFullCalendar = () => {
    const icsContent = generateIcsContent(events);
    downloadStringAsFile(icsContent, 'plan_preventivo_unitec.ics', 'text/calendar');
    setDownloaded(true);
    setShowInstructions(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-6 sm:p-7 shadow-[0_16px_45px_rgba(0,111,186,0.08)] space-y-4 relative overflow-hidden">
      {/* Decorative gradient aura */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-[#F68B1F]/10 via-[#006FBA]/5 to-transparent rounded-bl-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#006FBA] via-[#00529B] to-[#0A2540] flex items-center justify-center text-white shadow-lg shadow-[#006FBA]/25 ring-2 ring-[#006FBA]/20 shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#003865] tracking-tight">
              Exportar plan anual a mi calendario
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Descarga tu archivo de calendario universal (.ICS) con tus {events.length} estudios y valoraciones preventivas para importarlo en cualquier plataforma.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleDownloadFullCalendar}
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
      </div>

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
            Cómo agregar el archivo .ICS a tu calendario favorito:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
            <div className="bg-white/90 rounded-xl p-3 border border-[#006FBA]/10">
              <div className="font-bold text-[#003865] mb-1">Google Calendar</div>
              <p className="text-slate-600">
                Abre Configuración &rarr; <em>Importar y exportar</em>, selecciona tu archivo <code>.ics</code> y haz clic en <strong>Importar</strong>.
              </p>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-[#006FBA]/10">
              <div className="font-bold text-[#003865] mb-1">Apple Calendar (Mac / iOS)</div>
              <p className="text-slate-600">
                Haz doble clic sobre el archivo <code>.ics</code> descargado (o ábrelo en iPhone/iPad) y pulsa <strong>Añadir todos</strong>.
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
