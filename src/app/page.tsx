
"use client";

import { useEffect, useRef } from "react";
import { Application, Text, TextStyle } from "pixi.js";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application();

    let isMounted = true;

    const init = async () => {
      await app.init({
        resizeTo: window,
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      containerRef.current?.appendChild(app.canvas);

      const hello = new Text({
        text: "Hello",
        style: new TextStyle({
          fill: 0x000000,
          fontSize: 120,
          fontWeight: "700",
          fontFamily: "Arial, Helvetica, sans-serif",
        }),
      });

      const friend = new Text({
        text: "friend",
        style: new TextStyle({
          fill: 0x000000,
          fontSize: 120,
          fontWeight: "700",
          fontFamily: "Arial, Helvetica, sans-serif",
        }),
      });

      hello.x = 64;
      hello.y = 96;

      friend.x = 64;
      friend.y = hello.y + hello.height + 24;

      app.stage.addChild(hello, friend);
    };

    init();

    return () => {
      isMounted = false;
      app.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="h-screen w-screen" />;
}
