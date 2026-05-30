import { Layer } from '@/types/layer';

export type ExportFormat = 'png' | 'svg' | 'json';

/**
 * Export canvas to PNG
 */
export const exportToPNG = async (
  canvas: any,
  filename = 'design.png',
  quality = 1
): Promise<void> => {
  try {
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality,
    });

    downloadFile(dataUrl, filename);
  } catch (error) {
    console.error('PNG export error:', error);
    throw error;
  }
};

/**
 * Export canvas to SVG
 */
export const exportToSVG = async (
  canvas: any,
  filename = 'design.svg'
): Promise<void> => {
  try {
    const svgString = canvas.toSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    downloadFile(url, filename, true);
  } catch (error) {
    console.error('SVG export error:', error);
    throw error;
  }
};

/**
 * Export layers as JSON
 */
export const exportToJSON = async (
  layers: Layer[],
  filename = 'design.json'
): Promise<void> => {
  try {
    const json = JSON.stringify(
      {
        version: '1.0',
        timestamp: new Date().toISOString(),
        layers,
      },
      null,
      2
    );

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadFile(url, filename, true);
  } catch (error) {
    console.error('JSON export error:', error);
    throw error;
  }
};

/**
 * Export canvas as multiple formats
 */
export const exportAsMultiple = async (
  canvas: any,
  layers: Layer[],
  formats: ExportFormat[],
  basename = 'design'
): Promise<void> => {
  try {
    for (const format of formats) {
      switch (format) {
        case 'png':
          await exportToPNG(canvas, `${basename}.png`);
          break;
        case 'svg':
          await exportToSVG(canvas, `${basename}.svg`);
          break;
        case 'json':
          await exportToJSON(layers, `${basename}.json`);
          break;
      }
    }
  } catch (error) {
    console.error('Multi-format export error:', error);
    throw error;
  }
};

/**
 * Generate a download link and trigger download
 */
const downloadFile = (dataUrl: string, filename: string, isBlob = false) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up blob URL if needed
  if (isBlob) {
    setTimeout(() => {
      URL.revokeObjectURL(dataUrl);
    }, 100);
  }
};

/**
 * Export canvas dimensions
 */
export const getCanvasDimensions = (canvas: any) => {
  return {
    width: canvas.width || 1200,
    height: canvas.height || 800,
  };
};

/**
 * Create a preview image from canvas
 */
export const createPreview = async (
  canvas: any,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<string> => {
  try {
    const sizeMap = {
      small: 0.25,
      medium: 0.5,
      large: 0.75,
    };

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    const scale = sizeMap[size];
    tempCanvas.width = (canvas.width || 1200) * scale;
    tempCanvas.height = (canvas.height || 800) * scale;

    ctx.scale(scale, scale);

    // Draw canvas content
    const dataUrl = canvas.toDataURL();
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve(tempCanvas.toDataURL());
      };
      img.src = dataUrl;
    });
  } catch (error) {
    console.error('Preview creation error:', error);
    throw error;
  }
};
