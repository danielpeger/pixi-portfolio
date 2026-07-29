import { caseHeroes } from "@/assets/case-heroes";
import BackLink from "@/components/BackLink";
import DeferCaseBody from "@/components/DeferCaseBody";
import SharedCaseImage from "@/components/SharedCaseImage";
import { CASE_HERO_SIZES, CASE_LAYOUT_IDS } from "@/lib/portfolio";

type RatioCaseProps = {
  iconsOn?: boolean;
  onHeroLayoutComplete?: () => void;
};

export default function RatioCase({
  iconsOn = false,
  onHeroLayoutComplete,
}: RatioCaseProps) {
  void iconsOn;

  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto">
      <BackLink className="inline-block mb-8 text-lg md:text-base xl:text-xl" />
      <SharedCaseImage
        layoutId={CASE_LAYOUT_IDS.ratio}
        image={caseHeroes.ratio}
        alt="Ratio"
        className="w-full aspect-5/4 mb-8 border border-accent-border bg-accent-muted"
        sizes={CASE_HERO_SIZES}
        priority
        onLayoutAnimationComplete={onHeroLayoutComplete}
      />
      <DeferCaseBody>
        <h1 className="pb-4 text-2xl xl:text-3xl">Ratio</h1>
        <div className="space-y-4 text-lg md:text-base xl:text-xl max-w-[640px]">
          <p>
            <strong>Ratio</strong> is a native iOS app for home espresso
            drinkers who treat the morning shot as a craft: log beans and brew
            parameters, taste and reflect, then carry those learnings into the
            next cup. The product is built around a tight feedback loop—beans
            in, shot out, judgment recorded, tips for tomorrow—so dialing in
            feels less like guesswork and more like a practice you can improve
            one morning at a time.
          </p>
          <p>
            The core experience is deliberately tactile. Dose, grind, yield, and
            time aren&apos;t adjusted with generic steppers; they live on a
            custom wheel picker with foreshortening, snappy numeric transitions,
            and selection haptics—closer to a precision instrument than a form.
            Pull-to-add makes creating a new bean or brew feel discoverable in
            the scroll itself. After a brew, taste chips and tip pickers turn
            subjective notes (&ldquo;sour,&rdquo; &ldquo;watery&rdquo;) into
            plain-language next-shot advice (&ldquo;yield more,&rdquo;
            &ldquo;grind finer&rdquo;), and a great shot can be pinned as the
            recipe to remake. Label scanning with vision OCR reduces friction
            when adding a new bag, with playful loading copy that keeps the
            moment light.
          </p>
          <p>
            Visually, Ratio stays close to Apple&apos;s grouped, system-native
            chrome, then brands through a clear red accent, custom symbols, and
            celebration surfaces—the welcome flow and &ldquo;Yay&rdquo; pin
            moment—rather than heavy ornament. Craft shows up in interaction:
            spring-driven motion and haptics on onboarding, a bouncing heart
            when you nail a shot, dirty-form guards so you don&apos;t lose a log
            by accident. The tone is warm and café-geek without snobbery—short
            verbs, morning-ritual framing, emoji ratings instead of fussy
            scales—so the app feels like a companion for the ritual, not a lab
            notebook.
          </p>
        </div>
      </DeferCaseBody>
    </main>
  );
}
