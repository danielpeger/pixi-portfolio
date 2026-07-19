import type { Text } from "pixi.js";

export type LocalBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Obb = {
  cx: number;
  cy: number;
  axX: number;
  axY: number;
  ayX: number;
  ayY: number;
  hw: number;
  hh: number;
};

type AxesCache = {
  rotation: number;
  cos: number;
  sin: number;
};

const axesCache = new WeakMap<Text, AxesCache>();

export function getRotationAxes(sprite: Text) {
  let cache = axesCache.get(sprite);
  if (!cache || cache.rotation !== sprite.rotation) {
    cache = {
      rotation: sprite.rotation,
      cos: Math.cos(sprite.rotation),
      sin: Math.sin(sprite.rotation),
    };
    axesCache.set(sprite, cache);
  }
  return cache;
}

// Oriented bounding box (OBB) derived from the sprite's local glyph bounds
// plus its rotation, so the collision box tracks the rotated visuals exactly
// instead of using an upright axis-aligned rectangle.
export function getObb(sprite: Text, bounds: LocalBounds): Obb {
  const { cos, sin } = getRotationAxes(sprite);
  const localCenterX = bounds.x + bounds.width / 2;
  const localCenterY = bounds.y + bounds.height / 2;
  return {
    cx: sprite.x + cos * localCenterX - sin * localCenterY,
    cy: sprite.y + sin * localCenterX + cos * localCenterY,
    // Local x/y axes expressed in world space.
    axX: cos,
    axY: sin,
    ayX: -sin,
    ayY: cos,
    hw: bounds.width / 2,
    hh: bounds.height / 2,
  };
}

// Separating Axis Theorem between two OBBs. Returns the minimum translation
// vector (unit normal pointing from b toward a) and the penetration depth,
// or null when they don't overlap.
export function obbCollision(a: Obb, b: Obb) {
  const axes = [
    { x: a.axX, y: a.axY },
    { x: a.ayX, y: a.ayY },
    { x: b.axX, y: b.axY },
    { x: b.ayX, y: b.ayY },
  ];
  const dcx = a.cx - b.cx;
  const dcy = a.cy - b.cy;
  let minOverlap = Infinity;
  let nx = 0;
  let ny = 0;
  for (const axis of axes) {
    const ra =
      Math.abs(a.axX * axis.x + a.axY * axis.y) * a.hw +
      Math.abs(a.ayX * axis.x + a.ayY * axis.y) * a.hh;
    const rb =
      Math.abs(b.axX * axis.x + b.axY * axis.y) * b.hw +
      Math.abs(b.ayX * axis.x + b.ayY * axis.y) * b.hh;
    const centerProj = dcx * axis.x + dcy * axis.y;
    const overlap = ra + rb - Math.abs(centerProj);
    if (overlap <= 0) return null;
    if (overlap < minOverlap) {
      minOverlap = overlap;
      const sign = centerProj < 0 ? -1 : 1;
      nx = axis.x * sign;
      ny = axis.y * sign;
    }
  }
  return { nx, ny, overlap: minOverlap };
}

export function restitutionForSpeed(
  speed: number,
  high: number,
  bounceLow = 0.01,
  bounceFullSpeed = 4,
) {
  const t = Math.min(1, speed / bounceFullSpeed);
  const eased = t * t * (3 - 2 * t);
  return bounceLow + (high - bounceLow) * eased;
}

export function isBodySettled(
  vx: number,
  vy: number,
  x: number,
  y: number,
  targetX: number,
  targetY: number,
) {
  const dx = targetX - x;
  const dy = targetY - y;
  return vx * vx + vy * vy < 0.01 && dx * dx + dy * dy < 0.25;
}
