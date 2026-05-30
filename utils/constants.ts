export const EDITOR_CONFIG = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  BACKGROUND_COLOR: '#ffffff',
  GRID_SIZE: 20,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1,
  DEFAULT_FONT_SIZE: 16,
  DEFAULT_FONT_FAMILY: 'Inter',
  SNAP_DISTANCE: 10,
};

export const ANALYSIS_CONFIG = {
  TESSERACT_LANGUAGE: 'eng',
  OCR_THRESHOLD: 0.3,
  SHAPE_MIN_AREA: 100,
  SHAPE_MAX_AREA: 500000,
  COLOR_CLUSTERS: 8,
};

export const KEYBOARD_SHORTCUTS = {
  UNDO: ['ctrl+z', 'cmd+z'],
  REDO: ['ctrl+shift+z', 'cmd+shift+z'],
  DELETE: ['delete', 'backspace'],
  DUPLICATE: ['ctrl+d', 'cmd+d'],
  SELECT_ALL: ['ctrl+a', 'cmd+a'],
  EXPORT: ['ctrl+e', 'cmd+e'],
  COPY: ['ctrl+c', 'cmd+c'],
  PASTE: ['ctrl+v', 'cmd+v'],
};

export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#8b5cf6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  NEUTRAL_50: '#f9fafb',
  NEUTRAL_100: '#f3f4f6',
  NEUTRAL_200: '#e5e7eb',
  NEUTRAL_300: '#d1d5db',
  NEUTRAL_400: '#9ca3af',
  NEUTRAL_500: '#6b7280',
  NEUTRAL_600: '#4b5563',
  NEUTRAL_700: '#374151',
  NEUTRAL_800: '#1f2937',
  NEUTRAL_900: '#111827',
};

export const BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
];

export const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Comic Sans MS',
];

export const EXPORT_FORMATS = ['png', 'svg', 'json'] as const;
