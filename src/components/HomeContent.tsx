import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import PixiSketch from "@/components/PixiSketch";
import { withFeatureParams } from "@/lib/features";
import { cn } from "@/lib/utils";

type HomeContentProps = {
  active?: boolean;
  /** When true, restores the pre-icon header layout (`?icons=off`). */
  iconsOff?: boolean;
};

function FloatIcon({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    // Native img so shape-outside can use the SVG alpha channel exactly.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      aria-hidden
      className={cn(
        "float-left",
        className,
        // Stack above text from md up; call-site classes handle float margins below md.
        "md:float-none md:mt-0 md:mr-0 md:mb-2 md:ml-0 md:[shape-outside:none] md:[shape-margin:0]",
      )}
    />
  );
}

export default function HomeContent({
  active = true,
  iconsOff = false,
}: HomeContentProps) {
  const featureParams = iconsOff
    ? new URLSearchParams("icons=off")
    : new URLSearchParams();
  const overviewHref = withFeatureParams("/overview", featureParams);
  const ratioHref = withFeatureParams("/ratio", featureParams);

  return (
    <main className="flex flex-col flex-wrap content-between h-[5000px] md:before:content-[''] md:before:basis-full md:before:w-0 md:before:order-2 text-lg md:text-base xl:text-xl">
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <PixiSketch
          active={active}
          className="h-[88svh] md:h-[min(88svh,800px)] xl:h-[min(88svh,960px)]"
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          {iconsOff ? (
            <p>
              A design engineer who puts the <em>soft</em> in software. <br />{" "}
              I've been a product designer since 2016, and I'm currently
              pursuing a master’s in software engineering.
            </p>
          ) : (
            <>
              <div className="mb-8 flow-root">
                <FloatIcon
                  src="/icons/soft.svg"
                  width={40}
                  height={40}
                  className="mt-[8px] mr-[12px] mb-[12px] [shape-outside:url(/icons/soft.svg)] [shape-margin:12px]"
                />
                <p>
                  A design engineer who puts the <em>soft</em> in software.{" "}
                  <br /> I've been in design since 2016, and I'm currently
                  pursuing a master’s in software engineering.
                </p>
              </div>
              <div className="mb-8 flow-root">
                <FloatIcon
                  src="/icons/stairs.svg"
                  width={41}
                  height={41}
                  className="mt-[8px] mr-[12px] mb-[12px] ml-[4px] [shape-outside:url(/icons/stairs.svg)] [shape-margin:16px]"
                />
                <p>
                  I love creating useful and fun things, exploring ideas, making
                  sense of complexity. I’m a purpose-driven generalist, who
                  works to see human potential actualized, envisioning a world
                  where technology elevates the best of our nature.
                </p>
              </div>
              <div className="mb-8 flow-root">
                <FloatIcon
                  src="/icons/aster.svg"
                  width={47}
                  height={45}
                  className="mt-[4px] mr-[12px] mb-[4px] [shape-outside:url(/icons/aster.svg)] [shape-margin:10px]"
                />
                <p>
                  Douglas Engelbart, Ivan Sutherland, Bret Victor, Tristan
                  Harris and Matthew Butterick are some of my heroes.
                </p>
              </div>
              <div className="flow-root">
                <FloatIcon
                  src="/icons/arch.svg"
                  width={57}
                  height={29}
                  className="mt-[8px] mr-[12px] [shape-outside:url(/icons/arch.svg)] [shape-margin:12px]"
                />
                <p>
                  When not at my desk you'll find me out in nature, with family
                  and friends, in the kitchen, in the swimming pool, or in the
                  cinema.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <h3 className="pb-4 text-xl xl:text-2xl">Places I've worked at</h3>
          <ul>
            <li className="pb-2 mb-2 border-b border-separator flex justify-between">
              <a href="https://www.lastpass.com" className="hover:underline">
                LastPass
              </a>
              <span className="text-tertiary-foreground">2023-</span>
            </li>
            <li className="pb-2 mb-2 border-b border-separator flex justify-between">
              <a href="https://www.paperpal.com" className="hover:underline">
                Paperpal
              </a>
              <span className="text-tertiary-foreground">2021-23</span>
            </li>
            <li className="pb-2 mb-2 border-b border-separator flex justify-between">
              <a href="https://www.gizmodo.com" className="hover:underline">
                Gizmodo
              </a>
              <span className="text-tertiary-foreground">2018-21</span>
            </li>
            <li className="flex justify-between">
              <a href="https://www.index.hu" className="hover:underline">
                index.hu
              </a>
              <span className="text-tertiary-foreground">2016-18</span>
            </li>
          </ul>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <TransitionLink
          href={ratioHref}
          className="block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0 mb-16"
        >
          {!iconsOff && (
            <h3 className="pb-4 text-xl xl:text-2xl">
              Projects I'm most proud of
            </h3>
          )}
          <div
            data-vt="ratio-image"
            className={`relative w-full aspect-5/4 rounded-[20px] overflow-hidden mb-2 ${
              iconsOff ? "bg-accent-muted" : "border bg-gray-50"
            }`}
          >
            <Image
              src="/ratio.png"
              alt="Ratio"
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 100vw, 712px"
            />
          </div>
          <p>Ratio description</p>
        </TransitionLink>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          {iconsOff && (
            <h3 className="pb-4 text-xl xl:text-2xl">
              Projects I'm most proud of
            </h3>
          )}
          <TransitionLink
            href={overviewHref}
            className="block max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0"
          >
            <div
              data-vt="overview-image"
              className={`relative w-full aspect-5/4 rounded-[20px] overflow-hidden mb-2 ${
                iconsOff ? "bg-accent-muted" : "border bg-gray-50"
              }`}
            >
              <Image
                src="/overview.png"
                alt="Overview"
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 768px) 100vw, 712px"
              />
            </div>
            <p>
              In 2019 I was part of the team rethinking navigation on the Kinja
              platform. This is the story of how we used an iterative
              human-centered design process to make our content structured and
              discoverable.
            </p>{" "}
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
