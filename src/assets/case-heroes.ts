import { withLqip, type PictureImage } from "@/components/OptimizedImage";

import overview from "@/assets/heroes/overview.png?w=640;960;1280&format=webp;jpg&as=picture";
import overviewLqip from "@/assets/heroes/overview.png?w=64&blur=2&quality=40&format=webp&inline";
import ratio from "@/assets/heroes/ratio.png?w=640;960;1280&format=webp;jpg&as=picture";
import ratioLqip from "@/assets/heroes/ratio.png?w=64&blur=2&quality=40&format=webp&inline";
import kinja from "@/assets/heroes/kinja.png?w=640;960;1280&format=webp;jpg&as=picture";
import kinjaLqip from "@/assets/heroes/kinja.png?w=64&blur=2&quality=40&format=webp&inline";
import ladu from "@/assets/heroes/ladu.png?w=640;960;1280&format=webp;jpg&as=picture";
import laduLqip from "@/assets/heroes/ladu.png?w=64&blur=2&quality=40&format=webp&inline";
import preflight from "@/assets/heroes/preflight.png?w=640;960;1280&format=webp;jpg&as=picture";
import preflightLqip from "@/assets/heroes/preflight.png?w=64&blur=2&quality=40&format=webp&inline";

export const caseHeroes = {
  overview: withLqip(overview as PictureImage, overviewLqip),
  ratio: withLqip(ratio as PictureImage, ratioLqip),
  kinja: withLqip(kinja as PictureImage, kinjaLqip),
  ladu: withLqip(ladu as PictureImage, laduLqip),
  preflight: withLqip(preflight as PictureImage, preflightLqip),
} as const;
