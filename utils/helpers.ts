import { Layer } from '@/types/layer';

/**
 * Generate unique ID for layers
 */
export const generateId = (prefix = 'layer'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if point is inside bounding box
 */
export const isPointInBox = (
  point: { x: number; y: number },
  box: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
};

/**
 * Calculate bounding box for multiple objects
 */
export const calculateBoundingBox = (
  objects: Array<{ position: { x: number; y: number }; dimensions: { width: number; height: number } }>
) => {
  if (objects.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = objects[0].position.x;
  let minY = objects[0].position.y;
  let maxX = objects[0].position.x + objects[0].dimensions.width;
  let maxY = objects[0].position.y + objects[0].dimensions.height;

  objects.forEach((obj) => {
    minX = Math.min(minX, obj.position.x);
    minY = Math.min(minY, obj.position.y);
    maxX = Math.max(maxX, obj.position.x + obj.dimensions.width);
    maxY = Math.max(maxY, obj.position.y + obj.dimensions.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * Snap value to grid
 */
export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Check if two boxes overlap
 */
export const doBoxesOverlap = (
  box1: { x: number; y: number; width: number; height: number },
  box2: { x: number; y: number; width: number; height: number }
): boolean => {
  return !(
    box1.x + box1.width < box2.x ||
    box2.x + box2.width < box1.x ||
    box1.y + box1.height < box2.y ||
    box2.y + box2.height < box1.y
  );
};

/**
 * Convert RGB to Hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join('')}`;
};

/**
 * Convert Hex to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Wait for specified milliseconds
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
