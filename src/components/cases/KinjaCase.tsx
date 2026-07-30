import { Fragment, type ReactNode } from "react";
import { caseHeroes } from "@/assets/case-heroes";
import { kinjaImages } from "@/assets/kinja-images";
import BackLink from "@/components/BackLink";
import DeferCaseBody from "@/components/DeferCaseBody";
import OptimizedImage, { type PictureImage } from "@/components/OptimizedImage";
import CaseVideo from "@/components/kinja/CaseVideo";
import CompareImages from "@/components/kinja/CompareImages";
import SharedCaseImage from "@/components/SharedCaseImage";
import { CASE_HERO_SIZES, CASE_LAYOUT_IDS } from "@/lib/portfolio";

function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-accent/50 text-foreground rounded-sm px-0.5 not-italic">
      {children}
    </mark>
  );
}

function CaseFigure({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <figure className="my-8 max-w-[720px]">
      {children}
      {caption ? (
        <figcaption className="mt-3 text-sm text-tertiary-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ClickData() {
  const rows = [
    {
      category: "Homepages",
      items: [
        { label: "Network nav", value: 4.45, bar: 44.5 },
        { label: "Section nav", value: 1.85, bar: 18.5 },
      ],
    },
    {
      category: "Article pages",
      items: [
        { label: "Network nav", value: 1.18, bar: 11.8 },
        { label: "Section nav", value: 1.01, bar: 10.1 },
      ],
    },
  ];

  return (
    <figure className="my-8 max-w-[720px]">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h4 className="text-base text-foreground">
          Navigation click-through rates
        </h4>
        <span className="text-sm text-tertiary-foreground">
          based on Google Analytics click events
        </span>
      </div>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.category}>
            <p className="mb-2 text-sm font-medium text-foreground">
              {row.category}
            </p>
            <div className="space-y-2">
              {row.items.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-2 text-sm"
                >
                  <span>{item.label}</span>
                  <div className="h-4 overflow-hidden rounded-sm bg-accent-muted">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${item.bar}%` }}
                    />
                  </div>
                  <span className="text-right tabular-nums">
                    {item.value.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function UserGoalTable() {
  const sections = [
    {
      title: "As a user I want to … using the kinja nav.",
      rows: [
        { goal: "know where I am", votes: 21 },
        { goal: "go back to the front page, find more content", votes: 21 },
        {
          goal: "quickly go to a section of the site I like (topic/tag/author/format/etc.)",
          votes: 18,
        },
        { goal: "find out what this site is about", votes: 17 },
        {
          goal: "access profile functions: posts/comments I wrote/saved, change my pic",
          votes: 16,
        },
        { goal: "know when someone replies to a comment I made", votes: 14 },
        { goal: "find a specific post I read earlier", votes: 10 },
        {
          goal: "log out, because I'm either on a shared computer, or I have multiple accounts",
          votes: 8,
        },
      ],
    },
    {
      title: "As an author I want to … using the kinja nav.",
      rows: [
        { goal: "write a new post", votes: 17 },
        { goal: "resume writing a post", votes: 17 },
        { goal: "find and manage posts others wrote", votes: 12 },
        { goal: "know if someone comments on my post", votes: 12 },
      ],
    },
    {
      title: "As an advertiser I want to … using the kinja nav.",
      rows: [
        { goal: "check on my sponsored site", votes: 14 },
        { goal: "check on my sponsored section", votes: 13 },
        { goal: "check on my sponsored post", votes: 13 },
      ],
    },
  ];

  return (
    <div className="my-8 max-w-[720px] overflow-hidden rounded-[20px] border border-separator">
      <table className="w-full text-sm">
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr className="border-b border-separator">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  {section.title}
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Votes
                </th>
              </tr>
              {section.rows.map((row) => {
                const intensity = (row.votes - 8) / 13;
                return (
                  <tr
                    key={row.goal}
                    className="border-b border-separator last:border-0"
                    style={{
                      backgroundColor: `color-mix(in oklch, var(--accent) ${Math.round(intensity * 55)}%, transparent)`,
                    }}
                  >
                    <td
                      className="px-4 py-2"
                      style={{
                        color: `color-mix(in oklch, var(--foreground) ${Math.round((row.votes / 21) * 100)}%, var(--tertiary-foreground))`,
                      }}
                    >
                      {row.goal}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-foreground">
                      {row.votes}
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LearningsTable() {
  const learnings: {
    positive: boolean;
    title: string;
    quotes: string[];
    image: PictureImage;
  }[] = [
    {
      positive: false,
      title: "Mix site logos with section logos",
      quotes: [
        "“I didn’t notice the G…I guess I thought it was connected to the other logo.”",
        "“I thought Paleofuture was a new blog.”",
      ],
      image: kinjaImages.learnings.verticallogo,
    },
    {
      positive: true,
      title: "Keep site logo consistent across pages",
      quotes: [
        "Most participants said they'd click the top logo to find out more about the site.",
      ],
      image: kinjaImages.learnings.logo,
    },
    {
      positive: true,
      title: "Taglines help newcomers",
      quotes: [
        "People not familiar with Gizmodo or Paleofuture tended to reference the tagline when asked to describe the site.",
      ],
      image: kinjaImages.learnings.tagline,
    },
    {
      positive: false,
      title: "Branded section headers",
      quotes: [
        "“This looks like an ad.”",
        "“If paleofuture is the name of the article?”",
      ],
      image: kinjaImages.learnings.verticalheaders,
    },
    {
      positive: true,
      title: "A tab-bar like section nav with strong accent on the active item",
      quotes: ["“Paleofuture is a section of Gizmodo.”"],
      image: kinjaImages.learnings.tabbar,
    },
    {
      positive: false,
      title: "Bespoke icons and labels",
      quotes: [
        "“The explore button is really ambiguous.”",
        "“I think the grid icon would take me to more articles.”",
      ],
      image: kinjaImages.learnings.bespoke,
    },
    {
      positive: true,
      title: "Familiar icons and labels",
      quotes: ["“Kibbon” achieved 100% completion rate on task #3 and #4."],
      image: kinjaImages.learnings.familiar,
    },
    {
      positive: true,
      title: "Network tiles are great for exploration",
      quotes: [
        "“If you don't know what something is, you don't have to click on it to figure it out, you see it right there.”",
      ],
      image: kinjaImages.learnings.magiccards,
    },
  ];

  return (
    <div className="my-8 max-w-[720px] space-y-8">
      {learnings.map((item) => (
        <div
          key={item.title}
          className="grid gap-4 border-b border-separator pb-8 last:border-0 last:pb-0 sm:grid-cols-[auto_1fr_minmax(0,45%)]"
        >
          <div className="pt-1">
            <img
              src={item.positive ? "/kinjanav/yep.svg" : "/kinjanav/nope.svg"}
              alt={item.positive ? "Worked" : "Didn't work"}
              width={17}
              height={15}
            />
          </div>
          <div className="space-y-2 min-w-0">
            <strong className="block font-medium text-foreground">
              {item.title}
            </strong>
            {item.quotes.map((quote) => (
              <p
                key={quote}
                className={`rounded-md px-2 py-1.5 text-sm ${
                  item.positive
                    ? "bg-emerald-500/15 text-foreground"
                    : "bg-red-500/15 text-foreground"
                }`}
              >
                {quote}
              </p>
            ))}
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-auto sm:min-h-[120px]">
            <OptimizedImage
              image={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 280px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function OutcomeStat({
  value,
  label,
  arrow = 2,
}: {
  value: string;
  label: string;
  arrow?: 1 | 2;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-3xl xl:text-4xl font-medium text-emerald-600 dark:text-emerald-400">
        <img
          src={`/kinjanav/upArrow${arrow}.svg`}
          alt=""
          width={28}
          height={40}
          className="h-8 w-auto xl:h-10"
        />
        {value}
      </div>
      <p className="mt-1 text-tertiary-foreground">{label}</p>
    </div>
  );
}

type KinjaCaseProps = {
  onHeroLayoutComplete?: () => void;
};

export default function KinjaCase({
  onHeroLayoutComplete,
}: KinjaCaseProps) {
  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto text-lg md:text-base xl:text-xl">
      <BackLink className="inline-block mb-8" />
      <SharedCaseImage
        layoutId={CASE_LAYOUT_IDS.kinja}
        image={caseHeroes.kinja}
        alt="Kinja"
        className="w-full aspect-5/4 mb-8 border border-accent-border bg-accent-muted"
        sizes={CASE_HERO_SIZES}
        priority
        onLayoutAnimationComplete={onHeroLayoutComplete}
      />
      <DeferCaseBody>
        <p className="mb-3 text-sm uppercase tracking-[0.08em] text-tertiary-foreground">
          Product Design Case Study
        </p>
        <h1 className="pb-4 text-2xl xl:text-3xl max-w-[700px]">
          Kinja navigation redesign for a multi-brand publishing network
        </h1>
        <p className="max-w-[640px] mb-10">
          In 2019 I was part of the team rethinking navigation on the{" "}
          <a
            href="https://kinja.com/"
            className="underline hover:text-foreground"
          >
            Kinja platform
          </a>
          , where readers kept getting lost between sites and sections. Through
          two rounds of prototyping and moderated user testing, we raised task
          success from 60% to 94.4% and shipped a navigation that measurably
          improved engagement across the whole network.
        </p>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 pb-10 mb-10 border-b border-separator">
          <div>
            <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
              Client
            </dt>
            <dd>
              <a
                href="https://www.kinja.com/"
                className="underline hover:text-foreground"
              >
                G/O Media
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
              Year
            </dt>
            <dd>2019</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
              Scope
            </dt>
            <dd>Navigation redesign</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
              My role
            </dt>
            <dd>UX design, user testing, front-end</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
              Tools
            </dt>
            <dd>Design sprint, Pingpong, Sketch, Invision</dd>
          </div>
        </dl>

        <CaseFigure>
          <CaseVideo src="/kinjanav/hero.mp4" bgColor="#b4cefa" />
        </CaseFigure>

        {/* Problem statement */}
        <section className="pb-12 mb-12 border-b border-separator">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            The problem
          </p>
          <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
            Readers couldn&apos;t tell where they were — or how to get back
          </h2>
          <div className="space-y-4 max-w-[720px]">
            <aside className="border-l-2 border-accent-border bg-accent-muted pl-5 pr-4 py-4 my-2">
              <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
                About Kinja
              </p>
              <p>
                <a
                  href="https://kinja.com/"
                  className="underline hover:text-foreground"
                >
                  Kinja
                </a>{" "}
                is a CMS and publishing platform of G/O Media, powering sites
                like{" "}
                <a
                  href="https://gizmodo.com/"
                  className="underline hover:text-foreground"
                >
                  Gizmodo
                </a>
                ,{" "}
                <a
                  href="https://www.theonion.com/"
                  className="underline hover:text-foreground"
                >
                  The Onion
                </a>
                ,{" "}
                <a
                  href="https://jezebel.com/"
                  className="underline hover:text-foreground"
                >
                  Jezebel
                </a>
                ,{" "}
                <a
                  href="https://kotaku.com/"
                  className="underline hover:text-foreground"
                >
                  Kotaku
                </a>
                ,{" "}
                <a
                  href="https://www.avclub.com/"
                  className="underline hover:text-foreground"
                >
                  The A.V. Club
                </a>{" "}
                and more. Together these G/O brands reach around{" "}
                <em>100 million unique readers a month.</em>
              </p>
            </aside>
            <p>
              By 2019 Kinja had many page types, story formats and
              categorization pages, but navigation lagged behind. There was no
              consistent navigation component that&apos;d follow you around and
              indicate where you are.{" "}
              <Highlight>
                The problem was people could easily get lost.
              </Highlight>{" "}
              Notice how navigation collapses on the example below: the section
              menu disappears, the logo changes and now links to the Muse front
              page. There&apos;s no obvious way to get back to the Jezebel front
              page.
            </p>
          </div>

          <CaseFigure caption="Problem: clicking on a Muse story on the Jezebel home page makes most of the nav disappear.">
            <CaseVideo src="/kinjanav/problem.mp4" loop />
          </CaseFigure>

          <div className="space-y-4 max-w-[720px]">
            <p>
              We knew many visitors bounce back and forth between front page and
              articles. We had a strong inclination we could make their
              experience better.
            </p>
            <p>
              Another hypothesis of ours was most of our readers have little
              sense of the hierarchy between our brands, and struggle to
              distinguish main sites from sections (eg. The Muse is a branded
              section of Jezebel). We wanted to fix that too.
            </p>
            <p>
              We decided it&apos;s time for a redesign and set out 3 business
              goals:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Increase <Highlight>User Engagement</Highlight> by allowing
                readers to explore content across front pages, sections, and
                article pages with confidence.
              </li>
              <li>
                Expand individual <Highlight>Brand Voice</Highlight> for each
                site while maintaining simplicity of a consistent navigation UI.
              </li>
              <li>
                <Highlight>Network Effect</Highlight>: introduce users to sites
                across the network through a clear navigation structure.
              </li>
            </ul>
          </div>
        </section>

        {/* Users and audience */}
        <section className="pb-12 mb-12 border-b border-separator">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            Users &amp; audience
          </p>
          <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
            Readers first — but editors and advertisers count too
          </h2>
          <div className="space-y-4 max-w-[720px]">
            <p>
              The primary audience was Kinja&apos;s readers: around 100 million
              people a month, split roughly 50–50 between mobile and desktop.
              Many of them bounce back and forth between front pages and
              articles, and a dedicated group of cross-site readers jumps
              between brands daily. Navigation also serves two secondary
              audiences: authors publishing and managing posts, and advertisers
              keeping an eye on their sponsored sites, sections and posts.
            </p>
            <p>
              Before sketching anything, we listed what each audience needs
              from navigation and ranked the goals by assumed importance,
              grounding our assumptions in analytics data and earlier
              qualitative research.
            </p>
            <UserGoalTable />
          </div>
        </section>

        {/* Roles and responsibilities */}
        <section className="pb-12 mb-12 border-b border-separator">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            Role &amp; team
          </p>
          <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
            Five designers, one engineer, two continents
          </h2>
          <div className="space-y-4 max-w-[720px]">
            <p>
              The project was a team effort of 5 designers, 1 project manager
              and 1 engineer. There were no strict roles inside the design team,
              we shared research, ideation, prototyping and testing tasks as
              much as possible.
            </p>
            <p>
              My responsibilities were designing one of our 3 candidate
              concepts, writing the task scenarios for testing, organizing user
              interviews, conducting 6 of them, analyzing another 6, fitting
              the winning concept into our design system, and helping implement
              it in CSS.
            </p>
          </div>
        </section>

        {/* Scope and constraints */}
        <section className="pb-12 mb-12 border-b border-separator">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            Scope &amp; constraints
          </p>
          <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
            One navigation system for every brand, page type and screen
          </h2>
          <div className="space-y-4 max-w-[720px]">
            <p>
              The scope was the platform-wide navigation UI: the network nav,
              the section nav and the site header, across homepages, section
              pages and article pages. A few constraints shaped the work:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                The same components had to work for every G/O Media brand —
                from Gizmodo to The Onion — while leaving room for each
                brand&apos;s voice.
              </li>
              <li>
                With a 50–50 mobile-desktop split, every concept had to be
                designed and tested twice, once for each form factor.
              </li>
              <li>
                We were split between Europe and the US, so most collaboration
                happened asynchronously.
              </li>
              <li>
                This was the first project at Kinja to rely heavily on
                qualitative user testing, so we had to build the research
                foundations — guidelines, screeners, scoring — from scratch.
              </li>
            </ul>
          </div>
        </section>

        {/* Process */}
        <section className="pb-12 mb-12 border-b border-separator">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            Process
          </p>
          <h2 className="pb-8 text-xl xl:text-2xl">
            What we did, why, and what we learned
          </h2>

          <div className="space-y-12 max-w-[720px]">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                1
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  Analytics revealed surprisingly heavy network-nav use
                </h3>
                <p>
                  We started with quantitative data we already had, to ground
                  the redesign in evidence rather than opinions. The data
                  surprised us: the network nav had higher usage than section
                  navs, especially on homepages — even though the network nav
                  is hidden on small screens.
                </p>
                <ClickData />
                <p>
                  This told us that jumping between sites is a real reader
                  behavior, not an edge case. Combined with the ranked user
                  goals, it gave the whole team a shared, evidence-based
                  picture of what the new navigation had to do before anyone
                  drew a single sketch.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                2
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  Dot-voting left three concepts standing — and no consensus
                </h3>
                <p>
                  Then we did some competitor analysis, and shared our ideas in
                  a remote whiteboarding session. We sketched out a couple of
                  concepts and dot-voted on them.
                </p>
                <CaseFigure caption="Some of our initial sketches">
                  <div className="relative aspect-4/3 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.sketches1}
                      alt="Initial navigation sketches"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
                <p>
                  Not one but three concepts got chosen. Rather than argue from
                  taste, we decided to let evidence pick the winner.{" "}
                  <Highlight>We realized we need qualitative testing</Highlight>{" "}
                  to get what goes on inside people&apos;s heads when they
                  navigate.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                3
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  Three concepts became six prototypes, built around five real
                  tasks
                </h3>
                <p>
                  To compare the concepts fairly, we needed all of them to
                  support the same realistic scenarios. I was tasked to write
                  the task scenarios the comparison would be based on:
                </p>
                <ol className="space-y-0 overflow-hidden rounded-[20px] border border-separator bg-accent-muted">
                  {[
                    "What site are you on?",
                    "How'd you go about learning more about this site?",
                    "How'd you go about finding an article you read here a few days ago?",
                    "How'd you change your profile picture?",
                    "How'd you check if there's a new video up?",
                  ].map((task, i) => (
                    <li
                      key={task}
                      className="flex gap-3 border-b border-separator px-4 py-3 last:border-0"
                    >
                      <span className="shrink-0 tabular-nums text-tertiary-foreground">
                        {i + 1}.
                      </span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ol>
                <p>
                  We went on to convert our concepts into 3 interactive
                  prototypes designed to accommodate the task scenarios. The
                  ratio of mobile-desktop kinja users was around 50-50 at that
                  point, so we decided to create both mobile and desktop
                  versions of each prototype.
                </p>
                <CaseFigure caption='"Kibbon" uses a ribbon-like network nav to visualize hierarchy. This is the prototype I worked on.'>
                  <div className="relative aspect-4/3 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.kibbon}
                      alt="Kibbon prototype"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
                <CaseFigure caption='"Magic cards", a concept centered around extended branding and a full-page network nav with colorful tiles.'>
                  <div className="relative aspect-4/3 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.magiccards}
                      alt="Magic cards prototype"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
                <CaseFigure caption='The "ODC" prototype was based on a previous collaboration with a design agency. It treats the section nav as a tab-bar and the network nav as a slide-over menu.'>
                  <div className="relative aspect-4/3 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.odc}
                      alt="ODC prototype"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                4
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  14 moderated tests showed us why people got lost
                </h3>
                <p>
                  This was the first time we heavily utilized qualitative user
                  testing at Kinja. We had to lay out the foundations. We agreed
                  on guidelines, wrote a test and analysis plan, perfected our
                  interview skills with friends and wrote a recruitment
                  screener.
                </p>
                <p>
                  I managed the recruitment platform, and put together the
                  scoring sheet we used to process data. Tasks were rated on a
                  3-step scale (success/mixed/fail), like this:
                </p>
                <CaseFigure caption="Task scoring sheet">
                  <div className="relative aspect-16/10 overflow-hidden rounded-[20px] border border-separator bg-accent-muted">
                    <OptimizedImage
                      image={kinjaImages.scoring}
                      alt="Task scoring sheet"
                      fill
                      className="object-contain"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
                <p>
                  We interviewed 3–4 people per prototype, 14 people in total.
                  Mobile and desktop prototypes were shown to equal number of
                  people.
                </p>
                <CaseFigure caption="Screen recordings from the first round of interviews (shared with participants' consent)">
                  <div className="relative aspect-16/10 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.interviews}
                      alt="Interview screen recordings collage"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                5
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  Familiar patterns worked, clever branding backfired
                </h3>
                <p>
                  We carefully watched back the recordings, rated tasks and took
                  notes. No interviewer analyzed their own interview. In the end
                  we had structured data (task completion rates) and a lot of
                  unstructured notes and quotes from participants thinking
                  aloud. We listed our conclusions and had a long meeting
                  discussing what worked and what didn&apos;t.
                </p>
                <LearningsTable />
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                6
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  A second round validated the merged design: 94.4% task
                  success
                </h3>
                <p>
                  With the learnings in our hand we wanted to distill things
                  down to a single prototype and test it. We sketched together
                  again, chose a winner idea and made the prototype.
                </p>
                <p>
                  We recruited 10 new testers and went through the same
                  questions and tasks with them. The tests basically validated
                  our designs this time. The second round prototype achieved a{" "}
                  <Highlight>
                    94.4% task success rate, compared to a 72% average in round
                    1.
                  </Highlight>{" "}
                  We knew we have something we can implement with confidence.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
              <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-accent-border text-foreground text-sm font-medium">
                7
              </div>
              <div className="space-y-4 min-w-0">
                <h3 className="text-lg xl:text-xl font-medium">
                  We shipped in phases — and let an A/B test settle the last
                  debate
                </h3>
                <p>
                  We broke development down to phases and I started working with
                  our engineer to build the layout and styles of the new
                  components. We had the foundations of a design system in
                  place, so we could use color, spacing and typography tokens,
                  our layout grid and SVG components. Here&apos;s the Gizmodo
                  homepage before and after the redesign.
                </p>
                <CaseFigure
                  caption={
                    <>
                      <a
                        href="https://gizmodo.com/"
                        className="underline hover:text-foreground"
                      >
                        Site home page
                      </a>{" "}
                      before (right) and after (left). Slide to compare.
                    </>
                  }
                >
                  <CompareImages
                    left={kinjaImages.homepageAfter}
                    right={kinjaImages.homepageBefore}
                  />
                </CaseFigure>
                <p>
                  We made frequently used features more accessible, added a
                  tagline for first-time visitors, made the section nav work
                  like a tab bar with a clearly indicated active item. We also
                  made the nav more compact and moved content slightly higher up
                  the page by shrinking the logo.
                </p>
                <CaseFigure
                  caption={
                    <>
                      <a
                        href="https://sports.theonion.com/mlb-hoping-to-boost-attendance-at-league-meetings-with-1830991212"
                        className="underline hover:text-foreground"
                      >
                        Mobile story page
                      </a>{" "}
                      before (right) and after (left). Slide to compare.
                    </>
                  }
                >
                  <CompareImages
                    left={kinjaImages.articleAfter}
                    right={kinjaImages.articleBefore}
                  />
                </CaseFigure>
                <p>
                  On mobile the section nav overflows the screen and can be
                  scrolled horizontally. The active item is always in view on
                  page load.
                </p>
                <CaseFigure
                  caption={
                    <>
                      <a
                        href="https://earther.gizmodo.com/"
                        className="underline hover:text-foreground"
                      >
                        Section home page
                      </a>{" "}
                      before (right) and after (left). Slide to compare.
                    </>
                  }
                >
                  <CompareImages
                    left={kinjaImages.verticalAfter}
                    right={kinjaImages.verticalBefore}
                  />
                </CaseFigure>
                <p>
                  Branding sections was a clear editorial need. We still liked
                  the idea of section headers, even though it performed poorly
                  in round 1. We tried overlaying content on it so it looks more
                  part of the site and less like an ad. It worked! In round 2{" "}
                  <Highlight>
                    all 10 test participants identified Gizmodo as the main site
                  </Highlight>
                  , and 9 understood Earther to be a section within Gizmodo.
                </p>
                <CaseFigure caption="The new Explore page.">
                  <div className="relative aspect-4/3 overflow-hidden rounded-[20px]">
                    <OptimizedImage
                      image={kinjaImages.explore}
                      alt="Explore page"
                      fill
                      className="object-cover"
                      sizes="(max-width: 960px) 100vw, 720px"
                    />
                  </div>
                </CaseFigure>
                <p>
                  The hamburger button leads to a brand new Explore page, where
                  people can see all sections and network sites with
                  descriptions.
                </p>
                <p>
                  With the Explore page we weren&apos;t sure we need the black
                  network bar at the top. Historically it received a lot of
                  clicks, but the Explore page might render it redundant. We ran
                  an A/B test and removed the network bar for a small percentage
                  of users. Feedback was overwhelming. Turns out, avid
                  cross-site readers are quite attached to the network bar and
                  use it frequently to jump between sites. We decided to keep
                  it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes and lessons */}
        <section className="pb-4">
          <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
            Outcomes &amp; lessons
          </p>
          <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
            Task success up from 60% to 94.4%, engagement up network-wide
          </h2>
          <div className="space-y-4 max-w-[720px]">
            <p>
              The new navigation was an improvement in experience, especially
              for newcomers. Tasks performed by test participants were 94.4%
              successful, compared to the 60% success rate we measured on the
              previous navigation.
            </p>
            <div className="my-8">
              <OutcomeStat value="57.3%" label="Task success rate" arrow={2} />
            </div>
            <p>
              Our data team A/B tested the new nav for 2 weeks to see how it
              affects business metrics. The result was, it performed better or
              the same as control. Moving the search and profile menu out of the
              black network bar increased their CTR by 10% and 14%. Section nav
              CTR improved slightly (by less than 1%) both on the front page and
              article pages.
            </p>
            <p>
              Most importantly, our overall engagement metrics showed some
              improvement too.
            </p>
            <div className="my-8 flex flex-wrap gap-10">
              <OutcomeStat
                value="1.6%"
                label="Average session length"
                arrow={1}
              />
              <OutcomeStat
                value="2.2%"
                label="Page views per session"
                arrow={2}
              />
            </div>
            <p>We released the new nav for 100% of our users in April 2019.</p>
            <h3 className="pt-6 text-lg xl:text-xl font-medium">
              What I&apos;d take with me
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Highlight>Test branding assumptions with real users.</Highlight>{" "}
                Branded section headers read as ads until we overlaid content
                on them — without testing, we would have shipped a component
                readers ignored.
              </li>
              <li>
                <Highlight>Data beats intuition when removing features.</Highlight>{" "}
                We assumed the Explore page made the black network bar
                redundant, but the A/B test proved avid cross-site readers
                depend on it. We kept it.
              </li>
              <li>
                <Highlight>Research foundations compound.</Highlight> The
                guidelines, screener and scoring sheet we built for round one
                made round two much faster to run — and left the team with a
                repeatable testing process.
              </li>
              <li>
                <Highlight>Next time, involve users even earlier.</Highlight>{" "}
                Building and testing three full prototypes was expensive; rough
                testing at the sketching stage might have narrowed the field
                sooner.
              </li>
            </ul>
          </div>
        </section>
      </DeferCaseBody>
    </main>
  );
}
