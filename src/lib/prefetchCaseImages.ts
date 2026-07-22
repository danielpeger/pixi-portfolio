/** Hero images shared between home cards and case-study pages. */
const CASE_IMAGES = [
  "/overview.png",
  "/ratio.png",
  "/kinja.png",
  "/ladu.png",
] as const;

let started = false;

/**
 * Warm the browser cache (and decode) so view-transition new snapshots
 * are less likely to capture an empty Next/Image on Safari.
 */
export function prefetchCaseImages() {
  if (typeof window === "undefined" || started) return;
  started = true;

  for (const src of CASE_IMAGES) {
    if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    void img.decode().catch(() => {
      // Ignore decode failures; preload still helps the HTTP cache.
    });
  }
}
