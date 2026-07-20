import Image from "next/image";
import BackLink from "@/components/BackLink";

export default function OverviewPage() {
  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto">
      <BackLink className="inline-block mb-8 text-lg md:text-base xl:text-xl" />
      <div
        data-vt="overview-image"
        className="overview-hero relative w-full bg-blue-50 aspect-5/4 rounded-[20px] overflow-hidden mb-8"
      >
        <Image
          src="/overview.png"
          alt="Overview"
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width: 960px) 100vw, 960px"
          priority
        />
      </div>
      <h1 className="pb-4 text-2xl xl:text-3xl">Overview</h1>
      <p className="text-lg md:text-base xl:text-xl max-w-[640px]">
        In 2019 I was part of the team rethinking navigation on the Kinja
        platform. This is the story of how we used an iterative human-centered
        design process to make our content structured and discoverable.
      </p>
    </main>
  );
}
