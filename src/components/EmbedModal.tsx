/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Copy, Check, X, ExternalLink, Globe, Monitor } from 'lucide-react';
import { copyToClipboardSafe } from '../utils/exportCalendar.ts';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [embedHeight, setEmbedHeight] = useState('850');

  if (!isOpen) return null;

  const appUrl =
    typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://ais-pre-wg2b2yohilua4m6t3kuq2v-190872859016.us-east1.run.app';

  const iframeSnippet = `<!-- PreventiCal: Plan Médico Preventivo Interactivo -->
<iframe
  src="${appUrl}"
  title="PreventiCal - Plan Preventivo Google Calendar"
  width="100%"
  height="${embedHeight}px"
  style="border: 2px solid #ef4444; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const handleCopyIframe = async () => {
    await copyToClipboardSafe(iframeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUrl = async () => {
    await copyToClipboardSafe(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-2 border-red-500 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Insertar en tu Página Web (Embed iFrame)</h3>
              <p className="text-xs text-slate-500">Integra este interactivo fácilmente en cualquier sitio web o portal médico</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Direct URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-red-600" />
              URL Pública de la Aplicación
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-red-700 focus:outline-none select-all font-semibold"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3.5 py-2 bg-white hover:bg-red-50 text-slate-700 border border-red-300 rounded-xl font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedUrl ? '¡Copiada!' : 'Copiar URL'}</span>
              </button>
            </div>
          </div>

          {/* Embed Code HTML */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-red-600" />
                Código HTML para Pegar en tu Web (&lt;iframe&gt;)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Altura:</span>
                <select
                  value={embedHeight}
                  onChange={(e) => setEmbedHeight(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 text-[11px] text-slate-700 font-semibold"
                >
                  <option value="650">650 px (Compacto)</option>
                  <option value="850">850 px (Estándar)</option>
                  <option value="1000">1000 px (Extendido)</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 border-2 border-red-500 rounded-xl p-3.5 text-[11px] font-mono text-slate-100 overflow-x-auto leading-relaxed shadow-inner">
                {iframeSnippet}
              </pre>
              <button
                type="button"
                onClick={handleCopyIframe}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '¡Código Copiado!' : 'Copiar Código HTML'}</span>
              </button>
            </div>
          </div>

          {/* CMS Instructions */}
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>📋</span> ¿Cómo insertarlo en tu plataforma?
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600 leading-normal list-disc list-inside font-medium">
              <li>
                <strong className="text-slate-900">WordPress:</strong> Añade un bloque de tipo <em>"HTML Personalizado"</em> y pega el código anterior.
              </li>
              <li>
                <strong className="text-slate-900">Webflow / Wix / Squarespace:</strong> Inserta un elemento de tipo <em>"Embed / Código Embebido"</em>.
              </li>
              <li>
                <strong className="text-slate-900">Moodle o Canvas LMS:</strong> En el editor de contenido, pulsa el botón de vista HTML (<code>&lt;/&gt;</code>) y pega el iframe.
              </li>
              <li>
                <strong className="text-slate-900">Web en HTML o React:</strong> Inserta la etiqueta directamente en tu layout.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-red-100 bg-slate-50 flex items-center justify-between">
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir en nueva pestaña</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer shadow-sm"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
