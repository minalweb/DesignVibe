'use client';

import { useCallback, useState } from 'react';
import { useHistory } from '@/hooks/useHistory';
import { useEditorStore } from '@/store/editor.store';
import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Download,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreVertical,
} from 'lucide-react';

interface ToolbarProps {
  onZoom?: (zoom: number) => void;
  onExport?: () => void;
  currentZoom?: number;
}

export const Toolbar = ({ onZoom, onExport, currentZoom = 100 }: ToolbarProps) => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const [zoom, setZoom] = useState(currentZoom);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    onZoom?.(newZoom / 100);
  }, [zoom, onZoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    onZoom?.(newZoom / 100);
  }, [zoom, onZoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
    onZoom?.(1);
  }, [onZoom]);

  return (
    <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center px-4 gap-4">
      {/* Undo/Redo */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="w-px h-8 bg-neutral-700" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded hover:bg-neutral-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <input
          type="number"
          value={zoom}
          onChange={(e) => {
            const val = Math.max(50, Math.min(200, parseInt(e.target.value) || 100));
            setZoom(val);
            onZoom?.(val / 100);
          }}
          className="w-16 px-2 py-1 bg-neutral-700 rounded text-sm text-center text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-neutral-400">%</span>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded hover:bg-neutral-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomReset}
          className="text-xs px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="w-px h-8 bg-neutral-700" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded hover:bg-neutral-700 transition-colors" title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button className="p-2 rounded hover:bg-neutral-700 transition-colors" title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button className="p-2 rounded hover:bg-neutral-700 transition-colors" title="Align Right">
          <AlignRight size={18} />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        title="Export (Ctrl+E)"
      >
        <Download size={18} />
        <span className="text-sm font-medium">Export</span>
      </button>
    </div>
  );
};
