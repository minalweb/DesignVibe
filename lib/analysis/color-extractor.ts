import { ColorResult } from '@/types/analysis';
import { rgbToHex } from '@/utils/helpers';

/**
 * Extract dominant colors from an image
 */
export const extractColors = async (imageUrl: string, numColors = 8): Promise<ColorResult[]> => {
  try {
    const colors = await getColorsFromImage(imageUrl, numColors);
    return colors;
  } catch (error) {
    console.error('Color extraction error:', error);
    return getDefaultColors();
  }
};

/**
 * Extract colors from image using canvas
 */
const getColorsFromImage = async (imageUrl: string, numColors: number): Promise<ColorResult[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(getDefaultColors());
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample colors from image
      const colors: Array<{ r: number; g: number; b: number }> = [];
      const step = Math.max(1, Math.floor(data.length / (numColors * 4)));

      for (let i = 0; i < data.length; i += step * 4) {
        colors.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        });
      }

      // Group similar colors and get frequency
      const colorMap = new Map<string, number>();
      colors.forEach((color) => {
        const hex = rgbToHex(color.r, color.g, color.b);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      });

      // Sort by frequency and convert to ColorResult
      const results: ColorResult[] = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(([hex, usage], index) => {
          const rgb = parseHex(hex);
          return {
            hex,
            rgb,
            hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
            usage: usage,
          };
        });

      resolve(results.length > 0 ? results : getDefaultColors());
    };

    img.onerror = () => {
      resolve(getDefaultColors());
    };

    img.src = imageUrl;
  });
};

/**
 * Parse hex color to RGB
 */
const parseHex = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Convert RGB to HSV
 */
const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h: h < 0 ? h + 360 : h, s, v };
};

/**
 * Get default color palette
 */
const getDefaultColors = (): ColorResult[] => {
  return [
    { hex: '#3b82f6', rgb: { r: 59, g: 130, b: 246 }, hsv: { h: 217, s: 76, v: 96 }, usage: 100 },
    { hex: '#8b5cf6', rgb: { r: 139, g: 92, b: 246 }, hsv: { h: 259, s: 63, v: 96 }, usage: 80 },
    { hex: '#ec4899', rgb: { r: 236, g: 72, b: 153 }, hsv: { h: 331, s: 69, v: 93 }, usage: 70 },
    { hex: '#f59e0b', rgb: { r: 245, g: 158, b: 11 }, hsv: { h: 38, s: 96, v: 96 }, usage: 60 },
    { hex: '#10b981', rgb: { r: 16, g: 185, b: 129 }, hsv: { h: 160, s: 91, v: 73 }, usage: 50 },
    { hex: '#06b6d4', rgb: { r: 6, g: 182, b: 212 }, hsv: { h: 187, s: 97, v: 83 }, usage: 40 },
    { hex: '#6366f1', rgb: { r: 99, g: 102, b: 241 }, hsv: { h: 239, s: 59, v: 95 }, usage: 30 },
    { hex: '#f97316', rgb: { r: 249, g: 115, b: 22 }, hsv: { h: 25, s: 91, v: 98 }, usage: 20 },
  ];
};
