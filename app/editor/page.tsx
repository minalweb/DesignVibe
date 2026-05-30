'use client';

import { useState, useCallback } from 'react';
import { CanvasEditor } from '@/components/editor/CanvasEditor';
import { Toolbar } from '@/components/editor/Toolbar';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { RightSidebar } from '@/components/sidebar/RightSidebar';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { useLayers } from '@/hooks/useLayers';
import { useEditorStore } from '@/store/editor.store';
import { useLayerStore } from '@/store/layer.store';
import { useHistory } from '@/hooks/useHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { analyzeImage } from '@/lib/analysis';
import { ExportModal } from '@/components/modals/ExportModal';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { createNewLayer } = useLayers();
  
  // Set up keyboard shortcuts
  useKeyboardShortcuts();
  const { setAnalyzing, setAnalysisProgress } = useEditorStore();
  const { push } = useHistory();
  const { layers } = useLayers();

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setAnalyzing(true);
        setAnalysisProgress(0);

        // Create image URL
        const imageUrl = URL.createObjectURL(file);

        // Analyze the image
        const { layers } = await analyzeImage(imageUrl, (progress, step) => {
          setAnalysisProgress(progress);
          console.log(`[v0] Analysis progress: ${progress}% - ${step}`);
        });

        // Add all generated layers
        layers.forEach((layer) => {
          useLayerStore.setState((state) => ({
            layers: [...state.layers, layer],
            activeLayerId: layer.id,
          }));
        });

        // Push to history
        push(layers);

        toast.success('Image analyzed successfully!');
        setAnalyzing(false);
      } catch (error) {
        console.error('[v0] Error uploading image:', error);
        toast.error('Failed to upload image');
        setAnalyzing(false);
      }
    },
    [setAnalyzing, setAnalysisProgress, push]
  );

  const handleExport = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  const handleZoom = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-neutral-950 text-neutral-50">
      {/* Header */}
      <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-4">
        <h1 className="text-lg font-bold text-blue-400">DesignVibe</h1>
        <p className="text-sm text-neutral-400">AI-Powered Design Canvas</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar onImageUpload={handleImageUpload} isAnalyzing={useEditorStore((s) => s.isAnalyzing)} />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <Toolbar onZoom={handleZoom} onExport={handleExport} currentZoom={Math.round(currentZoom * 100)} />

          {/* Canvas */}
          <CanvasEditor />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay />

      {/* Export Modal */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
