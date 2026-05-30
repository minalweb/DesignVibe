'use client';

import { useState } from 'react';
import { useEditorStore } from '@/store/editor.store';
import { Copy, Check } from 'lucide-react';

const DEFAULT_COLORS = [
  '#3b82f6',
  '#8b5cf6', 
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#f97316',
  '#64748b',
  '#000000',
  '#ffffff',
];

export const ColorPalette = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-200 mb-3">Color Palette</h3>
        <div className="grid grid-cols-4 gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleCopyColor(color)}
              className="group relative aspect-square rounded-lg border-2 border-neutral-600 hover:border-blue-400 transition-colors overflow-hidden"
              style={{ backgroundColor: color }}
              title={color}
            >
              {copiedColor === color && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 flex items-center justify-center transition-opacity">
                <Copy size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-200 mb-3">Custom Color</h3>
        <div className="flex gap-2">
          <input
            type="color"
            defaultValue="#3b82f6"
            className="flex-1 h-10 rounded cursor-pointer bg-neutral-700 border border-neutral-600"
          />
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors">
            Add
          </button>
        </div>
      </div>

      <div className="text-xs text-neutral-400">
        <p>Click any color to copy its hex code.</p>
      </div>
    </div>
  );
};
