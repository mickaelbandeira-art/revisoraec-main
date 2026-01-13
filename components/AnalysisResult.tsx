
import React, { useState } from 'react';
import { AnalysisResponse, Correction } from '../types';

interface AnalysisResultProps {
  data: AnalysisResponse;
  filePreview: string;
  mimeType: string;
  fileName: string;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error(err); }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center space-x-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
        copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-cobalto/20'
      }`}
    >
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, filePreview, mimeType, fileName }) => {
  const isPdf = mimeType === 'application/pdf';

  const getSeverityColor = (severity: Correction['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-ceu/10 text-cobalto border-ceu/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Documento Analisado</h3>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg min-h-[300px] flex items-center justify-center">
          {isPdf ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{fileName}</p>
              <p className="text-xs text-slate-400">Análise de PDF concluída</p>
            </div>
          ) : (
            <img src={filePreview} alt="Original" className="w-full h-auto rounded-lg" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Resumo</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              data.hasErrors ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {data.hasErrors ? 'Erros Detectados' : 'Nenhum Erro'}
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">{data.summary}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Correções Sugeridas</h3>
          {data.corrections.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
              <p className="text-emerald-700 font-medium">Parabéns! Texto impecável.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.corrections.map((corr, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-3 inline-block ${getSeverityColor(corr.severity)}`}>
                    {corr.type}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                      <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Original</p>
                      <p className="text-sm text-slate-800 line-through">{corr.originalText}</p>
                    </div>
                    <div className="p-3 bg-cobalto/5 rounded-lg border border-cobalto/10">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-cobalto font-bold uppercase">Sugestão</p>
                        <CopyButton text={corr.correctedText} />
                      </div>
                      <p className="text-sm font-bold text-slate-900">{corr.correctedText}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic"><span className="font-bold">Motivo:</span> {corr.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
