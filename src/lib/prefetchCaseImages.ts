import { caseHeroes } from "@/assets/case-heroes";
import { pictureSrc } from "@/components/OptimizedImage";

const CASE_IMAGES = [
  caseHeroes.overview,
  caseHeroes.ratio,
  caseHeroes.kinja,
  caseHeroes.ladu,
] as const;

let started = false;

/**
 * Warm hero bitmaps used by home cards + case views so shared-layout
 * morphs don't wait on decode.
 */
export function prefetchCaseImages() {
  if (typeof window === "undefined" || started) return;
  started = true;

  for (const image of CASE_IMAGES) {
    const href = pictureSrc(image);
    if (!document.querySelector(`link[rel="preload"][href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
    }

    const img = new Image();
    img.decoding = "async";
    img.src = href;
    void img.decode().catch(() => {
      // Ignore decode failures; preload still helps the HTTP cache.
    });
  }
}
