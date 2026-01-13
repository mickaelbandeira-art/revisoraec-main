
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      onFileSelected(file);
    }
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ${
        isLoading ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-300 hover:border-ceu hover:bg-ceu/5'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-5">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all shadow-md ${
          isLoading ? 'bg-slate-200 text-slate-400' : 'bg-cobalto text-white group-hover:bg-ceu'
        }`}>
          {isLoading ? (
            <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          )}
        </div>
        
        <div>
          <p className="text-xl font-bold text-slate-900">
            {isLoading ? 'Analisando documento...' : 'Arraste uma Imagem ou PDF'}
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
            Processamos artes ou documentos PDF para encontrar erros gramaticais instantaneamente.
          </p>
        </div>

        {!isLoading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-8 py-3 bg-cobalto text-white font-bold rounded-xl hover:bg-ceu transition-all shadow-lg shadow-cobalto/20 active:scale-95"
          >
            Escolher Arquivo
          </button>
        )}
      </div>
    </div>
  );
};
