import Image from "next/image";
import BackLink from "@/components/BackLink";
import { isIconsOn } from "@/lib/features";

type RatioPageProps = {
  searchParams: Promise<{ icons?: string | string[] }>;
};

export default async function RatioPage({ searchParams }: RatioPageProps) {
  const params = await searchParams;
  const iconsOn = isIconsOn(params);

  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto">
      <BackLink className="inline-block mb-8 text-lg md:text-base xl:text-xl" />
      <div
        data-vt="ratio-image"
        className={`ratio-hero relative w-full aspect-5/4 rounded-[20px] overflow-hidden mb-8 ${
          iconsOn ? "bg-red-50" : "bg-accent-muted"
        }`}
      >
        <Image
          src="/ratio.png"
          alt="Ratio"
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width: 960px) 100vw, 960px"
          priority
        />
      </div>
      <h1 className="pb-4 text-2xl xl:text-3xl">Ratio</h1>
      <p className="text-lg md:text-base xl:text-xl max-w-[640px]">
        Ratio description
      </p>
    </main>
  );
}
