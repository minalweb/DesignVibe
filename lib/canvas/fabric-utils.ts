import { Layer } from '@/types/layer';

/**
 * Convert a Layer object to a Fabric object
 */
export const layerToFabricObject = async (layer: Layer, canvas: any) => {
  const fabricModule = await import('fabric');
  const fabric = fabricModule.default || fabricModule;
  const { Text, Rect, Circle, Image, Group } = fabric;
  const { position, dimensions, rotation, opacity, data } = layer;

  let fabricObject;

  if (data.type === 'text') {
    const textData = data;
    fabricObject = new Text(textData.content, {
      left: position.x,
      top: position.y,
      fontSize: textData.fontSize,
      fontFamily: textData.fontFamily,
      fill: textData.fill,
      fontWeight: textData.fontWeight,
      fontStyle: textData.fontStyle,
      textAlign: textData.textAlign,
      lineHeight: textData.lineHeight,
      letterSpacing: textData.letterSpacing,
    });
  } else if (data.type === 'shape') {
    const shapeData = data;
    if (shapeData.shapeType === 'rectangle') {
      fabricObject = new Rect({
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        fill: shapeData.fill,
        stroke: shapeData.stroke,
        strokeWidth: shapeData.strokeWidth,
      });
    } else if (shapeData.shapeType === 'circle') {
      fabricObject = new Circle({
        left: position.x,
        top: position.y,
        radius: Math.min(dimensions.width, dimensions.height) / 2,
        fill: shapeData.fill,
        stroke: shapeData.stroke,
        strokeWidth: shapeData.strokeWidth,
      });
    }
  } else if (data.type === 'image') {
    // Image handling will be more complex
    fabricObject = new Rect({
      left: position.x,
      top: position.y,
      width: dimensions.width,
      height: dimensions.height,
      fill: '#e5e5e5',
      stroke: '#999999',
    });
  }

  if (fabricObject) {
    fabricObject.set({
      opacity,
      angle: rotation,
      evented: true,
      selectable: true,
    });

    // Store layer ID for reference
    (fabricObject as any).layerId = layer.id;
  }

  return fabricObject;
};

/**
 * Convert Fabric object back to Layer
 */
export const fabricObjectToLayer = (obj: any, layer: Layer): Layer => {
  return {
    ...layer,
    position: {
      x: obj.left || 0,
      y: obj.top || 0,
    },
    dimensions: {
      width: (obj.width || 100) * (obj.scaleX || 1),
      height: (obj.height || 100) * (obj.scaleY || 1),
    },
    rotation: obj.angle || 0,
    opacity: obj.opacity || 1,
  };
};

/**
 * Get bounding box of Fabric object
 */
export const getBoundingBox = (obj: any) => {
  return {
    x: obj.left || 0,
    y: obj.top || 0,
    width: (obj.width || 100) * (obj.scaleX || 1),
    height: (obj.height || 100) * (obj.scaleY || 1),
  };
};

/**
 * Align objects horizontally
 */
export const alignObjectsHorizontally = (objects: any[], alignType: 'left' | 'center' | 'right') => {
  if (objects.length === 0) return;

  const positions = objects.map((obj) => obj.left || 0);

  let targetX = 0;
  if (alignType === 'left') {
    targetX = Math.min(...positions);
  } else if (alignType === 'center') {
    const centerPositions = objects.map((obj) => (obj.left || 0) + (obj.width || 100) / 2);
    targetX = (Math.min(...centerPositions) + Math.max(...centerPositions)) / 2;
  } else if (alignType === 'right') {
    const rightPositions = objects.map((obj) => (obj.left || 0) + (obj.width || 100));
    targetX = Math.max(...rightPositions);
  }

  objects.forEach((obj) => {
    if (alignType === 'left') {
      obj.set({ left: targetX });
    } else if (alignType === 'center') {
      obj.set({ left: targetX - (obj.width || 100) / 2 });
    } else if (alignType === 'right') {
      obj.set({ left: targetX - (obj.width || 100) });
    }
  });
};

/**
 * Distribute objects evenly
 */
export const distributeObjects = (objects: any[], direction: 'horizontal' | 'vertical') => {
  if (objects.length < 3) return;

  const sorted = direction === 'horizontal'
    ? [...objects].sort((a, b) => (a.left || 0) - (b.left || 0))
    : [...objects].sort((a, b) => (a.top || 0) - (b.top || 0));

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (direction === 'horizontal') {
    const totalDistance = (last.left || 0) - (first.left || 0);
    const gap = totalDistance / (objects.length - 1);

    sorted.forEach((obj, i) => {
      obj.set({ left: (first.left || 0) + i * gap });
    });
  } else {
    const totalDistance = (last.top || 0) - (first.top || 0);
    const gap = totalDistance / (objects.length - 1);

    sorted.forEach((obj, i) => {
      obj.set({ top: (first.top || 0) + i * gap });
    });
  }
};

/**
 * Clone a Fabric object
 */
export const cloneFabricObject = async (obj: any) => {
  return new Promise((resolve) => {
    obj.clone((cloned: any) => {
      cloned.set({
        left: (obj.left || 0) + 10,
        top: (obj.top || 0) + 10,
      });
      resolve(cloned);
    });
  });
};

/**
 * Serialize canvas to JSON
 */
export const serializeCanvas = (canvas: any) => {
  return canvas.toJSON();
};

/**
 * Deserialize JSON to canvas
 */
export const deserializeCanvas = (canvas: any, json: any) => {
  return new Promise((resolve) => {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      resolve(canvas);
    });
  });
};
