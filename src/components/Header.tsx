/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenEmail: () => void;
  showEmailButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEmail, showEmailButton = true }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#006FBA]/10 shadow-[0_4px_25px_rgba(0,111,186,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          {/* UNITEC Emblem Icon with gradient Azul & Naranja */}
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#006FBA] via-[#00529B] to-[#0A2540] flex items-center justify-center text-white shadow-lg shadow-[#006FBA]/25 ring-2 ring-[#006FBA]/20 shrink-0 relative overflow-hidden group">
            <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#F68B1F] rounded-full blur-[6px] opacity-75"></div>
            <Shield className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#003865] tracking-tight">
              Prevención UNITEC
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Plan médico preventivo anual
            </p>
          </div>
        </div>

        {/* Action: Enviar por email in aesthetic UNITEC button */}
        {showEmailButton && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenEmail}
              title="Enviar resumen del plan preventivo por correo electrónico"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F68B1F] to-[#E07208] hover:from-[#FA9938] hover:to-[#EB7D15] text-white text-xs font-bold shadow-md shadow-[#F68B1F]/30 hover:shadow-lg hover:shadow-[#F68B1F]/40 active:scale-95 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Enviar por email</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
