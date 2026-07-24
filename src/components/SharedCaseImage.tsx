import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Lightbox, { LightboxImage } from "@/components/Lightbox";
import OptimizedImage, {
  type PictureImage,
} from "@/components/OptimizedImage";
import {
  type CaseLayoutId,
  sharedLayoutTransition,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

/** Above page chrome (Pixi, copy, other cards) while a shared-layout morph runs. */
const MORPH_Z_INDEX = 9999;
const HERO_ASPECT_RATIO = "5 / 4";

function splitHeroClassName(className: string) {
  const marginMatch = className.match(/\bmb-[^\s]+/);
  const margin = marginMatch?.[0] ?? "";
  const container = className.replace(/\bmb-[^\s]+\s?/g, "").trim();
  return { margin, container };
}

type SharedCaseImageProps = {
  layoutId: CaseLayoutId;
  image: PictureImage;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** When set, hero is clickable and opens in a lightbox on case pages. */
  lightboxLayoutId?: string;
  shareLayout?: boolean;
  elevate?: boolean;
  onLayoutAnimationComplete?: () => void;
};

export default function SharedCaseImage({
  layoutId,
  image,
  alt,
  className,
  sizes,
  priority = false,
  lightboxLayoutId,
  shareLayout = true,
  elevate = false,
  onLayoutAnimationComplete,
}: SharedCaseImageProps) {
  const reduceMotion = useReducedMotion();
  const enabled = shareLayout && !reduceMotion;
  const [animating, setAnimating] = useState(false);
  const onTop = elevate || animating;
  const { margin, container } = splitHeroClassName(className ?? "");

  return (
    <motion.div
      layoutId={enabled ? layoutId : undefined}
      transition={sharedLayoutTransition}
      className={cn(
        "relative",
        lightboxLayoutId ? cn("block w-full", margin) : className,
      )}
      style={{
        borderRadius: 20,
        zIndex: onTop ? MORPH_Z_INDEX : undefined,
      }}
      onLayoutAnimationStart={() => setAnimating(true)}
      onLayoutAnimationComplete={() => {
        setAnimating(false);
        onLayoutAnimationComplete?.();
      }}
    >
      {lightboxLayoutId ? (
        <Lightbox
          layoutId={lightboxLayoutId}
          aspectRatio={HERO_ASPECT_RATIO}
          ariaLabel={`View ${alt}`}
          className="block w-full"
          frameClassName={cn("relative overflow-hidden", container)}
          expandedFrameClassName={cn(
            "overflow-hidden",
            container.replace(/\baspect-[^\s]+\s?/g, ""),
          )}
        >
          <LightboxImage
            image={image}
            alt={alt}
            sizes={sizes}
            priority={priority}
            objectFit="cover"
          />
        </Lightbox>
      ) : (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <OptimizedImage
            image={image}
            alt={alt}
            fill
            className="object-cover select-none [transform:translateZ(0)]"
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            draggable={false}
          />
        </div>
      )}
    </motion.div>
  );
}
