
"use client";

import { useEffect, useRef } from "react";
import { Application, Graphics, Text, TextStyle } from "pixi.js";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();
    let handleOrientation: (event: DeviceOrientationEvent) => void = () => undefined;
    let enableGyroOnPointer: () => void = () => undefined;

    let isMounted = true;

    const init = async () => {
      await app.init({
        resizeTo: container,
        backgroundColor: 0xffffff,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      app.renderer.events.autoPreventDefault = false;
      app.canvas.style.touchAction = "manipulation";

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

      const circleRadius = 100;
      const circle = new Graphics()
        .circle(0, 0, circleRadius)
        .fill("0xffcc00");
      circle.x = 60 + circleRadius;
      circle.y = 90 + circleRadius;

      let velocityX = 0;
      let velocityY = 0;
      let tiltX = 0;
      let tiltY = 0;

      handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.gamma == null || event.beta == null) return;
        tiltX = event.gamma * 0.04;
        tiltY = event.beta * 0.04;
      };

      let gyroEnabled = false;
      const enableGyro = async () => {
        if (typeof DeviceOrientationEvent === "undefined") return;
        if (gyroEnabled) return;
        if ("requestPermission" in DeviceOrientationEvent) {
          try {
            const permission = await (
              DeviceOrientationEvent as typeof DeviceOrientationEvent & {
                requestPermission?: () => Promise<PermissionState>;
              }
            ).requestPermission?.();
            if (permission !== "granted") return;
          } catch (error) {
            console.warn("Device orientation permission request failed.", error);
            return;
          }
        }
        window.addEventListener("deviceorientation", handleOrientation);
        gyroEnabled = true;
      };

      enableGyroOnPointer = async () => {
        await enableGyro();
        app.canvas.removeEventListener("click", enableGyroOnPointer);
        app.canvas.removeEventListener("touchend", enableGyroOnPointer);
      };
      const hasDeviceOrientation = typeof DeviceOrientationEvent !== "undefined";
      if (hasDeviceOrientation && "requestPermission" in DeviceOrientationEvent) {
        app.canvas.addEventListener("click", enableGyroOnPointer);
        app.canvas.addEventListener("touchend", enableGyroOnPointer);
      } else {
        enableGyro();
      }

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

      app.stage.addChild(circle, hello, friend, im, dani);

      app.ticker.add((ticker) => {
        const delta = ticker.deltaTime;
        const damping = 0.96;
        const bounce = 0.9;
        const maxVelocity = 40;

        velocityX = (velocityX + tiltX * delta) * damping;
        velocityY = (velocityY + tiltY * delta) * damping;
        velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
        velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));

        circle.x += velocityX * delta;
        circle.y += velocityY * delta;

        const maxX = app.renderer.width - circleRadius;
        const maxY = app.renderer.height - circleRadius;

        if (circle.x < circleRadius) {
          circle.x = circleRadius;
          velocityX = Math.abs(velocityX) * bounce;
        } else if (circle.x > maxX) {
          circle.x = maxX;
          velocityX = -Math.abs(velocityX) * bounce;
        }

        if (circle.y < circleRadius) {
          circle.y = circleRadius;
          velocityY = Math.abs(velocityY) * bounce;
        } else if (circle.y > maxY) {
          circle.y = maxY;
          velocityY = -Math.abs(velocityY) * bounce;
        }
      });
    };

    init();

    return () => {
      isMounted = false;
      window.removeEventListener("deviceorientation", handleOrientation);
      app.canvas.removeEventListener("click", enableGyroOnPointer);
      app.canvas.removeEventListener("touchend", enableGyroOnPointer);
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
