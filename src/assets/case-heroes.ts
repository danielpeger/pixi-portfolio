import type { PictureImage } from "@/components/OptimizedImage";

import overview from "@/assets/heroes/overview.png?w=640;960;1280&format=webp;jpg&as=picture";
import ratio from "@/assets/heroes/ratio.png?w=640;960;1280&format=webp;jpg&as=picture";
import kinja from "@/assets/heroes/kinja.png?w=640;960;1280&format=webp;jpg&as=picture";
import ladu from "@/assets/heroes/ladu.png?w=640;960;1280&format=webp;jpg&as=picture";

export const caseHeroes = {
  overview: overview as PictureImage,
  ratio: ratio as PictureImage,
  kinja: kinja as PictureImage,
  ladu: ladu as PictureImage,
} as const;
