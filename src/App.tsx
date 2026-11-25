/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import type {
  ProfileDraft,
  ScheduledPreventiveStudy,
  UserHealthProfile,
} from './types/calendar.ts';
import {
  generatePreventiveStudyPlan,
  getActiveRiskFactorKeys,
  getRollingMonths,
  createEmptyProfileDraft,
  validateProfileDraft,
  type ProfileValidationErrors,
} from './utils/preventiveEngine.ts';
import { Header } from './components/Header.tsx';
import { ProfileForm } from './components/ProfileForm.tsx';
import { RecommendedStudiesSection } from './components/RecommendedStudiesSection.tsx';
import { MonthDistribution } from './components/MonthDistribution.tsx';
import { ExportCalendarFooter } from './components/ExportCalendarFooter.tsx';
import { EmailModal } from './components/EmailModal.tsx';
import { Stethoscope, Calendar, ShieldAlert, ClipboardCheck } from 'lucide-react';

interface SubmittedPlanState {
  profile: UserHealthProfile;
  requestDate: Date;
  studies: ScheduledPreventiveStudy[];
}

export default function App() {
  const [draft, setDraft] = useState<ProfileDraft>(() => createEmptyProfileDraft());
  const [showErrors, setShowErrors] = useState(false);
  const [submittedPlan, setSubmittedPlan] = useState<SubmittedPlanState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const validation = useMemo(() => validateProfileDraft(draft), [draft]);
  const visibleErrors: ProfileValidationErrors = showErrors ? validation.errors : {};

  const hasPendingChanges = useMemo(() => {
    if (!submittedPlan) return false;
    const prev = submittedPlan.profile;
    return (
      String(prev.age) !== draft.age.trim() ||
      prev.gender !== draft.gender ||
      prev.isSedentary !== draft.isSedentary ||
      prev.timeZone !== draft.timeZone ||
      prev.riskFactors.smoking !== draft.riskFactors.smoking ||
      prev.riskFactors.vaping !== draft.riskFactors.vaping ||
      prev.riskFactors.alcohol !== draft.riskFactors.alcohol ||
      prev.riskFactors.ultraprocessed !== draft.riskFactors.ultraprocessed
    );
  }, [draft, submittedPlan]);

  const handleGenerate = () => {
    const check = validateProfileDraft(draft);
    if (!check.profile) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setIsGenerating(true);
    const validProfile = check.profile;

    setTimeout(() => {
      const now = new Date();
      const generated = generatePreventiveStudyPlan(validProfile, now);
      setSubmittedPlan({
        profile: validProfile,
        requestDate: now,
        studies: generated,
      });
      setIsGenerating(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 200);
  };

  const rollingMonths = useMemo(() => {
    if (!submittedPlan) return [];
    return getRollingMonths(submittedPlan.requestDate, submittedPlan.profile.timeZone);
  }, [submittedPlan]);

  const events = useMemo(
    () => (submittedPlan ? submittedPlan.studies.map((s) => s.event) : []),
    [submittedPlan]
  );

  const activeFactorsCount = useMemo(
    () => (submittedPlan ? getActiveRiskFactorKeys(submittedPlan.profile).length : 0),
    [submittedPlan]
  );

  const monthsCoveredCount = useMemo(
    () => new Set(events.map((e) => e.start.dateTime.slice(0, 7))).size,
    [events]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#F68B1F]/20 selection:text-[#00529B]">
      {/* Top Header - UNITEC Aesthetic */}
      <Header
        onOpenEmail={() => setIsEmailModalOpen(true)}
        showEmailButton={Boolean(submittedPlan)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile and Settings Panel */}
        <ProfileForm
          profile={draft}
          onChange={(updatedDraft) => {
            setDraft(updatedDraft);
          }}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          errors={visibleErrors}
          hasPendingChanges={hasPendingChanges}
        />

        {!submittedPlan ? (
          <div className="bg-white border border-dashed border-[#006FBA]/25 rounded-3xl p-8 sm:p-10 text-center shadow-[0_8px_30px_rgba(0,111,186,0.04)]">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#006FBA]/10 text-[#006FBA] flex items-center justify-center mb-3.5">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#003865] tracking-tight">
              Tu plan preventivo aparecerá aquí
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1.5 leading-relaxed">
              Completa tu edad, sexo y nivel de actividad física, selecciona las acciones que realizas y presiona{' '}
              <strong className="text-[#D56B02]">«Quiero mi plan preventivo anual»</strong> para calcular tus estudios y calendario personalizado.
            </p>
          </div>
        ) : (
          <div ref={resultsRef} className="space-y-8 scroll-mt-6">
            {/* Stats Summary Strip - 3 Focused UNITEC Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,111,186,0.06)] hover:shadow-[0_16px_35px_rgba(0,111,186,0.12)] hover:-translate-y-1 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#006FBA] font-bold uppercase tracking-wider">
                    Estudios Recomendados
                  </div>
                  <div className="text-2xl font-extrabold text-[#003865] mt-1">
                    {submittedPlan.studies.length}
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[#006FBA]/10 border border-[#006FBA]/20 flex items-center justify-center text-[#006FBA]">
                  <Stethoscope className="w-5 h-5 text-[#006FBA]" />
                </div>
              </div>

              <div className="bg-white border border-[#F68B1F]/25 rounded-3xl p-5 shadow-[0_10px_30px_rgba(246,139,31,0.08)] hover:shadow-[0_16px_35px_rgba(246,139,31,0.16)] hover:-translate-y-1 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#D56B02] font-bold uppercase tracking-wider">
                    Factores Evaluados Activos
                  </div>
                  <div className="text-2xl font-extrabold text-[#D56B02] mt-1">
                    {activeFactorsCount} <span className="text-xs font-semibold text-slate-400">/ 5</span>
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[#F68B1F]/10 border border-[#F68B1F]/25 flex items-center justify-center text-[#F68B1F]">
                  <ShieldAlert className="w-5 h-5 text-[#F68B1F]" />
                </div>
              </div>

              <div className="bg-white border border-[#006FBA]/15 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,111,186,0.06)] hover:shadow-[0_16px_35px_rgba(0,111,186,0.12)] hover:-translate-y-1 transition-all flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Meses con Citas
                  </div>
                  <div className="text-2xl font-extrabold text-[#003865] mt-1">
                    {monthsCoveredCount} <span className="text-xs font-semibold text-slate-400">/ 12</span>
                  </div>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[#006FBA]/10 border border-[#006FBA]/15 flex items-center justify-center text-[#006FBA]">
                  <Calendar className="w-5 h-5 text-[#006FBA]" />
                </div>
              </div>
            </div>

            {/* 1. SECCIÓN: Estudios Recomendados con Descripciones y Preparación de la Matriz */}
            <section>
              <RecommendedStudiesSection studies={submittedPlan.studies} />
            </section>

            {/* 2. SECCIÓN: Plan Preventivo Anual - Distribución Mes a Mes */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-[#003865] tracking-tight">
                    Calendario anual personalizado
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Distribución estratégica mes a mes de tus estudios y valoraciones preventivas.
                  </p>
                </div>
              </div>

              <MonthDistribution events={events} rollingMonths={rollingMonths} />
            </section>

            {/* 3. SECCIÓN FINAL: Botón y herramienta para exportar todo a calendario */}
            <section>
              <ExportCalendarFooter
                events={events}
                profile={submittedPlan.profile}
                requestDate={submittedPlan.requestDate}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer UNITEC */}
      <footer className="border-t border-[#006FBA]/15 bg-white py-8 text-center text-xs text-slate-500 mt-16 shadow-[0_-4px_25px_rgba(0,111,186,0.03)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 font-medium">
          <span className="font-extrabold text-[#003865]">Prevención UNITEC</span>
          <span>·</span>
          <span>Plan médico preventivo anual</span>
        </div>
      </footer>

      {/* Email Modal */}
      {submittedPlan && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          profile={submittedPlan.profile}
          events={events}
        />
      )}
    </div>
  );
}
