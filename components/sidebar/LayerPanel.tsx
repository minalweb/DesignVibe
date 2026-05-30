'use client';

import { useState } from 'react';
import { useLayers } from '@/hooks/useLayers';
import { useLayerStore } from '@/store/layer.store';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy } from 'lucide-react';

export const LayerPanel = () => {
  const { layers, removeLayer, changeLayer, toggleLayerVisibility, toggleLayerLock, duplicateSelected } = useLayers();
  const { activeLayerId, selectedLayerIds } = useLayerStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const handleLayerClick = (id: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      useLayerStore.setState((state) => ({
        selectedLayerIds: state.selectedLayerIds.includes(id)
          ? state.selectedLayerIds.filter((lid) => lid !== id)
          : [...state.selectedLayerIds, id],
      }));
    } else {
      // Single select
      useLayerStore.setState({ selectedLayerIds: [id], activeLayerId: id });
    }
  };

  const handleNameChange = (id: string, newName: string) => {
    changeLayer(id, { name: newName });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      {sortedLayers.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 text-sm">
          No layers yet. Upload an image to get started.
        </div>
      ) : (
        sortedLayers.map((layer) => (
          <div
            key={layer.id}
            onClick={(e) => handleLayerClick(layer.id, e)}
            className={`group p-2 rounded-lg cursor-pointer transition-colors ${
              activeLayerId === layer.id
                ? 'bg-blue-600 bg-opacity-30 border border-blue-500'
                : 'bg-neutral-700 hover:bg-neutral-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerVisibility(layer.id);
                }}
                className="p-1 rounded hover:bg-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              {/* Lock Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerLock(layer.id);
                }}
                className="p-1 rounded hover:bg-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>

              {/* Layer Name */}
              <div className="flex-1 min-w-0">
                {editingId === layer.id ? (
                  <input
                    autoFocus
                    value={layer.name}
                    onChange={(e) => {
                      e.stopPropagation();
                      changeLayer(layer.id, { name: e.target.value });
                    }}
                    onBlur={(e) => {
                      handleNameChange(layer.id, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        handleNameChange(layer.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                    className="w-full px-2 py-1 bg-neutral-600 rounded text-sm text-neutral-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(layer.id);
                    }}
                    className="text-sm truncate"
                  >
                    {layer.name}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSelected();
                  }}
                  className="p-1 rounded hover:bg-neutral-600"
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  className="p-1 rounded hover:bg-red-600 hover:bg-opacity-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
