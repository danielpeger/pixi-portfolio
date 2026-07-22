"use client";

import PixiSketch from "@/components/PixiSketch";
import SharedCaseImage from "@/components/SharedCaseImage";
import ViewLink from "@/components/ViewLink";
import {
  CASE_HERO_SIZES,
  CASE_LAYOUT_IDS,
  type CaseLayoutId,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

type HomeContentProps = {
  active?: boolean;
  /**
   * When false (parked keep-alive home), omit layoutIds so they don't
   * collide with the case hero. Stays true during the open morph.
   */
  shareLayout?: boolean;
  /** When true, enables the icon header layout (`?icons=on`). */
  iconsOn?: boolean;
  /** Lift this card above page chrome during the close morph. */
  elevateLayoutId?: CaseLayoutId | null;
  onLayoutAnimationComplete?: () => void;
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
  shareLayout = true,
  iconsOn = false,
  elevateLayoutId = null,
  onLayoutAnimationComplete,
}: HomeContentProps) {
  const elevateProps = (id: CaseLayoutId) => {
    const elevate = elevateLayoutId === id;
    return {
      elevate,
      onLayoutAnimationComplete: elevate
        ? onLayoutAnimationComplete
        : undefined,
    };
  };

  return (
    <main className="flex flex-col flex-wrap content-between h-[5000px] md:before:content-[''] md:before:basis-full md:before:w-0 md:before:order-2 text-lg md:text-base xl:text-xl">
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <PixiSketch
          active={active}
          className={`${
            iconsOn
              ? "h-[88svh] md:h-[min(88svh,800px)] xl:h-[min(88svh,960px)]"
              : "h-[92svh] md:h-[min(92svh,800px)] xl:h-[min(92svh,960px)]"
          }`}
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          {iconsOn ? (
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
          ) : (
            <p>
              A design engineer who puts the <em>soft</em> in software. <br />{" "}
              I've been in design since 2016, and I'm currently pursuing a
              master’s in software engineering.
            </p>
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
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <h3 className="pb-4 text-xl xl:text-2xl">
            Projects I'm most proud of
          </h3>
          <ViewLink
            view="overview"
            className={cn(
              "block max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0",
              elevateLayoutId === CASE_LAYOUT_IDS.overview && "relative z-[9999]",
            )}
          >
            <SharedCaseImage
              layoutId={CASE_LAYOUT_IDS.overview}
              shareLayout={shareLayout}
              {...elevateProps(CASE_LAYOUT_IDS.overview)}
              src="/overview.png"
              alt="Overview"
              className={`w-full aspect-5/4 mb-2 ${
                iconsOn
                  ? "border border-gray-200 bg-gray-50"
                  : "border border-yellow-200 bg-accent-muted"
              }`}
              sizes={CASE_HERO_SIZES}
            />
            <p>
              LastPass outgrew its Admin Console landing page. This is the story
              of how we designed a new Overview from first principles.
            </p>{" "}
          </ViewLink>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <ViewLink
          view="ratio"
          className={cn(
            "block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0 mb-16",
            elevateLayoutId === CASE_LAYOUT_IDS.ratio && "relative z-[9999]",
          )}
        >
          <SharedCaseImage
            layoutId={CASE_LAYOUT_IDS.ratio}
            shareLayout={shareLayout}
            {...elevateProps(CASE_LAYOUT_IDS.ratio)}
            src="/ratio.png"
            alt="Ratio"
            className={`w-full aspect-5/4 mb-2 ${
              iconsOn
                ? "border bg-gray-50"
                : "border border-yellow-200 bg-accent-muted"
            }`}
            sizes={CASE_HERO_SIZES}
          />
          <p>
            I'm a huge coffee nerd, and I couldn't help but design and build a
            coffee app. Ratio lets you taste, reflect and dial-in espresso.
          </p>
        </ViewLink>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <ViewLink
            view="kinja"
            className={cn(
              "block max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0",
              elevateLayoutId === CASE_LAYOUT_IDS.kinja && "relative z-[9999]",
            )}
          >
            <SharedCaseImage
              layoutId={CASE_LAYOUT_IDS.kinja}
              shareLayout={shareLayout}
              {...elevateProps(CASE_LAYOUT_IDS.kinja)}
              src="/kinja.png"
              alt="Kinja"
              className={`w-full aspect-5/4 mb-2 ${
                iconsOn
                  ? "border border-gray-200 bg-gray-50"
                  : "border border-yellow-200 bg-accent-muted"
              }`}
              sizes={CASE_HERO_SIZES}
            />
            <p>
              In 2019 I was part of the team rethinking navigation on the Kinja
              platform. This is the story of how we used an iterative
              human-centered design process to make our content structured and
              discoverable.
            </p>{" "}
          </ViewLink>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <ViewLink
          view="ladu"
          className={cn(
            "block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0 mb-16",
            elevateLayoutId === CASE_LAYOUT_IDS.ladu && "relative z-[9999]",
          )}
        >
          <SharedCaseImage
            layoutId={CASE_LAYOUT_IDS.ladu}
            shareLayout={shareLayout}
            {...elevateProps(CASE_LAYOUT_IDS.ladu)}
            src="/ladu.png"
            alt="Ladu"
            className={`w-full aspect-5/4 mb-2 ${
              iconsOn
                ? "border bg-gray-50"
                : "border border-yellow-200 bg-accent-muted"
            }`}
            sizes={CASE_HERO_SIZES}
          />
          <p>
            Ladu — project card placeholder. Swap this blurb for the real
            summary when the case study is ready.
          </p>
        </ViewLink>
      </section>
    </main>
  );
}
