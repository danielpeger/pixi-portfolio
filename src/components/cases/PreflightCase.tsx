import { caseHeroes } from "@/assets/case-heroes";
import BackLink from "@/components/BackLink";
import DeferCaseBody from "@/components/DeferCaseBody";
import SharedCaseImage from "@/components/SharedCaseImage";
import { CASE_HERO_SIZES, CASE_LAYOUT_IDS } from "@/lib/portfolio";

type PreflightCaseProps = {
  onHeroLayoutComplete?: () => void;
};

export default function PreflightCase({
  onHeroLayoutComplete,
}: PreflightCaseProps) {
  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto">
      <BackLink className="inline-block mb-8 text-lg md:text-base xl:text-xl" />
      <SharedCaseImage
        layoutId={CASE_LAYOUT_IDS.preflight}
        image={caseHeroes.preflight}
        alt="Preflight"
        className="w-full aspect-5/4 mb-8"
        sizes={CASE_HERO_SIZES}
        priority
        onLayoutAnimationComplete={onHeroLayoutComplete}
      />
      <DeferCaseBody>
        <h1 className="pb-4 text-2xl xl:text-3xl">Preflight</h1>
        <div className="space-y-4 text-lg md:text-base xl:text-xl max-w-[640px]">
          <p>
            Preflight — case study placeholder. Swap this copy for the real
            story when the write-up is ready.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere, nisl at fermentum tincidunt, arcu nisl volutpat sapien, at
            rhoncus lectus lorem vitae nisi. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae.
          </p>
          <p>
            Placeholder for context, process, and outcome. The hero above is
            the working visual; the rest of this page is scaffolding until the
            case study is written.
          </p>
        </div>
      </DeferCaseBody>
    </main>
  );
}
