import { caseHeroes } from "@/assets/case-heroes";
import AudioPlayer from "@/components/AudioPlayer";
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
  /** Lift this card above page chrome during the close morph. */
  elevateLayoutId?: CaseLayoutId | null;
  onLayoutAnimationComplete?: () => void;
};

export default function HomeContent({
  active = true,
  shareLayout = true,
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
          className="h-[92svh] md:h-[min(92svh,800px)] xl:h-[min(92svh,960px)]"
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          <p>
            A design engineer who puts the <em>soft</em> in software. <br />{" "}
            I've been in design since 2016, and I'm currently pursuing a
            master’s in software engineering.
          </p>
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
              elevateLayoutId === CASE_LAYOUT_IDS.overview &&
                "relative z-[9999]",
            )}
          >
            <SharedCaseImage
              layoutId={CASE_LAYOUT_IDS.overview}
              shareLayout={shareLayout}
              {...elevateProps(CASE_LAYOUT_IDS.overview)}
              image={caseHeroes.overview}
              alt="Overview"
              className="w-full aspect-5/4 mb-2 border border-accent-border bg-accent-muted"
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
            image={caseHeroes.ratio}
            alt="Ratio"
            className="w-full aspect-5/4 mb-2 border border-accent-border bg-accent-muted"
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
              image={caseHeroes.kinja}
              alt="Kinja"
              className="w-full aspect-5/4 mb-2 border border-accent-border bg-accent-muted"
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
          view="preflight"
          className={cn(
            "block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0 mb-16",
            elevateLayoutId === CASE_LAYOUT_IDS.preflight && "relative z-[9999]",
          )}
        >
          <SharedCaseImage
            layoutId={CASE_LAYOUT_IDS.preflight}
            shareLayout={shareLayout}
            {...elevateProps(CASE_LAYOUT_IDS.preflight)}
            image={caseHeroes.preflight}
            alt="Preflight"
            className="w-full aspect-5/4 mb-2 border border-accent-border bg-accent-muted"
            sizes={CASE_HERO_SIZES}
          />
          <p>
            Preflight — project card placeholder. Swap this blurb for the
            real summary when the case study is ready.
          </p>
        </ViewLink>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <ViewLink
            view="ladu"
            className={cn(
              "block max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0",
              elevateLayoutId === CASE_LAYOUT_IDS.ladu &&
                "relative z-[9999]",
            )}
          >
            <SharedCaseImage
              layoutId={CASE_LAYOUT_IDS.ladu}
              shareLayout={shareLayout}
              {...elevateProps(CASE_LAYOUT_IDS.ladu)}
              image={caseHeroes.ladu}
              alt="Ladu"
              className="w-full aspect-5/4 mb-2 border border-accent-border bg-accent-muted"
              sizes={CASE_HERO_SIZES}
            />
            <p>
              Ladu — project card placeholder. Swap this blurb for the real
              summary when the case study is ready.
            </p>
          </ViewLink>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <h3 className="pb-4 text-xl xl:text-2xl">On repeat</h3>
          <AudioPlayer />
        </div>
      </section>
    </main>
  );
}
