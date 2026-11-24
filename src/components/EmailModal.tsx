/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { GoogleCalendarEvent, UserHealthProfile } from '../types/calendar.ts';
import { getActiveRiskFactorKeys, RISK_FACTOR_LABELS } from '../utils/preventiveEngine.ts';
import { Mail, X, Send, Copy, Check, FileText } from 'lucide-react';
import { copyToClipboardSafe, generateIcsContent, downloadStringAsFile } from '../utils/exportCalendar.ts';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserHealthProfile;
  events: GoogleCalendarEvent[];
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  profile,
  events,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [patientNote, setPatientNote] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const activeFactors = getActiveRiskFactorKeys(profile).map((k) => RISK_FACTOR_LABELS[k]);
  const activityText = profile.isSedentary
    ? 'Menos de 2.5 horas a la semana (Sedentario)'
    : '2.5 horas o más a la semana (Moderado-Activo)';

  const emailSubject = encodeURIComponent(`Plan Médico Preventivo Anual - Prevención UNITEC`);
  const summaryBodyText = `PREVENCIÓN UNITEC - PLAN MÉDICO PREVENTIVO ANUAL
Edad: ${profile.age} años | Sexo: ${profile.gender === 'female' ? 'Femenino' : 'Masculino'}
Actividad física semanal: ${activityText}
Factores seleccionados: ${activeFactors.length > 0 ? activeFactors.join(', ') : 'Ninguno'}
Zona Horaria: ${profile.timeZone}
${patientNote ? `\nNota o comentario: ${patientNote}\n` : ''}
--- ESTUDIOS Y VALORACIONES RECOMENDADAS (${events.length}) ---
${events
  .map((e) => `• [${e.start.dateTime.slice(0, 10)}] ${e.summary}\n  ${e.description.replace(/\n+/g, ' ')}`)
  .join('\n\n')}

Generado mediante Prevención UNITEC (compatible con Google Calendar, Apple Calendar y Outlook)`;

  const mailtoLink = `mailto:${encodeURIComponent(recipientEmail)}?subject=${emailSubject}&body=${encodeURIComponent(summaryBodyText)}`;

  const handleCopyText = async () => {
    await copyToClipboardSafe(summaryBodyText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadIcs = () => {
    const icsContent = generateIcsContent(events);
    downloadStringAsFile(icsContent, `plan_preventivo_unitec.ics`, 'text/calendar');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-[#006FBA]/20 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_25px_70px_rgba(0,56,101,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white via-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#006FBA] to-[#00529B] flex items-center justify-center text-white shadow-md shadow-[#006FBA]/25">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#003865]">Enviar Plan Preventivo por Correo</h3>
              <p className="text-xs text-slate-500 font-medium">Envía un resumen ejecutivo oficial de Prevención UNITEC</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo Electrónico Destinatario
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-[#006FBA] focus:ring-2 focus:ring-[#006FBA]/10 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nota o Comentario Opcional
            </label>
            <textarea
              rows={2}
              value={patientNote}
              onChange={(e) => setPatientNote(e.target.value)}
              placeholder="Ej. Plan preventivo institucional UNITEC para seguimiento médico..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-[#006FBA] focus:ring-2 focus:ring-[#006FBA]/10 resize-none shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#006FBA]" />
                Vista previa del mensaje:
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-[#006FBA] hover:text-[#00529B] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? '¡Texto copiado!' : 'Copiar texto'}</span>
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-sans text-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {summaryBodyText}
            </div>
          </div>

          <div className="bg-[#006FBA]/5 border border-[#006FBA]/15 rounded-2xl p-3.5 text-[11px] text-[#003865] font-medium flex items-center justify-between gap-3">
            <div>
              💡 <strong>Opcional:</strong> Descarga el archivo <code>.ics</code> para adjuntarlo en tu correo o importarlo a cualquier aplicación de calendario.
            </div>
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#006FBA]/10 text-[#006FBA] font-bold border border-[#006FBA]/25 shrink-0 cursor-pointer shadow-2xs transition-all"
            >
              Descargar .ICS
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <a
            href={mailtoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F68B1F] to-[#E07208] hover:from-[#FA9938] hover:to-[#EB7D15] text-white text-xs font-extrabold shadow-md shadow-[#F68B1F]/30 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Abrir en Gmail / Correo</span>
          </a>
        </div>
      </div>
    </div>
  );
};
