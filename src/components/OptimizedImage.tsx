import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Shape returned by vite-imagetools `?as=picture` imports, plus optional LQIP. */
export type PictureImage = {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
  /** Tiny base64 placeholder from imagetools `?inline`. */
  lqip?: string;
};

/** Attach a low-quality placeholder to a picture import. */
export function withLqip(
  picture: Omit<PictureImage, "lqip">,
  lqip: string,
): PictureImage {
  return { ...picture, lqip };
}

type OptimizedImageProps = {
  image: PictureImage;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  draggable?: boolean;
  /** Absolute fill inside a `relative` parent. */
  fill?: boolean;
};

const FADE_MS = 300;

/** Srcs that have already decoded this session — skip LQIP on remounts / morphs. */
const decodedSrcs = new Set<string>();

export function markPictureDecoded(image: PictureImage | string) {
  const src = typeof image === "string" ? image : image.img.src;
  decodedSrcs.add(src);
}

function hasDecoded(src: string) {
  return decodedSrcs.has(src);
}

function isImgReady(el: HTMLImageElement | null) {
  return Boolean(el?.complete && el.naturalWidth > 0);
}

export default function OptimizedImage({
  image,
  alt,
  className,
  sizes,
  loading = "lazy",
  draggable,
  fill = false,
}: OptimizedImageProps) {
  const hasLqip = Boolean(image.lqip);
  const src = image.img.src;
  const imgRef = useRef<HTMLImageElement>(null);

  // Capture once per mount so marking decoded mid-fade doesn't kill the transition.
  const [needsReveal] = useState(() => hasLqip && !hasDecoded(src));
  const [loaded, setLoaded] = useState(() => !needsReveal);
  // Keep LQIP painted under the fade-in, then drop it once the reveal finishes.
  const [showLqip, setShowLqip] = useState(() => needsReveal);

  useEffect(() => {
    if (!needsReveal || hasDecoded(src)) {
      setLoaded(true);
      setShowLqip(false);
      return;
    }

    if (isImgReady(imgRef.current)) {
      markPictureDecoded(src);
      setLoaded(true);
    }
  }, [needsReveal, src]);

  useEffect(() => {
    if (!loaded || !showLqip) return;
    const id = window.setTimeout(() => setShowLqip(false), FADE_MS);
    return () => window.clearTimeout(id);
  }, [loaded, showLqip]);

  const reveal = () => {
    markPictureDecoded(src);
    setLoaded(true);
  };

  return (
    <picture
      className={cn(
        fill && "absolute inset-0 block h-full w-full",
        showLqip && "bg-cover bg-center bg-no-repeat",
      )}
      style={
        showLqip ? { backgroundImage: `url("${image.lqip}")` } : undefined
      }
    >
      {Object.entries(image.sources).map(([format, srcSet]) => (
        <source
          key={format}
          type={`image/${format}`}
          srcSet={srcSet}
          sizes={sizes}
        />
      ))}
      <img
        ref={imgRef}
        src={src}
        width={fill ? undefined : image.img.w}
        height={fill ? undefined : image.img.h}
        alt={alt}
        className={cn(
          fill && "absolute inset-0 h-full w-full",
          needsReveal && "transition-opacity duration-300 ease-out",
          needsReveal && !loaded && "opacity-0",
          className,
        )}
        sizes={sizes}
        loading={loading}
        decoding="async"
        draggable={draggable}
        onLoad={reveal}
      />
    </picture>
  );
}

/** Primary URL to preload (largest fallback / img src). */
export function pictureSrc(image: PictureImage): string {
  return image.img.src;
}
