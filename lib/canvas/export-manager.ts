import { Layer } from '@/types/layer';

export type ExportFormat = 'png' | 'svg' | 'json';

/**
 * Sanitize filename for safe download
 */
const sanitizeFilename = (filename: string): string => {
  // Remove path traversal attempts
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    filename = filename.replace(/\.\./g, '').replace(/[/\\]/g, '');
  }
  // Replace unsafe characters
  filename = filename.replace(/[<>:"|?*\x00-\x1f]/g, '_');
  // Limit length
  filename = filename.slice(0, 255);
  // Ensure not empty
  return filename || 'export';
};

/**
 * Validate layer data for export safety
 */
const sanitizeLayerData = (layers: Layer[]): Layer[] => {
  return layers.map((layer) => {
    // Remove blob URLs for image layers to prevent data bloat
    if (layer.data.type === 'image') {
      const imageData = layer.data as any;
      return {
        ...layer,
        data: {
          ...layer.data,
          src: imageData.src?.startsWith('blob:') ? '' : imageData.src,
        } as any,
      };
    }
    return layer;
  });
};

/**
 * Export canvas to PNG
 */
export const exportToPNG = async (
  canvas: any,
  filename = 'design.png',
  quality = 1
): Promise<void> => {
  try {
    if (!canvas) {
      throw new Error('Canvas is required for PNG export');
    }
    if (quality < 0 || quality > 1) {
      throw new Error('Quality must be between 0 and 1');
    }

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality,
    });

    const safeFilename = sanitizeFilename(filename);
    downloadFile(dataUrl, safeFilename);
    console.log('[v0] PNG exported successfully:', safeFilename);
  } catch (error) {
    console.error('[v0] PNG export error:', error);
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
    if (!canvas) {
      throw new Error('Canvas is required for SVG export');
    }

    const svgString = canvas.toSVG();
    if (!svgString || typeof svgString !== 'string') {
      throw new Error('Failed to generate SVG from canvas');
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const safeFilename = sanitizeFilename(filename);
    downloadFile(url, safeFilename, true);
    console.log('[v0] SVG exported successfully:', safeFilename);
  } catch (error) {
    console.error('[v0] SVG export error:', error);
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
    if (!Array.isArray(layers)) {
      throw new Error('Layers must be an array');
    }

    const sanitizedLayers = sanitizeLayerData(layers);

    const json = JSON.stringify(
      {
        version: '1.0',
        timestamp: new Date().toISOString(),
        layers: sanitizedLayers,
      },
      null,
      2
    );

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const safeFilename = sanitizeFilename(filename);
    downloadFile(url, safeFilename, true);
    console.log('[v0] JSON exported successfully:', safeFilename);
  } catch (error) {
    console.error('[v0] JSON export error:', error);
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
    if (!canvas) {
      throw new Error('Canvas is required for export');
    }
    if (!Array.isArray(formats) || formats.length === 0) {
      throw new Error('At least one export format must be specified');
    }

    const safeBasename = sanitizeFilename(basename);

    for (const format of formats) {
      try {
        switch (format) {
          case 'png':
            await exportToPNG(canvas, `${safeBasename}.png`);
            break;
          case 'svg':
            await exportToSVG(canvas, `${safeBasename}.svg`);
            break;
          case 'json':
            await exportToJSON(layers, `${safeBasename}.json`);
            break;
          default:
            console.warn(`[v0] Unsupported format: ${format}`);
        }
      } catch (formatError) {
        console.warn(`[v0] Failed to export ${format}:`, formatError);
      }
    }
  } catch (error) {
    console.error('[v0] Multi-format export error:', error);
    throw error;
  }
};

/**
 * Generate a download link and trigger download
 */
const downloadFile = (dataUrl: string, filename: string, isBlob = false) => {
  try {
    if (!dataUrl || typeof dataUrl !== 'string') {
      throw new Error('Invalid data URL');
    }
    if (!filename || typeof filename !== 'string') {
      throw new Error('Invalid filename');
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL if needed
    if (isBlob) {
      setTimeout(() => {
        try {
          URL.revokeObjectURL(dataUrl);
        } catch (err) {
          console.warn('[v0] Failed to revoke object URL:', err);
        }
      }, 100);
    }
  } catch (error) {
    console.error('[v0] Download error:', error);
    throw error;
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
