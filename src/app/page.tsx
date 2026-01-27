
"use client";

import { useEffect, useRef } from "react";
import { Application, Assets, Graphics, Sprite, Text, TextStyle } from "pixi.js";

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

      const circleRadius = 65;
      const circle = new Graphics()
        .circle(0, 0, circleRadius)
        .fill("0xffcc00");
      circle.x = 30 + circleRadius;
      circle.y = 40 + circleRadius;
      let circleSquash = 0;
      let circleSquashNX = 1;
      let circleSquashNY = 0;
      const handTargetSize = circleRadius * 0.5;
      const handRasterScale = Math.max(2, Math.ceil(handTargetSize / 25));
      const handTexture = await Assets.load({
        src: "/hand.svg",
        data: { scale: handRasterScale, resolution: window.devicePixelRatio || 1 },
      });
      const hand = new Sprite(handTexture);
      const handSize = handTargetSize;
      hand.anchor.set(0);
      hand.scale.set(handSize / hand.texture.height);
      hand.alpha = 0;
      hand.x = 16;
      hand.y = 16;
      let handFadeElapsed = 0;
      const handFadeDelay = 3;
      const handFadeDuration = 1;
      const handLabel = new Text({
        text: "Tap to enable gyroscope",
        style: new TextStyle({
          fill: 0x8a8a8e,
          fontSize: 12,
          fontWeight: "400",
          fontFamily:
            '"SF Pro Rounded", "SF Rounded", -apple-system, system-ui, sans-serif',
        }),
      });
      handLabel.alpha = 0;
      handLabel.x = hand.x + hand.width + 8;
      handLabel.y = hand.y + (hand.height - handLabel.height) / 2;

      let velocityX = 0;
      let velocityY = 0;
      let tiltX = 0;
      let tiltY = 0;
      let baseGamma: number | null = null;
      let baseBeta: number | null = null;

      handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.gamma == null || event.beta == null) return;
        if (baseGamma == null || baseBeta == null) {
          baseGamma = event.gamma;
          baseBeta = event.beta;
        }
        tiltX = (event.gamma - baseGamma) * 0.04;
        tiltY = (event.beta - baseBeta) * 0.04;
      };

      let gyroEnabled = false;
      let introTiltProgress = 1;
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
        baseGamma = null;
        baseBeta = null;
        window.addEventListener("deviceorientation", handleOrientation);
        gyroEnabled = true;
      };

      enableGyroOnPointer = async () => {
        await enableGyro();
        app.canvas.removeEventListener("click", enableGyroOnPointer);
        app.canvas.removeEventListener("touchend", enableGyroOnPointer);
      };
      const hasDeviceOrientation = typeof DeviceOrientationEvent !== "undefined";
      const needsTapToEnable =
        hasDeviceOrientation && "requestPermission" in DeviceOrientationEvent;
      hand.visible = needsTapToEnable;
      if (needsTapToEnable) {
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

      const textBodies = [
        { sprite: hello, vx: 0, vy: 0, mass: 7, targetX: hello.x, targetY: hello.y },
        { sprite: friend, vx: 0, vy: 0, mass: 7, targetX: friend.x, targetY: friend.y },
        { sprite: im, vx: 0, vy: 0, mass: 7, targetX: im.x, targetY: im.y },
        { sprite: dani, vx: 0, vy: 0, mass: 7, targetX: dani.x, targetY: dani.y },
      ];

      app.stage.addChild(circle, hand, handLabel, hello, friend, im, dani);

      app.ticker.add((ticker) => {
        const delta = ticker.deltaTime;
        const damping = 0.968;
        const bounce = 1.07;
        const textDamping = 0.968;
        const textBounce = 1.07;
        const maxVelocity = 40;
        const circleMass = 1;
        const textSpring = 0.008;
        const squashDecay = 0.75;
        const circleSquashMax = 10;
        const stretchFactor = 1;

        if (!gyroEnabled) {
          tiltX = 0.15;
          tiltY = 0.5;
        }
        const handShouldFadeIn = !gyroEnabled && needsTapToEnable;
        if (handShouldFadeIn) {
          handFadeElapsed += ticker.deltaMS / 1000;
        }
        const fadeProgress = Math.min(
          1,
          Math.max(0, (handFadeElapsed - handFadeDelay) / handFadeDuration),
        );
        const idleHandAlpha = handShouldFadeIn ? 0.1 * fadeProgress : 0;
        hand.alpha = idleHandAlpha;
        hand.visible = handShouldFadeIn;
        handLabel.alpha = idleHandAlpha;
        handLabel.visible = handShouldFadeIn;
        if (handShouldFadeIn) {
          handLabel.x = hand.x + hand.width + 8;
          handLabel.y = hand.y + (hand.height - handLabel.height) / 2;
        }

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
          circleSquash = Math.max(
            circleSquash,
            Math.min(circleSquashMax, Math.abs(velocityX) * 0.009),
          );
          circleSquashNX = 1;
          circleSquashNY = 0;
        } else if (circle.x > maxX) {
          circle.x = maxX;
          velocityX = -Math.abs(velocityX) * bounce;
          circleSquash = Math.max(
            circleSquash,
            Math.min(circleSquashMax, Math.abs(velocityX) * 0.009),
          );
          circleSquashNX = -1;
          circleSquashNY = 0;
        }

        if (circle.y < circleRadius) {
          circle.y = circleRadius;
          velocityY = Math.abs(velocityY) * bounce;
          circleSquash = Math.max(
            circleSquash,
            Math.min(circleSquashMax, Math.abs(velocityY) * 0.009),
          );
          circleSquashNX = 0;
          circleSquashNY = 1;
        } else if (circle.y > maxY) {
          circle.y = maxY;
          velocityY = -Math.abs(velocityY) * bounce;
          circleSquash = Math.max(
            circleSquash,
            Math.min(circleSquashMax, Math.abs(velocityY) * 0.009),
          );
          circleSquashNX = 0;
          circleSquashNY = -1;
        }

        for (const body of textBodies) {
          const text = body.sprite;
          const rectLeft = text.x;
          const rectTop = text.y;
          const rectRight = text.x + text.width;
          const rectBottom = text.y + text.height;

          const nearestX = Math.max(rectLeft, Math.min(circle.x, rectRight));
          const nearestY = Math.max(rectTop, Math.min(circle.y, rectBottom));

          const diffX = circle.x - nearestX;
          const diffY = circle.y - nearestY;
          const distSq = diffX * diffX + diffY * diffY;

          if (distSq < circleRadius * circleRadius) {
            const dist = Math.max(0.0001, Math.sqrt(distSq));
            const normalX =
              distSq === 0
                ? circle.x - (rectLeft + text.width / 2)
                : diffX / dist;
            const normalY =
              distSq === 0
                ? circle.y - (rectTop + text.height / 2)
                : diffY / dist;
            const normalLength = Math.max(
              0.0001,
              Math.sqrt(normalX * normalX + normalY * normalY),
            );
            const nx = normalX / normalLength;
            const ny = normalY / normalLength;

            const overlap = circleRadius - dist;
            const totalMass = circleMass + body.mass;
            const circleMove = overlap * (body.mass / totalMass);
            const textMove = overlap * (circleMass / totalMass);

            circle.x += nx * circleMove;
            circle.y += ny * circleMove;
            text.x -= nx * textMove;
            text.y -= ny * textMove;

            const relVelX = velocityX - body.vx;
            const relVelY = velocityY - body.vy;
            const velAlongNormal = relVelX * nx + relVelY * ny;

            if (velAlongNormal < 0) {
              const restitution = textBounce;
              const impulse =
                (-(1 + restitution) * velAlongNormal) /
                (1 / circleMass + 1 / body.mass);

              velocityX += (impulse / circleMass) * nx;
              velocityY += (impulse / circleMass) * ny;
              body.vx -= (impulse / body.mass) * nx;
              body.vy -= (impulse / body.mass) * ny;

              const impact = Math.min(
                circleSquashMax,
                Math.abs(velAlongNormal) * 0.009,
              );
              circleSquash = Math.max(circleSquash, impact);
              circleSquashNX = nx;
              circleSquashNY = ny;
            }
          }

          body.vx += (body.targetX - text.x) * textSpring * delta;
          body.vy += (body.targetY - text.y) * textSpring * delta;
          body.vx *= textDamping;
          body.vy *= textDamping;
          text.x += body.vx * delta;
          text.y += body.vy * delta;
        }

        for (let i = 0; i < textBodies.length; i += 1) {
          for (let j = i + 1; j < textBodies.length; j += 1) {
            const a = textBodies[i];
            const b = textBodies[j];
            const aSprite = a.sprite;
            const bSprite = b.sprite;

            const aLeft = aSprite.x;
            const aTop = aSprite.y;
            const aRight = aSprite.x + aSprite.width;
            const aBottom = aSprite.y + aSprite.height;

            const bLeft = bSprite.x;
            const bTop = bSprite.y;
            const bRight = bSprite.x + bSprite.width;
            const bBottom = bSprite.y + bSprite.height;

            const overlapX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
            const overlapY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

            if (overlapX > 0 && overlapY > 0) {
              const aCenterX = aLeft + aSprite.width / 2;
              const aCenterY = aTop + aSprite.height / 2;
              const bCenterX = bLeft + bSprite.width / 2;
              const bCenterY = bTop + bSprite.height / 2;

              let nx = 0;
              let ny = 0;
              let separation = 0;

              if (overlapX < overlapY) {
                separation = overlapX;
                nx = aCenterX < bCenterX ? -1 : 1;
              } else {
                separation = overlapY;
                ny = aCenterY < bCenterY ? -1 : 1;
              }

              const totalMass = a.mass + b.mass;
              const aMove = separation * (b.mass / totalMass);
              const bMove = separation * (a.mass / totalMass);

              aSprite.x += nx * aMove;
              aSprite.y += ny * aMove;
              bSprite.x -= nx * bMove;
              bSprite.y -= ny * bMove;

              const relVelX = a.vx - b.vx;
              const relVelY = a.vy - b.vy;
              const velAlongNormal = relVelX * nx + relVelY * ny;

              if (velAlongNormal < 0) {
                const restitution = 0.35;
                const impulse =
                  (-(1 + restitution) * velAlongNormal) /
                  (1 / a.mass + 1 / b.mass);

                a.vx += (impulse / a.mass) * nx;
                a.vy += (impulse / a.mass) * ny;
                b.vx -= (impulse / b.mass) * nx;
                b.vy -= (impulse / b.mass) * ny;

              }
            }
          }
        }

        if (circleSquash > 0.0001) {
          circleSquash *= squashDecay;
        } else {
          circleSquash = 0;
        }

        const circleAxisX = Math.abs(circleSquashNX);
        const circleAxisY = Math.abs(circleSquashNY);
        if (circleAxisX >= circleAxisY) {
          circle.scale.set(1 - circleSquash, 1 + circleSquash * stretchFactor);
        } else {
          circle.scale.set(1 + circleSquash * stretchFactor, 1 - circleSquash);
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
      <p>a Budapest-based design engineer trying to put the soft back in software.</p>
      </section>
    </main>
  );
}
