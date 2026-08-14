const MD_BREAKPOINT = 768;

function isMobileViewport(viewportWidth: number) {
  return viewportWidth < MD_BREAKPOINT;
}

export function scaleFontSize(viewportWidth: number): number {
  // Single-column layout: scales up to the md breakpoint.
  if (isMobileViewport(viewportWidth)) {
    if (viewportWidth <= 320) return 66;
    const t = (viewportWidth - 320) / (MD_BREAKPOINT - 320);
    return 66 + (114 - 66) * t;
  }

  // Two-column layout: resets at md, then scales 66 -> 90 by 1152.
  if (viewportWidth < 1152) {
    const t = (viewportWidth - MD_BREAKPOINT) / (1152 - MD_BREAKPOINT);
    return 66 + (90 - 66) * t;
  }

  // Holds at 90 until 1279.
  if (viewportWidth < 1280) {
    return 90;
  }

  // Jumps at 1280 and above.
  return 108;
}

export function computeLeftOffset(viewportWidth: number): number {
  if (viewportWidth > 1351) return (viewportWidth - 1208) / 2 - 72;
  if (viewportWidth > 1279) return 36;
  if (viewportWidth > 1151) return (viewportWidth - 1008) / 2 - 72;
  if (viewportWidth > 767) return 36;
  if (viewportWidth > 611) return (viewportWidth - 612) / 2;
  return 0;
}

export function computeRightOffset(viewportWidth: number): number {
  if (viewportWidth > 767) return 36;
  if (viewportWidth > 611) return (viewportWidth - 612) / 2;
  return 0;
}

// As the canvas gets taller, ease the text lines slightly closer together.
// At/below the reference height the spacing stays fully proportional; above
// it the vertical gaps grow slower than the canvas so the block tightens.
const TEXT_SPACING_REFERENCE_HEIGHT = 600;
// 0 = no compression (fully proportional), 1 = constant pixel gaps.
const TEXT_SPACING_STRENGTH = 0.3;
// Anchor around the block's vertical center so it holds position while it tightens.
const TEXT_SPACING_ANCHOR = 0.75;
// Extra inward shift on mobile vs the previous edge-reaching layout.
const MOBILE_SIDE_INSET = 8;

const LINE_Y = {
  hello: 0.66,
  friend: 0.76,
  im: 0.88,
  dani: 0.94,
} as const;

// Mobile Y: a touch looser, shifted up, with extra space under Hello.
const MOBILE_LINE_Y = {
  hello: 0.695,
  friend: 0.805,
  im: 0.91,
  dani: 0.97,
} as const;

export type TextLayoutMetrics = {
  canvasWidth: number;
  canvasHeight: number;
  viewportWidth: number;
  fontSize: number;
};

function computeAnchor(viewportWidth: number) {
  return isMobileViewport(viewportWidth)
    ? TEXT_SPACING_ANCHOR + 0.02
    : TEXT_SPACING_ANCHOR;
}

function computeTextSpacingScale(canvasHeight: number) {
  if (canvasHeight <= TEXT_SPACING_REFERENCE_HEIGHT) return 1;
  const constant = TEXT_SPACING_REFERENCE_HEIGHT / canvasHeight;
  return 1 - TEXT_SPACING_STRENGTH + constant * TEXT_SPACING_STRENGTH;
}

// Apply the same height-based factor horizontally: as the canvas gets taller,
// pull each x toward the canvas center so the columns tighten up.
function computeTextXProximity(
  x: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  const center = canvasWidth / 2;
  return center + (x - center) * computeTextSpacingScale(canvasHeight);
}

function computeLineY(
  { canvasHeight, viewportWidth, fontSize }: TextLayoutMetrics,
  base: number,
) {
  const anchor = computeAnchor(viewportWidth);
  const scale = computeTextSpacingScale(canvasHeight);
  return (
    canvasHeight * anchor +
    (base - anchor) * canvasHeight * scale -
    fontSize
  );
}

function lineYBase(
  viewportWidth: number,
  key: keyof typeof LINE_Y,
) {
  return isMobileViewport(viewportWidth) ? MOBILE_LINE_Y[key] : LINE_Y[key];
}

export function computeHelloX(m: TextLayoutMetrics) {
  const x = computeTextXProximity(
    m.canvasWidth * 0.05 + computeLeftOffset(m.viewportWidth),
    m.canvasWidth,
    m.canvasHeight,
  );
  return isMobileViewport(m.viewportWidth) ? x + MOBILE_SIDE_INSET : x;
}

export function computeFriendX(m: TextLayoutMetrics) {
  const x = computeTextXProximity(
    m.canvasWidth * 0.94 -
      m.fontSize * 3 -
      computeRightOffset(m.viewportWidth),
    m.canvasWidth,
    m.canvasHeight,
  );
  return isMobileViewport(m.viewportWidth) ? x - MOBILE_SIDE_INSET : x;
}

export function computeImX(m: TextLayoutMetrics) {
  const x = computeTextXProximity(
    m.canvasWidth * 0.12 + computeLeftOffset(m.viewportWidth),
    m.canvasWidth,
    m.canvasHeight,
  );
  return isMobileViewport(m.viewportWidth) ? x + MOBILE_SIDE_INSET : x;
}

export function computeDaniX(m: TextLayoutMetrics) {
  const x = computeTextXProximity(
    m.canvasWidth -
      m.fontSize * 2.3 -
      computeRightOffset(m.viewportWidth),
    m.canvasWidth,
    m.canvasHeight,
  );
  return isMobileViewport(m.viewportWidth) ? x - MOBILE_SIDE_INSET : x;
}

export const computeHelloY = (m: TextLayoutMetrics) =>
  computeLineY(m, lineYBase(m.viewportWidth, "hello"));
export const computeFriendY = (m: TextLayoutMetrics) =>
  computeLineY(m, lineYBase(m.viewportWidth, "friend"));
export const computeImY = (m: TextLayoutMetrics) =>
  computeLineY(m, lineYBase(m.viewportWidth, "im"));
export const computeDaniY = (m: TextLayoutMetrics) =>
  computeLineY(m, lineYBase(m.viewportWidth, "dani"));
