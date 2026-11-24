/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Clock, ShieldAlert, HeartPulse, RefreshCw, Check } from 'lucide-react';
import type { UserHealthProfile } from '../types/calendar.ts';

interface ProfileFormProps {
  profile: UserHealthProfile;
  onChange: (updated: UserHealthProfile) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

const COMMON_TIMEZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/Tijuana',
  'America/Bogota',
  'America/Lima',
  'America/Buenos_Aires',
  'America/Santiago',
  'America/Los_Angeles',
  'America/New_York',
  'Europe/Madrid',
  'UTC',
];

const ACTION_FACTORS: Array<{
  key: keyof UserHealthProfile['riskFactors'];
  label: string;
  icon: string;
}> = [
  { key: 'smoking', label: 'Fumo', icon: '🚬' },
  { key: 'vaping', label: 'Vapeo', icon: '💨' },
  {
    key: 'alcohol',
    label: 'Bebo alcohol al menos una vez a la semana',
    icon: '🍷',
  },
  {
    key: 'ultraprocessed',
    label: 'Ingiero alimentos ultraprocesados (como papitas, pan, dulces) al menos una vez al día',
    icon: '🥨',
  },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChange,
  onGenerate,
  isGenerating,
}) => {
  const toggleRisk = (key: keyof UserHealthProfile['riskFactors']) => {
    onChange({
      ...profile,
      riskFactors: {
        ...profile.riskFactors,
        [key]: !profile.riskFactors[key],
      },
    });
  };

  return (
    <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,111,186,0.06)] relative overflow-hidden">
      {/* Subtle decorative brand glow in the top-right corner */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-[#006FBA]/5 via-[#F68B1F]/5 to-transparent rounded-bl-full pointer-events-none"></div>

      {/* Form Header */}
      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-2xl bg-[#006FBA]/10 text-[#006FBA] flex items-center justify-center font-bold shrink-0">
            <User className="w-5 h-5 text-[#006FBA]" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-[#003865] tracking-tight">
              Perfil clínico (evaluación individual)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Ajusta tus parámetros para calcular los estudios preventivos recomendados para tu perfil.
            </p>
          </div>
        </div>
      </div>

      {/* Main Parameters Grid: Edad, Sexo, Zona Horaria + Nivel de Actividad Física Binario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 relative z-10">
        {/* Edad */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="age-range" className="text-xs font-bold text-slate-700">
              Edad
            </label>
            <span className="text-xs font-extrabold text-[#006FBA] bg-white px-2.5 py-0.5 rounded-lg border border-[#006FBA]/20 shadow-xs">
              {profile.age} años
            </span>
          </div>
          <input
            id="age-range"
            type="range"
            min="18"
            max="95"
            value={profile.age}
            onChange={(e) => onChange({ ...profile, age: parseInt(e.target.value, 10) || 18 })}
            className="w-full accent-[#006FBA] cursor-pointer h-2 bg-slate-200 rounded-lg mt-1"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1.5">
            <span>18 años</span>
            <span>95 años</span>
          </div>
        </div>

        {/* Sexo (solo Femenino / Masculino) */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <label className="block text-xs font-bold text-slate-700 mb-2">Sexo</label>
          <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => onChange({ ...profile, gender: 'female' })}
              aria-pressed={profile.gender === 'female'}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                profile.gender === 'female'
                  ? 'bg-gradient-to-r from-[#006FBA] to-[#00529B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#006FBA]'
              }`}
            >
              Femenino
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, gender: 'male' })}
              aria-pressed={profile.gender === 'male'}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                profile.gender === 'male'
                  ? 'bg-gradient-to-r from-[#006FBA] to-[#00529B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#006FBA]'
              }`}
            >
              Masculino
            </button>
          </div>
        </div>

        {/* Zona horaria */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <label
            htmlFor="timezone-select"
            className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#006FBA]" />
            Zona Horaria
          </label>
          <select
            id="timezone-select"
            value={profile.timeZone}
            onChange={(e) => onChange({ ...profile, timeZone: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#006FBA] focus:ring-2 focus:ring-[#006FBA]/10 shadow-xs"
          >
            {!COMMON_TIMEZONES.includes(profile.timeZone) && (
              <option value={profile.timeZone}>{profile.timeZone} (Detectada)</option>
            )}
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nivel de Actividad Física Binario */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <label className="block text-xs font-bold text-[#003865]">
              Nivel de actividad física semanal
            </label>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Criterio clínico (OMS): realizar menos de 150 minutos (2.5 horas) a la semana se considera sedentarismo.
            </p>
          </div>
          <span
            className={`self-start sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
              profile.isSedentary
                ? 'bg-[#F68B1F]/15 text-[#D56B02] border-[#F68B1F]/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {profile.isSedentary ? 'Factor activo: Sedentarismo' : 'Nivel saludable'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onChange({ ...profile, isSedentary: true })}
            aria-pressed={profile.isSedentary}
            className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              profile.isSedentary
                ? 'bg-gradient-to-r from-[#F68B1F]/12 to-[#F68B1F]/5 border-[#F68B1F] text-[#003865] shadow-xs ring-1 ring-[#F68B1F]/30'
                : 'bg-white border-slate-200 text-slate-600 hover:border-[#006FBA]/40'
            }`}
          >
            <div>
              <div className="text-xs font-bold">Menos de 2.5 horas a la semana</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Menos de 150 min/sem · Se considera sedentario
              </div>
            </div>
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                profile.isSedentary
                  ? 'bg-[#F68B1F] border-[#F68B1F] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {profile.isSedentary && <Check className="w-3 h-3" />}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...profile, isSedentary: false })}
            aria-pressed={!profile.isSedentary}
            className={`px-4 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              !profile.isSedentary
                ? 'bg-gradient-to-r from-[#006FBA]/10 to-[#00529B]/5 border-[#006FBA] text-[#003865] shadow-xs ring-1 ring-[#006FBA]/30'
                : 'bg-white border-slate-200 text-slate-600 hover:border-[#006FBA]/40'
            }`}
          >
            <div>
              <div className="text-xs font-bold">2.5 horas o más a la semana</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                150+ min/sem de actividad moderada o vigorosa · Moderado-Activo
              </div>
            </div>
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                !profile.isSedentary
                  ? 'bg-[#006FBA] border-[#006FBA] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {!profile.isSedentary && <Check className="w-3 h-3" />}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Acciones / Factores adicionales (junto con Sedentarismo = 5 factores) */}
      <div className="mb-6 relative z-10">
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#003865] mb-2.5 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#F68B1F]" />
          Selecciona la opción si realizas las siguientes acciones
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {ACTION_FACTORS.map(({ key, label, icon }) => {
            const active = profile.riskFactors[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleRisk(key)}
                aria-pressed={active}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-br from-[#006FBA]/10 to-[#F68B1F]/10 border-[#006FBA] text-[#003865] shadow-xs ring-1 ring-[#006FBA]/30 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#006FBA]/40 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{icon}</span>
                  <span className="leading-snug">{label}</span>
                </div>
                <span
                  className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                    active
                      ? 'bg-[#006FBA] border-[#006FBA] text-white'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón: "Quiero mi plan preventivo anual" con estilo UNITEC Naranja */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 relative z-10">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#F68B1F] via-[#E87E13] to-[#D56B02] hover:from-[#FA9938] hover:to-[#E57A0F] text-white text-sm font-extrabold transition-all shadow-lg shadow-[#F68B1F]/30 hover:shadow-xl hover:shadow-[#F68B1F]/40 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Generando plan personalizado...</span>
            </>
          ) : (
            <>
              <HeartPulse className="w-5 h-5 text-white" />
              <span>Quiero mi plan preventivo anual</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
