/** Hero images shared between home cards and case-study views. */
const CASE_IMAGES = [
  "/overview.png",
  "/ratio.png",
  "/kinja.png",
  "/ladu.png",
] as const;

let started = false;

/**
 * Warm the optimized hero bitmaps Next will serve for CASE_HERO_SIZES
 * (~960px → w=1080), so shared-layout morphs don't wait on decode.
 */
export function prefetchCaseImages() {
  if (typeof window === "undefined" || started) return;
  started = true;

  for (const src of CASE_IMAGES) {
    const optimized = `/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`;
    if (!document.querySelector(`link[rel="preload"][href="${optimized}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = optimized;
      document.head.appendChild(link);
    }

    const img = new Image();
    img.decoding = "async";
    img.src = optimized;
    void img.decode().catch(() => {
      // Ignore decode failures; preload still helps the HTTP cache.
    });
  }
}
