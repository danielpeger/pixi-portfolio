"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { isIconsOn } from "@/lib/features";
import { prefetchCaseImages } from "@/lib/prefetchCaseImages";

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
  const [iconsOn, setIconsOn] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("icons") === "on"
      : false,
  );

  useEffect(() => {
    if (isHome) setKeepHome(true);
  }, [isHome]);

  useEffect(() => {
    if (keepHome) prefetchCaseImages();
  }, [keepHome]);

  return (
    <>
      <Suspense fallback={null}>
        <IconsOnSync onChange={setIconsOn} />
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
          <HomeContent active={isHome} iconsOn={iconsOn} />
        </div>
      )}
      {!isHome && children}
    </>
  );
}

function IconsOnSync({ onChange }: { onChange: (value: boolean) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onChange(isIconsOn(searchParams));
  }, [searchParams, onChange]);
  return null;
}
