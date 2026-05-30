'use client';

import { useEditorStore } from '@/store/editor.store';

export const LoadingOverlay = () => {
  const { isAnalyzing, analysisProgress } = useEditorStore();

  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-8 max-w-sm w-full mx-4 border border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-50 mb-4">Analyzing Image</h2>
        
        {/* Progress Bar */}
        <div className="w-full bg-neutral-700 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <span>Processing...</span>
          <span className="font-medium">{Math.round(analysisProgress)}%</span>
        </div>

        {/* Status Messages */}
        <div className="mt-4 space-y-2 text-sm text-neutral-300">
          <div className={`flex items-center gap-2 ${analysisProgress >= 10 ? 'text-green-400' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${analysisProgress >= 10 ? 'bg-green-400' : 'bg-neutral-500'}`} />
            <span>Loading image</span>
          </div>
          <div className={`flex items-center gap-2 ${analysisProgress >= 30 ? 'text-green-400' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${analysisProgress >= 30 ? 'bg-green-400' : 'bg-neutral-500'}`} />
            <span>Extracting colors</span>
          </div>
          <div className={`flex items-center gap-2 ${analysisProgress >= 60 ? 'text-green-400' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${analysisProgress >= 60 ? 'bg-green-400' : 'bg-neutral-500'}`} />
            <span>Detecting text</span>
          </div>
          <div className={`flex items-center gap-2 ${analysisProgress >= 80 ? 'text-green-400' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${analysisProgress >= 80 ? 'bg-green-400' : 'bg-neutral-500'}`} />
            <span>Detecting shapes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
