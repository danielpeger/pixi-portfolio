
"use client";

import { useEffect, useRef } from "react";
import { Application, Text, TextStyle } from "pixi.js";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();

    let isMounted = true;

    const init = async () => {
      await app.init({
        resizeTo: container,
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      app.renderer.events.autoPreventDefault = false;
      app.canvas.style.touchAction = "auto";

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      container.appendChild(app.canvas);
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";

      if (document.fonts) {
        await document.fonts.load('400 70px "Jua"');
      }

      const textStyle = new TextStyle({
        fill: 0x000000,
        fontSize: 70,
        fontWeight: "400",
        fontFamily: '"Jua", Arial, Helvetica, sans-serif',
      });

      const hello = new Text({
        text: "Hello",
        style: textStyle,
      });

      const friend = new Text({
        text: "friend,",
        style: textStyle,
      });


      const im = new Text({
        text: "I'm",
        style: textStyle,
      });

      const dani = new Text({
        text: "Dani",
        style: textStyle,
      });

      hello.x = 20;
      hello.y = 330;
      hello.rotation = (-10 * Math.PI) / 180;

      friend.x = 170;
      friend.y = 393;
      friend.rotation = (3 * Math.PI) / 180;

      im.x = 47;
      im.y = 470;

      dani.x = 242;
      dani.y = 484;

      app.stage.addChild(hello, friend, im, dani);
    };

    init();

    return () => {
      isMounted = false;
      app.destroy(true);
    };
  }, []);

  return (
    <main>
      <div ref={containerRef} className="h-[80vh] w-screen" />
      <section className="mx-8">
      <p>a Budapest-based design engineer striving to improve human lives through software.</p>
      </section>
    </main>
  );
}
