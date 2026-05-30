'use client';

import { useLayers } from '@/hooks/useLayers';
import { useLayerStore } from '@/store/layer.store';

export const RightSidebar = () => {
  const { getLayer, changeLayer } = useLayers();
  const { activeLayerId } = useLayerStore();
  const layer = activeLayerId ? getLayer(activeLayerId) : null;

  if (!layer) {
    return (
      <div className="w-72 bg-neutral-800 border-l border-neutral-700 flex items-center justify-center text-neutral-400">
        <p className="text-sm">Select a layer to edit properties</p>
      </div>
    );
  }

  const handlePositionChange = (key: 'x' | 'y', value: number) => {
    changeLayer(layer.id, {
      position: { ...layer.position, [key]: value },
    });
  };

  const handleDimensionsChange = (key: 'width' | 'height', value: number) => {
    changeLayer(layer.id, {
      dimensions: { ...layer.dimensions, [key]: Math.max(1, value) },
    });
  };

  const handleRotationChange = (value: number) => {
    changeLayer(layer.id, { rotation: value });
  };

  const handleOpacityChange = (value: number) => {
    changeLayer(layer.id, { opacity: Math.max(0, Math.min(1, value)) });
  };

  return (
    <div className="w-72 bg-neutral-800 border-l border-neutral-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Layer Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">Name</label>
          <input
            type="text"
            value={layer.name}
            onChange={(e) => changeLayer(layer.id, { name: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-neutral-400">X</label>
              <input
                type="number"
                value={Math.round(layer.position.x)}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Y</label>
              <input
                type="number"
                value={Math.round(layer.position.y)}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-neutral-400">Width</label>
              <input
                type="number"
                value={Math.round(layer.dimensions.width)}
                onChange={(e) => handleDimensionsChange('width', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400">Height</label>
              <input
                type="number"
                value={Math.round(layer.dimensions.height)}
                onChange={(e) => handleDimensionsChange('height', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">
            Rotation: {Math.round(layer.rotation)}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={layer.rotation}
            onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">
            Opacity: {Math.round(layer.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={layer.opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Shape-specific properties */}
        {layer.data.type === 'shape' && (
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">Fill Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(layer.data as any).fill}
                onChange={(e) => {
                  changeLayer(layer.id, {
                    data: { ...(layer.data as any), fill: e.target.value },
                  });
                }}
                className="flex-1 h-10 rounded cursor-pointer bg-neutral-700 border border-neutral-600"
              />
              <span className="text-xs text-neutral-400 flex items-center">{(layer.data as any).fill}</span>
            </div>
          </div>
        )}

        {/* Text-specific properties */}
        {layer.data.type === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Font Size</label>
              <input
                type="number"
                value={(layer.data as any).fontSize}
                onChange={(e) => {
                  changeLayer(layer.id, {
                    data: { ...(layer.data as any), fontSize: parseFloat(e.target.value) || 16 },
                  });
                }}
                className="w-full px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Text Color</label>
              <input
                type="color"
                value={(layer.data as any).fill}
                onChange={(e) => {
                  changeLayer(layer.id, {
                    data: { ...(layer.data as any), fill: e.target.value },
                  });
                }}
                className="w-full h-10 rounded cursor-pointer bg-neutral-700 border border-neutral-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
