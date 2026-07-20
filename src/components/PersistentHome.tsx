"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { isIconsOff } from "@/lib/features";

/**
 * Keeps the home page (and Pixi sketch) mounted after the first visit to `/`,
 * hiding it on other routes instead of unmounting so canvas state survives.
 */
export default function PersistentHome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [keepHome, setKeepHome] = useState(isHome);
  const [iconsOff, setIconsOff] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("icons") === "off"
      : false,
  );

  useEffect(() => {
    if (isHome) setKeepHome(true);
  }, [isHome]);

  return (
    <>
      <Suspense fallback={null}>
        <IconsOffSync onChange={setIconsOff} />
      </Suspense>
      {keepHome && (
        <div
          className={
            isHome
              ? undefined
              : "fixed inset-0 -z-10 overflow-hidden invisible pointer-events-none"
          }
          aria-hidden={!isHome}
          inert={!isHome ? true : undefined}
        >
          <HomeContent active={isHome} iconsOff={iconsOff} />
        </div>
      )}
      {!isHome && children}
    </>
  );
}

function IconsOffSync({ onChange }: { onChange: (value: boolean) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onChange(isIconsOff(searchParams));
  }, [searchParams, onChange]);
  return null;
}
