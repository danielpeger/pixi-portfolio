import { cn } from "@/lib/utils";

/** Shape returned by vite-imagetools `?as=picture` imports. */
export type PictureImage = {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
};

type OptimizedImageProps = {
  image: PictureImage;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  draggable?: boolean;
  /** Absolute fill inside a `relative` parent. */
  fill?: boolean;
};

export default function OptimizedImage({
  image,
  alt,
  className,
  sizes,
  loading = "lazy",
  decoding = "async",
  draggable,
  fill = false,
}: OptimizedImageProps) {
  return (
    <picture
      className={fill ? "absolute inset-0 block h-full w-full" : undefined}
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
        src={image.img.src}
        width={fill ? undefined : image.img.w}
        height={fill ? undefined : image.img.h}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        draggable={draggable}
      />
    </picture>
  );
}

/** Primary URL to preload (largest fallback / img src). */
export function pictureSrc(image: PictureImage): string {
  return image.img.src;
}
