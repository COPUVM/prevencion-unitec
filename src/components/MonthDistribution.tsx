/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { GoogleCalendarEvent } from '../types/calendar.ts';
import type { RollingMonthSlot } from '../utils/preventiveEngine.ts';
import { getRollingMonths } from '../utils/preventiveEngine.ts';
import { ShieldCheck } from 'lucide-react';

interface MonthDistributionProps {
  events: GoogleCalendarEvent[];
  rollingMonths?: RollingMonthSlot[];
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const MonthDistribution: React.FC<MonthDistributionProps> = ({
  events,
  rollingMonths,
}) => {
  const slots = rollingMonths && rollingMonths.length === 12 ? rollingMonths : getRollingMonths();
  const monthMap: Record<string, GoogleCalendarEvent[]> = {};

  slots.forEach((slot) => {
    const key = `${slot.year}-${slot.month.toString().padStart(2, '0')}`;
    monthMap[key] = [];
  });

  events.forEach((ev) => {
    const key = ev.start.dateTime.slice(0, 7);
    if (monthMap[key]) {
      monthMap[key].push(ev);
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,111,186,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-[#006FBA]/10 border border-[#006FBA]/20 flex items-center justify-center text-[#006FBA] shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#006FBA]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#003865]">
              Distribución anual estratégica
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Los estudios y valoraciones preventivas están distribuidos mes a mes durante los próximos 12 meses a partir de hoy.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006FBA]"></span>
            <span className="text-slate-700">Estudios clínicos y vacunas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F68B1F]"></span>
            <span className="text-slate-700">Valoraciones preventivas</span>
          </div>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const monthName = MONTH_NAMES[slot.month - 1];
          const key = `${slot.year}-${slot.month.toString().padStart(2, '0')}`;
          const monthEvents = monthMap[key] || [];
          const hasEvents = monthEvents.length > 0;

          return (
            <div
              key={key}
              className={`bg-white rounded-2xl border ${
                hasEvents ? 'border-[#006FBA]/20 shadow-[0_8px_25px_rgba(0,111,186,0.06)]' : 'border-slate-200/80 shadow-2xs'
              } p-4 flex flex-col justify-between transition-all hover:shadow-[0_16px_35px_rgba(0,111,186,0.12)] hover:border-[#006FBA]/40 hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#003865] tracking-wide uppercase">
                    {monthName} {slot.year}
                  </span>
                </div>

                {hasEvents ? (
                  <div className="space-y-2">
                    {monthEvents.map((ev, i) => {
                      const dayStr = ev.start.dateTime.slice(8, 10);
                      const isMedical = ev.colorId === '11';

                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl text-xs border transition-all ${
                            isMedical
                              ? 'bg-blue-50/70 border-[#006FBA]/25 text-[#003865]'
                              : 'bg-amber-50/70 border-[#F68B1F]/30 text-amber-950'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] mb-1 font-semibold opacity-75">
                            <span>Día {dayStr}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold">
                              {isMedical ? 'Estudio' : 'Valoración'}
                            </span>
                          </div>
                          <div className="font-bold text-xs leading-snug line-clamp-2">
                            {ev.summary}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-7 text-center text-xs text-slate-400 font-medium">
                    Mes sin estudios programados
                    <div className="text-[10px] text-slate-400 mt-1">
                      Distribución equilibrada
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
