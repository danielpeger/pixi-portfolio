"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import HomeContent from "@/components/HomeContent";

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

  useEffect(() => {
    if (isHome) setKeepHome(true);
  }, [isHome]);

  return (
    <>
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
          <HomeContent active={isHome} />
        </div>
      )}
      {!isHome && children}
    </>
  );
}
