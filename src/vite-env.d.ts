/// <reference types="vite/client" />

/** Shape returned by vite-imagetools `?as=picture` imports. */
interface ImagetoolsPicture {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
}

declare module "*&as=picture" {
  const picture: ImagetoolsPicture;
  export default picture;
}
