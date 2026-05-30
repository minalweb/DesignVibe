'use client';

import { useState } from 'react';
import { X, Download, FileJson, FileImage } from 'lucide-react';
import { exportToPNG, exportToSVG, exportToJSON, ExportFormat } from '@/lib/canvas/export-manager';
import { useLayers } from '@/hooks/useLayers';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas?: any;
}

export const ExportModal = ({ isOpen, onClose, canvas }: ExportModalProps) => {
  const { layers } = useLayers();
  const [selectedFormats, setSelectedFormats] = useState<ExportFormat[]>(['png']);
  const [filename, setFilename] = useState('design');
  const [isExporting, setIsExporting] = useState(false);

  const handleFormatToggle = (format: ExportFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleExport = async () => {
    try {
      if (!filename.trim()) {
        toast.error('Please enter a filename');
        return;
      }

      // Sanitize filename
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 255);

      setIsExporting(true);

      for (const format of selectedFormats) {
        try {
          switch (format) {
            case 'png':
              if (canvas) {
                await exportToPNG(canvas, `${sanitizedFilename}.png`);
                toast.success('PNG exported!');
              }
              break;
            case 'svg':
              if (canvas) {
                await exportToSVG(canvas, `${sanitizedFilename}.svg`);
                toast.success('SVG exported!');
              }
              break;
            case 'json':
              await exportToJSON(layers, `${sanitizedFilename}.json`);
              toast.success('JSON exported!');
              break;
          }
        } catch (formatError) {
          console.error(`[v0] Failed to export ${format}:`, formatError);
          toast.error(`Failed to export ${format.toUpperCase()}`);
        }
      }

      onClose();
    } catch (error) {
      console.error('[v0] Export error:', error);
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-50">Export Design</h2>
          <button onClick={onClose} className="p-1 hover:bg-neutral-700 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filename */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Filename</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="design"
          />
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-3">Export Format</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFormats.includes('png')}
                onChange={() => handleFormatToggle('png')}
                className="w-4 h-4 rounded"
              />
              <div className="flex items-center gap-2 flex-1">
                <FileImage size={16} className="text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-50">PNG Image</p>
                  <p className="text-xs text-neutral-400">Raster format for web and print</p>
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFormats.includes('svg')}
                onChange={() => handleFormatToggle('svg')}
                className="w-4 h-4 rounded"
              />
              <div className="flex items-center gap-2 flex-1">
                <FileImage size={16} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-50">SVG Vector</p>
                  <p className="text-xs text-neutral-400">Scalable format for all sizes</p>
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFormats.includes('json')}
                onChange={() => handleFormatToggle('json')}
                className="w-4 h-4 rounded"
              />
              <div className="flex items-center gap-2 flex-1">
                <FileJson size={16} className="text-green-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-50">Project JSON</p>
                  <p className="text-xs text-neutral-400">Editable project file</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedFormats.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed rounded transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
