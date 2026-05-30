import { Layer } from '@/types/layer';
import { TextDetectionResult, ShapeDetectionResult, ColorResult } from '@/types/analysis';
import { generateId } from '@/utils/helpers';

/**
 * Generate layer objects from analysis results
 */
export const generateLayers = (
  textElements: TextDetectionResult[],
  shapes: ShapeDetectionResult[],
  colors: ColorResult[]
): Layer[] => {
  const layers: Layer[] = [];
  let zIndex = 0;

  // Create text layers
  textElements.forEach((text) => {
    const layer: Layer = {
      id: generateId('text'),
      name: `Text - "${text.text.substring(0, 20)}"`,
      position: {
        x: text.boundingBox.x,
        y: text.boundingBox.y,
      },
      dimensions: {
        width: text.boundingBox.width,
        height: text.boundingBox.height,
      },
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      zIndex: zIndex++,
      data: {
        type: 'text',
        content: text.text,
        fontFamily: text.fontFamily || 'Inter',
        fontSize: text.fontSize || 16,
        fontWeight: 400,
        fontStyle: 'normal',
        letterSpacing: 0,
        lineHeight: 1.5,
        textAlign: 'left',
        fill: '#000000',
      },
    };
    layers.push(layer);
  });

  // Create shape layers
  shapes.forEach((shape) => {
    const layer: Layer = {
      id: generateId('shape'),
      name: `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)} Shape`,
      position: {
        x: shape.boundingBox.x,
        y: shape.boundingBox.y,
      },
      dimensions: {
        width: shape.boundingBox.width,
        height: shape.boundingBox.height,
      },
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      zIndex: zIndex++,
      data: {
        type: 'shape',
        shapeType: shape.type,
        fill: shape.fill || colors[zIndex % colors.length]?.hex || '#3b82f6',
        stroke: shape.stroke || '#000000',
        strokeWidth: 2,
        opacity: 1,
      },
    };
    layers.push(layer);
  });

  return layers;
};

/**
 * Generate a color swatch layer for each dominant color
 */
export const generateColorSwatches = (colors: ColorResult[]): Layer[] => {
  const swatches: Layer[] = [];
  const swatchSize = 60;
  const spacing = 10;
  let xPos = 20;

  colors.forEach((color, index) => {
    const layer: Layer = {
      id: generateId('color-swatch'),
      name: `Color - ${color.hex}`,
      position: {
        x: xPos,
        y: 20,
      },
      dimensions: {
        width: swatchSize,
        height: swatchSize,
      },
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      zIndex: 1000 + index,
      data: {
        type: 'shape',
        shapeType: 'rectangle',
        fill: color.hex,
        stroke: '#333333',
        strokeWidth: 1,
        opacity: 1,
      },
    };
    swatches.push(layer);
    xPos += swatchSize + spacing;
  });

  return swatches;
};
