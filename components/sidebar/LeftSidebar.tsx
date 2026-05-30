'use client';

import { useState, useRef } from 'react';
import { Upload, Layers, Grid3x3, Palette } from 'lucide-react';
import { LayerPanel } from './LayerPanel';
import { ColorPalette } from './ColorPalette';

type Tab = 'layers' | 'assets' | 'colors';

interface LeftSidebarProps {
  onImageUpload?: (file: File) => void;
  isAnalyzing?: boolean;
}

export const LeftSidebar = ({ onImageUpload, isAnalyzing = false }: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('layers');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (!file.type.startsWith('image/')) {
        console.error('[v0] File must be an image');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        console.error('[v0] File size exceeds 50MB limit');
        return;
      }
      onImageUpload?.(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-neutral-600');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-neutral-600');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-neutral-600');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (!file.type.startsWith('image/')) {
        console.error('[v0] File must be an image');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        console.error('[v0] File size exceeds 50MB limit');
        return;
      }
      onImageUpload?.(file);
    }
  };

  return (
    <div className="w-72 bg-neutral-800 border-r border-neutral-700 flex flex-col h-full">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileClick}
        className="p-4 border-b border-neutral-700 bg-neutral-750 hover:bg-neutral-700 transition-colors cursor-pointer rounded-lg m-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload size={24} className="text-blue-400" />
          <div className="text-center">
            <p className="text-sm font-medium">Upload Image</p>
            <p className="text-xs text-neutral-400">PNG, JPG, WebP</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
            activeTab === 'layers'
              ? 'bg-neutral-700 text-blue-400 border-b-2 border-blue-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers size={16} />
          <span className="text-sm">Layers</span>
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
            activeTab === 'assets'
              ? 'bg-neutral-700 text-blue-400 border-b-2 border-blue-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Grid3x3 size={16} />
          <span className="text-sm">Assets</span>
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-colors ${
            activeTab === 'colors'
              ? 'bg-neutral-700 text-blue-400 border-b-2 border-blue-400'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Palette size={16} />
          <span className="text-sm">Colors</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'layers' && <LayerPanel />}
        {activeTab === 'colors' && <ColorPalette />}
        {activeTab === 'assets' && (
          <div className="p-4 text-neutral-400 text-sm">
            <p>No assets uploaded yet.</p>
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className="p-4 border-t border-neutral-700 bg-neutral-750">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm text-neutral-300">Analyzing image...</span>
          </div>
        </div>
      )}
    </div>
  );
};
