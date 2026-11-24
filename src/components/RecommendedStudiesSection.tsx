/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { ScheduledPreventiveStudy } from '../types/calendar.ts';
import { Stethoscope, Calendar, Sparkles, ClipboardList } from 'lucide-react';

interface RecommendedStudiesSectionProps {
  studies: ScheduledPreventiveStudy[];
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

export const RecommendedStudiesSection: React.FC<RecommendedStudiesSectionProps> = ({
  studies,
}) => {
  return (
    <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,111,186,0.06)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#006FBA]/10 flex items-center justify-center text-[#006FBA] shrink-0">
            <Stethoscope className="w-5 h-5 text-[#006FBA]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#003865] tracking-tight">
              Estudios preventivos recomendados
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Sugerencias personalizadas según tu edad, sexo y hábitos seleccionados.
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-[#006FBA]/10 text-[#006FBA] border border-[#006FBA]/20 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#F68B1F]" />
          {studies.length} {studies.length === 1 ? 'estudio recomendado' : 'estudios recomendados'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {studies.map((study) => {
          const yearStr = study.event.start.dateTime.slice(0, 4);
          const monthIdx = parseInt(study.event.start.dateTime.slice(5, 7), 10) - 1;
          const dayNum = study.event.start.dateTime.slice(8, 10);
          const timeStr = study.event.start.dateTime.slice(11, 16);
          const isMedical = study.event.colorId === '11';

          return (
            <div
              key={study.matrixId}
              className="bg-gradient-to-b from-white to-slate-50/50 border border-[#006FBA]/20 hover:border-[#006FBA]/50 rounded-2xl p-5 shadow-[0_8px_25px_rgba(0,111,186,0.05)] hover:shadow-[0_14px_30px_rgba(0,111,186,0.11)] transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                      isMedical
                        ? 'bg-[#006FBA]/10 text-[#006FBA] border-[#006FBA]/20'
                        : 'bg-[#F68B1F]/12 text-[#D56B02] border-[#F68B1F]/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isMedical ? 'bg-[#006FBA]' : 'bg-[#F68B1F]'
                      }`}
                    ></span>
                    {study.categoryTag}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    <Calendar className="w-3.5 h-3.5 text-[#F68B1F]" />
                    {dayNum} {MONTH_SHORT[monthIdx] || ''} {yearStr} · {timeStr} hrs
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-[#003865] leading-snug">
                  {study.event.summary}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {study.description}
                </p>

                {/* Preparación / Indicaciones de la matriz */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-[11px] text-slate-700 space-y-1 shadow-2xs">
                  <div className="font-bold text-[#003865] flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-[#F68B1F] shrink-0" />
                    <span>Indicaciones y preparación previa:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{study.preparation}</p>
                </div>

                {/* Motivos de activación */}
                <div className="flex flex-wrap gap-1.5">
                  {study.matchedReasons.map((reason) => (
                    <span
                      key={reason}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
