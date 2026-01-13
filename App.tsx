
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeDocumentForErrors } from './services/geminiService';
import { AnalysisResponse, AnalysisFile } from './types';

const App: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<AnalysisFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelection = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const mimeType = file.type;

      setCurrentFile({ file, preview: base64, mimeType });

      try {
        const base64Content = base64.split(',')[1];
        const result = await analyzeDocumentForErrors(base64Content, mimeType);
        setAnalysisResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro ao analisar o documento.");
        setCurrentFile(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.onerror = () => {
      setError("Falha ao ler o arquivo. Tente novamente.");
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setCurrentFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="space-y-12">
        {!analysisResult && !isAnalyzing && !error && (
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/logo-3d.png"
                alt="Revisor AeC Logo 3D"
                className="w-48 md:w-64 h-auto animate-[bounce_3s_infinite] drop-shadow-2xl hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A perfeição do seu texto, <br />
              <span className="text-gradient">direto da imagem ou PDF.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Carregue artes, documentos ou fotos. Nossa IA identifica erros gramaticais e sugere melhorias instantâneas com a precisão AeC.
            </p>
          </div>
        )}

        <section className="max-w-4xl mx-auto w-full">
          {error ? (
            <div className="bg-white border-2 border-red-100 rounded-2xl p-8 shadow-xl shadow-red-50 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Ops! Algo deu errado</h3>
                  <p className="text-slate-600 max-w-md mx-auto">{error}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="px-8 py-3 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          ) : !analysisResult ? (
            <div className="space-y-6">
              <ImageUploader onFileSelected={handleFileSelection} isLoading={isAnalyzing} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-[4.5rem] z-40">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700">Relatório de Qualidade</span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-cobalto transition-colors flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  <span>Nova Análise</span>
                </button>
              </div>

              <AnalysisResult
                data={analysisResult}
                filePreview={currentFile?.preview || ''}
                mimeType={currentFile?.mimeType || ''}
                fileName={currentFile?.file.name || ''}
              />
            </div>
          )}
        </section>

        {!analysisResult && !isAnalyzing && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-ceu/50 transition-colors group">
              <div className="w-12 h-12 bg-cobalto/10 text-cobalto rounded-lg flex items-center justify-center mb-4 group-hover:bg-cobalto group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Ortografia</h4>
              <p className="text-sm text-slate-500">Detectamos erros de digitação e acentuação com precisão cirúrgica.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-ceu/50 transition-colors group">
              <div className="w-12 h-12 bg-cobalto/10 text-cobalto rounded-lg flex items-center justify-center mb-4 group-hover:bg-cobalto group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Velocidade</h4>
              <p className="text-sm text-slate-500">Análise em tempo real processada pela nuvem Revisor AeC.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-ceu/50 transition-colors group">
              <div className="w-12 h-12 bg-cobalto/10 text-cobalto rounded-lg flex items-center justify-center mb-4 group-hover:bg-cobalto group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0 118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Contexto</h4>
              <p className="text-sm text-slate-500">Entendemos o uso da linguagem para sugerir a melhor forma de expressão.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;