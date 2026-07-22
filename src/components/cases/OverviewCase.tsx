import { caseHeroes } from "@/assets/case-heroes";
import BackLink from "@/components/BackLink";
import DeferCaseBody from "@/components/DeferCaseBody";
import SharedCaseImage from "@/components/SharedCaseImage";
import { CASE_HERO_SIZES, CASE_LAYOUT_IDS } from "@/lib/portfolio";

type OverviewCaseProps = {
  iconsOn?: boolean;
  onHeroLayoutComplete?: () => void;
};

export default function OverviewCase({
  iconsOn = false,
  onHeroLayoutComplete,
}: OverviewCaseProps) {
  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto text-lg md:text-base xl:text-xl">
      <BackLink className="inline-block mb-8" />
      <SharedCaseImage
        layoutId={CASE_LAYOUT_IDS.overview}
        image={caseHeroes.overview}
        alt="Overview"
        className={`w-full aspect-5/4 mb-8 ${
          iconsOn
            ? "border border-gray-200 bg-gray-50"
            : "border border-yellow-200 bg-accent-muted"
        }`}
        sizes={CASE_HERO_SIZES}
        priority
        onLayoutAnimationComplete={onHeroLayoutComplete}
      />
      <DeferCaseBody>
      <p className="mb-3 text-sm uppercase tracking-[0.08em] text-tertiary-foreground">
        Product Design Case Study
      </p>
      <h1 className="pb-4 text-2xl xl:text-3xl max-w-[700px]">
        The dashboard nobody needed
      </h1>
      <p className="max-w-[640px] mb-10">
        LastPass outgrew its Admin Console landing page. We designed a new one
        from first principles.
      </p>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 pb-10 mb-10 border-b border-separator">
        <div>
          <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
            Role
          </dt>
          <dd>Lead Product Designer</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
            Designer
          </dt>
          <dd>Daniel Péger</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
            Team
          </dt>
          <dd>PM, UX Researcher, UX Writer, Engineers</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
            Timeline
          </dt>
          <dd>2025 — ongoing</dd>
        </div>
        <div>
          <dt className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-1">
            Status
          </dt>
          <dd className="text-foreground font-medium">In progress</dd>
        </div>
      </dl>

      {/* Context */}
      <section className="pb-12 mb-12 border-b border-separator">
        <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
          Context
        </p>
        <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
          Password management is becoming a commodity — LastPass is evolving
          beyond it
        </h2>
        <div className="space-y-4 max-w-[720px]">
          <p>
            <strong className="font-medium text-foreground">LastPass</strong> is
            a password and identity management platform used by over 100,000
            businesses — primarily small and mid-size organizations. It helps
            teams secure credentials through encrypted vaults, password
            generation, secure sharing, and single sign-on.
          </p>
          <p>
            The market is shifting fast. Google, Apple, and Microsoft are
            building password management into their platforms.
          </p>
          <p>
            To stay relevant, LastPass is expanding into broader security
            tooling — SaaS application monitoring, shadow IT detection, and
            access governance — giving IT admins reasons to stay that go beyond
            password storage.
          </p>
          <p>
            The{" "}
            <strong className="font-medium text-foreground">
              Admin Console
            </strong>{" "}
            (internally called &quot;UAC&quot;) is where IT admins manage their
            organization&apos;s LastPass deployment: provisioning users,
            configuring security policies, monitoring password health, managing
            shared folders, and — with the Business Max tier — tracking SaaS
            usage and enforcing access controls.
          </p>
          <p>
            The console&apos;s landing page is the first screen admins see when
            they log in. It&apos;s the single most valuable piece of real estate
            in the product — and the focus of this project.
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="pb-12 mb-12 border-b border-separator">
        <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
          Problem
        </p>
        <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
          The landing page didn&apos;t reflect what the product had become
        </h2>
        <div className="space-y-4 max-w-[720px]">
          <p>
            LastPass had expanded into SaaS Monitoring and SaaS Protect — but
            the Admin Console&apos;s landing page still showed nothing more than
            an adoption chart (users invited, users signed up, users who are
            active). The first screen admins saw represented a fraction of what
            the product could now do.
          </p>
          <p>The problems were clear:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium text-foreground">
                Missing product surface.
              </strong>{" "}
              SaaS Monitoring, SaaS Protect, security insights, and actionable
              alerts had no presence on the landing page — admins had to know
              where to look.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Adoption-only framing.
              </strong>{" "}
              The page treated &quot;how many users activated&quot; as the whole
              story, ignoring security posture, risk, and ongoing management.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                Passive, not active.
              </strong>{" "}
              The dashboard displayed numbers but never told admins what to{" "}
              <em>do</em> about them.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                No reason to stay.
              </strong>{" "}
              Most admins skipped it entirely and navigated straight to user
              management.
            </li>
          </ul>
          <aside className="border-l-2 border-yellow-200 bg-accent-muted pl-5 pr-4 py-4 my-6">
            <p>
              <strong className="font-medium text-foreground">
                The overarching goal:
              </strong>{" "}
              Provide an at-a-glance view of the current state of the product(s)
              and surface critical actions the admin should take immediately.
            </p>
          </aside>
        </div>
      </section>

      {/* Process */}
      <section className="pb-12 mb-12 border-b border-separator">
        <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
          Process
        </p>
        <h2 className="pb-8 text-xl xl:text-2xl">From charts to actions</h2>

        <div className="space-y-12 max-w-[720px]">
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              1
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Getting the team together
              </h3>
              <p>
                We started with a cross-functional planning session to align on
                the problem space, followed by a Design Studio workshop with 10
                team members — designers, PMs, engineers, and content designers.
                In two rounds of individual sketching and group critique, the
                team explored modular layouts, notification centers, and
                &quot;tip of the iceberg&quot; approaches.
              </p>
              <p>
                We defined primary objectives: increase feature and seat
                adoption, improve Security Score by driving remediation, reduce
                SaaS risk through continuous monitoring, and provide progressive
                disclosure (summary first, detail on demand).
              </p>
              <p>Recurring themes from the workshop:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-foreground">
                    Actionability over reporting
                  </strong>{" "}
                  — every data point should lead to a clear next step
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Progressive disclosure
                  </strong>{" "}
                  — &quot;tip of the iceberg&quot; with drill-downs to
                  dashboards
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Information hierarchy
                  </strong>{" "}
                  — quick insights at the top, details below
                </li>
              </ul>
              <p>
                We captured the team&apos;s hopes and fears. The top hope:{" "}
                <em>
                  &quot;Admins will be able to say: let me check the overview to
                  see if there&apos;s anything urgent going on with
                  LastPass.&quot;
                </em>{" "}
                The top fear:{" "}
                <em>
                  &quot;Unclear purpose — the overview page tries to do too many
                  things at once because it&apos;s the best real estate in the
                  UAC.&quot;
                </em>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              2
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Admins want names, not numbers
              </h3>
              <p>
                Our UX researcher conducted an unmoderated study with 21
                participants (15 Business, 6 Business Max) to understand which
                metrics admins consider essential. We asked them to sort 14
                metrics into &quot;must have,&quot; &quot;nice to have,&quot;
                and &quot;not important.&quot;
              </p>
              <div className="border-t border-separator pt-4 space-y-3">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground">
                  Key Findings
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    Must-have across both segments:
                  </strong>{" "}
                  Number of breached passwords, Biggest security risks right
                  now, Users with password issues, Top 5 riskiest users.
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    Business Max also prioritized:
                  </strong>{" "}
                  Policy gaps, Overall security score, New SaaS apps detected.
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    Both groups deprioritized:
                  </strong>{" "}
                  Total number of saved passwords (seen as not important).
                </p>
              </div>
              <p>
                We also learned behavioral patterns that would prove critical:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Most admins check dashboards{" "}
                  <strong className="font-medium text-foreground">
                    monthly or less
                  </strong>
                </li>
                <li>
                  They want{" "}
                  <strong className="font-medium text-foreground">
                    deeper, actionable per-user insights
                  </strong>{" "}
                  — not aggregate numbers
                </li>
                <li>
                  Their biggest concerns:{" "}
                  <strong className="font-medium text-foreground">
                    low adoption
                  </strong>{" "}
                  and{" "}
                  <strong className="font-medium text-foreground">
                    users not using LastPass properly
                  </strong>
                </li>
              </ul>
              <div className="border-t border-separator pt-4">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
                  Implication
                </p>
                <p>
                  Admins think in terms of{" "}
                  <strong className="font-medium text-foreground">
                    people, not numbers
                  </strong>
                  . Every metric should resolve to a list of named users.
                  &quot;7 breached passwords&quot; is meaningless; &quot;7 users
                  with breached passwords — here they are&quot; is actionable.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              3
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Eight principles that emerged
              </h3>
              <p>
                Before exploring solutions, we established a set of principles
                drawn from our research insights, the team&apos;s workshop
                discussions, and our understanding of admin behavior. These
                guided every design decision that followed.
              </p>
              <ul className="space-y-6">
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Not another f-ing dashboard
                  </p>
                  <p className="text-secondary-foreground">
                    This page should not be a metrics dashboard. It should be a
                    starting point for action — a place that tells you what
                    needs attention and helps you get to the right task.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Move toward security posture
                  </p>
                  <p className="text-secondary-foreground">
                    The landing experience should move admins toward the overall
                    goal of LastPass: improving organizational security posture.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Overview with depth on demand
                  </p>
                  <p className="text-secondary-foreground">
                    Provide an at-a-glance view of system status, with the
                    ability to dig deeper into any area.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Insight must be actionable
                  </p>
                  <p className="text-secondary-foreground">
                    Every piece of information shown should lead to a clear next
                    step. No dead-end data.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Accommodate user &quot;modes&quot;
                  </p>
                  <p className="text-secondary-foreground">
                    Admins arrive in different modes: setup &amp; discovery in
                    the early phase, user management when things are running,
                    and solving an alert or problem.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    Time-anchored, not static
                  </p>
                  <p className="text-secondary-foreground">
                    Every metric should be relative to the admin&apos;s last
                    visit. &quot;12 breached passwords&quot; means nothing.
                    &quot;12 breached passwords, 4 more than last month&quot;
                    drives action.
                  </p>
                </li>
                <li className="border-b border-separator pb-4">
                  <p className="font-medium text-foreground mb-1">
                    People, not numbers
                  </p>
                  <p className="text-secondary-foreground">
                    Every metric should resolve to a list of named users. Admins
                    don&apos;t manage numbers; they manage people.
                  </p>
                </li>
                <li>
                  <p className="font-medium text-foreground mb-1">
                    Earn attention for new features
                  </p>
                  <p className="text-secondary-foreground">
                    SaaS monitoring should show up as findings the admin cares
                    about, not as feature announcements they&apos;ll dismiss.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              4
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Three meaningfully different concepts
              </h3>
              <p>
                Using the research as a foundation, I explored three distinct
                conceptual directions — each representing a fundamentally
                different organizing principle for the landing page. The goal
                wasn&apos;t to pick a winner immediately, but to map the design
                space and understand the tradeoffs. Each concept started from
                the same research but asked a different question.
              </p>

              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-left text-sm xl:text-base border-collapse">
                  <thead>
                    <tr className="border-b border-separator">
                      <th className="py-3 pr-4 font-medium text-tertiary-foreground uppercase tracking-[0.04em] text-xs xl:text-sm">
                        Concept
                      </th>
                      <th className="py-3 pr-4 font-medium text-tertiary-foreground uppercase tracking-[0.04em] text-xs xl:text-sm">
                        Organizing Principle
                      </th>
                      <th className="py-3 pr-4 font-medium text-tertiary-foreground uppercase tracking-[0.04em] text-xs xl:text-sm">
                        Core Question
                      </th>
                      <th className="py-3 font-medium text-tertiary-foreground uppercase tracking-[0.04em] text-xs xl:text-sm">
                        Mental Model
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-separator align-top">
                      <td className="py-3 pr-4 font-medium text-foreground">
                        The Briefing
                      </td>
                      <td className="py-3 pr-4">Events over time</td>
                      <td className="py-3 pr-4">
                        &quot;What happened since I was last here?&quot;
                      </td>
                      <td className="py-3">Morning news briefing</td>
                    </tr>
                    <tr className="border-b border-separator align-top">
                      <td className="py-3 pr-4 font-medium text-foreground">
                        The People Map
                      </td>
                      <td className="py-3 pr-4">Users and their states</td>
                      <td className="py-3 pr-4">
                        &quot;Who needs my attention?&quot;
                      </td>
                      <td className="py-3">ER triage board</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-3 pr-4 font-medium text-foreground">
                        The Security Review
                      </td>
                      <td className="py-3 pr-4">Guided workflow</td>
                      <td className="py-3 pr-4">
                        &quot;Have I checked everything?&quot;
                      </td>
                      <td className="py-3">Pre-flight checklist</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="pt-4 text-base xl:text-lg font-medium text-foreground">
                Concept 1: The Briefing
              </h4>
              <p>
                Reframes the landing page from a dashboard to a{" "}
                <em>return visit debrief</em>. Since admins visit monthly,
                static numbers are useless — delta is everything.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  A{" "}
                  <strong className="font-medium text-foreground">
                    plain-language narrative summary
                  </strong>{" "}
                  of what changed since the admin&apos;s last login, with every
                  referenced item hyperlinked to a deep-dive
                </li>
                <li>
                  A prioritized{" "}
                  <strong className="font-medium text-foreground">
                    action queue
                  </strong>{" "}
                  of tasks requiring a decision — not metrics, but things like
                  pending password resets and MFA approvals, with inline
                  resolution buttons
                </li>
                <li>
                  A compact{" "}
                  <strong className="font-medium text-foreground">
                    scorecard
                  </strong>{" "}
                  of 4–5 health metrics shown as trends, each linking to the
                  relevant user list
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Multi-admin awareness:
                  </strong>{" "}
                  the summary credits what other admins handled before showing
                  what&apos;s still outstanding
                </li>
              </ul>

              <h4 className="pt-4 text-base xl:text-lg font-medium text-foreground">
                Concept 2: The People Map
              </h4>
              <p>
                Admins asked for &quot;riskiest users&quot; and &quot;users with
                password issues&quot; — questions about <em>people</em>, not
                metrics. This concept makes the landing page a smarter version
                of user management itself.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The entire user population shown as{" "}
                  <strong className="font-medium text-foreground">
                    segments
                  </strong>
                  : Need Your Action, At Risk (ranked by severity), Not
                  Onboarded, Shadow IT Exposure, and Healthy
                </li>
                <li>
                  Every segment shows{" "}
                  <strong className="font-medium text-foreground">
                    real people by name
                  </strong>{" "}
                  with inline actions — the admin never has to translate a
                  number into a person
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    State-based, not time-based
                  </strong>{" "}
                  — always reflects current reality. If another admin resolved
                  an issue, the person simply moves out of the segment. No
                  narrative reconciliation needed.
                </li>
                <li>
                  Tradeoff: removes a layer of abstraction, but lacks the
                  &quot;what changed&quot; temporal context
                </li>
              </ul>

              <h4 className="pt-4 text-base xl:text-lg font-medium text-foreground">
                Concept 3: The Security Review
              </h4>
              <p>
                Admins visit monthly, poke around without structure, and leave
                without confidence they&apos;ve checked everything. This concept
                reframes the landing page as a{" "}
                <strong className="font-medium text-foreground">
                  completable workflow
                </strong>{" "}
                — a guided security review with a clear endpoint.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The system generates a{" "}
                  <strong className="font-medium text-foreground">
                    contextual checklist
                  </strong>{" "}
                  each visit. Areas that are fine auto-resolve; areas needing
                  judgment expand with context and action options.
                </li>
                <li>
                  When done, produces a{" "}
                  <strong className="font-medium text-foreground">
                    downloadable summary
                  </strong>{" "}
                  — proof of diligence and a communication tool for leadership
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Guaranteed coverage:
                  </strong>{" "}
                  admins see SaaS exposure, password health, and adoption even
                  if they&apos;d normally skip to user management
                </li>
                <li>
                  Risk: could feel heavy-handed for an admin who just wants to
                  reset one user&apos;s password
                </li>
              </ul>

              <p>
                I translated these concepts into wireframes and presented all
                three to the team alongside the research findings and design
                principles. The team used dot voting to signal preferences.
              </p>

              <figure className="my-6">
                <p className="text-secondary-foreground">
                  Wireframe explorations: Briefing concept, People Map concept,
                  Check-In workflow, and early onboarding experience.{" "}
                  <a
                    href="https://www.figma.com/design/rblhNiYFbqVAHqm5eApL8A/Overview-db?node-id=692-25332"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    View in Figma →
                  </a>
                </p>
              </figure>

              <div className="border-t border-separator pt-4 space-y-3">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground">
                  Team Response
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    The People Map
                  </strong>{" "}
                  received the most votes and resonated strongly — but the team
                  noted it felt like &quot;a different project,&quot; closer to
                  a reimagined Users page than a landing experience. One
                  stakeholder wrote:{" "}
                  <em>
                    &quot;We need to figure out how to validate this mental
                    model because the &apos;Manage Users&apos; perspective
                    becomes a Product Principle for the UAC.&quot;
                  </em>
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    The Briefing
                  </strong>{" "}
                  was seen as the most pragmatic starting point and closest to a
                  buildable landing experience.
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    The Security Review
                  </strong>{" "}
                  was appreciated as an idea but was felt to be a separate
                  feature. One comment:{" "}
                  <em>
                    &quot;I like this wizard for a first-visit experience, but
                    it doesn&apos;t seem long-lived.&quot;
                  </em>
                </p>
              </div>

              <div className="border-t border-separator pt-4">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
                  Decision
                </p>
                <p>
                  We chose to{" "}
                  <strong className="font-medium text-foreground">
                    combine the Briefing and People Map concepts
                  </strong>
                  . The Briefing provides the &quot;what changed&quot; context
                  through time-anchored summaries and a prioritized action
                  queue. The People Map provides the people-centric framing —
                  every item in the action queue ties to a specific user, and
                  every metric resolves to a user list. The Security Review was
                  deferred as a potential future feature. This hybrid approach
                  serves both the admin who arrives with a specific task (the
                  reactive majority) and the admin who wants to assess overall
                  posture (the proactive minority).
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              5
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                &quot;Jamie is locked out&quot; — admins already arrive with a
                job to be done
              </h3>
              <p>
                We conducted 7 in-depth discovery interviews with Business-tier
                admins to understand <em>why</em> they open the Admin Console
                and what they&apos;re thinking when they land. This was the most
                consequential research phase of the project.
              </p>
              <div className="border-t border-separator pt-4 space-y-3">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground">
                  Why do admins open the Admin Console?
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="font-medium text-foreground">
                      Someone can&apos;t access something
                    </strong>{" "}
                    — the universal reactive trigger.{" "}
                    <em>Every participant mentioned it.</em>
                  </li>
                  <li>
                    <strong className="font-medium text-foreground">
                      Someone joined or left
                    </strong>{" "}
                    — onboarding/offboarding.{" "}
                    <em>Every participant mentioned it.</em>
                  </li>
                  <li>
                    <strong className="font-medium text-foreground">
                      Routine audit/hygiene
                    </strong>{" "}
                    — ranges from daily to semi-annual.
                  </li>
                  <li>
                    <strong className="font-medium text-foreground">
                      A project is underway
                    </strong>{" "}
                    — federation rollout, policy review. Episodic but intensive.
                  </li>
                  <li>
                    <strong className="font-medium text-foreground">
                      Security incident
                    </strong>{" "}
                    — rare but urgent.
                  </li>
                </ol>
              </div>
              <p>What they&apos;re thinking when they land:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>&quot;Who needs access fixed?&quot;</li>
                <li>&quot;Who do I need to add or remove?&quot;</li>
                <li>&quot;Is everyone in the right groups?&quot;</li>
                <li>&quot;Are there any anomalies?&quot;</li>
              </ul>
              <p>
                The research also surfaced critical pain points: no seamless
                credential handover during offboarding (mentioned by 4/7),
                hidden MFA reset actions (admins were deleting and recreating
                accounts), and a security score that showed a number without any
                guidance on how to improve it.
              </p>
              <aside className="border-l-2 border-yellow-200 bg-accent-muted pl-5 pr-4 py-4">
                <p>
                  <strong className="font-medium text-foreground">
                    Key reframe:
                  </strong>{" "}
                  Most visits are <em>reactive</em>, not proactive. Admins
                  arrive with a specific person in mind — &quot;Jamie is locked
                  out&quot; — not to browse a dashboard. The landing page must
                  serve this reactive mode first and fast.
                </p>
              </aside>
              <div className="border-t border-separator pt-4">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
                  Design Impact
                </p>
                <p>
                  This research led to three major design changes: (1) adding a{" "}
                  <strong className="font-medium text-foreground">
                    user search
                  </strong>{" "}
                  at the top of the page as the primary interaction, (2)
                  de-emphasizing passive metrics in favor of{" "}
                  <strong className="font-medium text-foreground">
                    actionable notifications
                  </strong>
                  , and (3) organizing content around{" "}
                  <strong className="font-medium text-foreground">
                    admin mental questions
                  </strong>{" "}
                  rather than our internal feature categories.
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              6
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Introducing the Action Center
              </h3>
              <p>
                I developed the wireframes into a complete high-fidelity
                prototype. The design introduced a new page called the{" "}
                <strong className="font-medium text-foreground">
                  &quot;Action Center&quot;
                </strong>{" "}
                — a name chosen to signal its purpose: this is where you come to
                take action, not to stare at charts.
              </p>
              <p>Key design decisions in the hi-fi:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-foreground">
                    AI-powered entry point
                  </strong>{" "}
                  at the top — a text field that acts as both a search bar and a
                  natural language interface, with common JTBD actions as quick
                  prompts below it
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    &quot;Needs your attention&quot;
                  </strong>{" "}
                  — a prioritized queue of items requiring admin action, with
                  inline resolution buttons (reset password, approve MFA
                  request, dismiss)
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    &quot;Since your last visit&quot;
                  </strong>{" "}
                  — three time-anchored metric cards (Security score, Active
                  usage rate, Apps with alerts) with sparklines showing trends,
                  plus an AI-generated narrative summary
                </li>
              </ul>
              <figure className="my-6">
                <p className="text-secondary-foreground">
                  The Action Center design as it went into user testing.{" "}
                  <a
                    href="https://www.figma.com/design/rblhNiYFbqVAHqm5eApL8A/Overview-db?node-id=648-41657"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    View in Figma →
                  </a>
                </p>
              </figure>
            </div>
          </div>

          {/* Step 7 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              7
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                10/10 testers understood the page immediately
              </h3>
              <p>
                We tested the Action Center prototype with 10 participants — 7
                in unmoderated sessions (Great Question) and 3 in moderated
                sessions as part of ongoing admin discovery interviews.
              </p>
              <div className="border-t border-separator pt-4 space-y-3">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground">
                  Test Results
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    The Action Center concept landed clearly.
                  </strong>{" "}
                  Across all 10 participants, the page&apos;s purpose was
                  understood immediately and without prompting. The layout
                  communicated urgency effectively.
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    &quot;Needs your attention&quot; was the standout element.
                  </strong>{" "}
                  Most participants navigated straight to this section and
                  attempted to act on alerts before reading anything else.
                  Multiple participants immediately tried to click &quot;Reset
                  master password&quot; upon seeing the locked-out user alert.
                </p>
                <p>
                  <strong className="font-medium text-foreground">
                    &quot;Since your last visit&quot; was easy to miss.
                  </strong>{" "}
                  Participants didn&apos;t notice the section without scrolling.
                  When they did engage, high-priority updates (like a security
                  score drop) felt like they belonged higher on the page.
                </p>
              </div>
              <p>
                <strong className="font-medium text-foreground">
                  The AI chat concept generated mixed reactions.
                </strong>{" "}
                Enthusiasm was higher among participants with less regulated
                workflows. Admins in banking, financial services, and
                professional services raised concerns about data privacy,
                autonomous actions, lack of audit trails, and regulatory risk.
                The consensus: AI as a <em>guide</em> (surfacing information,
                suggesting actions) was welcome; AI as an <em>actor</em>{" "}
                (performing actions autonomously) was not.
              </p>
              <p>
                Most-wanted notifications across participants: failed logins,
                locked-out users, unauthorized access attempts, password resets,
                directory sync issues, and integration errors.
              </p>
            </div>
          </div>

          {/* Step 8 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              8
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Stakeholders wanted density; research said focus
              </h3>
              <p>
                After testing, we received additional feedback from product
                leadership and adjacent teams. Three themes emerged:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-foreground">
                    AI features deferred.
                  </strong>{" "}
                  The AI chat feature was dropped from the current scope. The
                  team needed more time to define the impact of AI features
                  across the product — including data governance, audit trails,
                  and an on/off control for regulated industries. The search bar
                  was simplified to a plain user search.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    More surface area for insights.
                  </strong>{" "}
                  Feedback suggested the design should &quot;bring forward
                  enough insights and functionality to create an
                  &apos;Aha!&apos; moment&quot; — especially for new admins. The
                  question of where the admin getting-started experience fits
                  into the page structure was flagged as a dependency.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Progressive disclosure, not simplification.
                  </strong>{" "}
                  I advocated for the design&apos;s core philosophy: the
                  Overview page should show a simple, filtered overview; the
                  details live in dedicated pages (Adoption Dashboard, Security
                  Dashboard, Reports). Several metric views proposed by
                  stakeholders were better suited to those dedicated pages.
                </li>
              </ul>
              <div className="border-t border-separator pt-4">
                <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
                  My response to the feedback
                </p>
                <p>
                  I agreed the design should better honor the original
                  requirement of showing &quot;an at-a-glance view of product
                  state&quot; — but pushed back on the solution being dense
                  metric widgets. The page should help admins achieve their goal{" "}
                  <em>and</em> provide a glanceable status, not force them to
                  wade through data.
                </p>
              </div>
            </div>
          </div>

          {/* Step 9 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted border border-yellow-200 text-foreground text-sm font-medium">
              9
            </div>
            <div className="space-y-4 min-w-0">
              <h3 className="text-lg xl:text-xl font-medium">
                Balancing research with stakeholder goals
              </h3>
              <p>
                The current iteration incorporates the testing feedback and
                stakeholder input. It preserves the core structure — search,
                notification queue, and time-anchored metrics — while addressing
                the key concerns.
              </p>
              <p>Notable changes from the tested version:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-foreground">
                    Simplified entry point.
                  </strong>{" "}
                  The AI chat was replaced with{" "}
                  <strong className="font-medium text-foreground">
                    &quot;Quickly find or add a user&quot;
                  </strong>{" "}
                  and recent user shortcuts — directly serving the #1 JTBD.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Proactive alert banner
                  </strong>{" "}
                  added (e.g., &quot;35 Shadow IT apps discovered&quot;) to
                  surface SaaS monitoring value without being promotional.
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    &quot;Needs your attention&quot;
                  </strong>{" "}
                  refined with clearer action categories (Security, Recommended)
                  and richer inline actions (view affected users, compose email,
                  view policy).
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Metric cards expanded
                  </strong>{" "}
                  with sub-metrics beneath each card (e.g., Security score →
                  breached passwords, users with low security score, master
                  password strength) and a contextual call to action for each.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="pb-12 mb-12 border-b border-separator">
        <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
          Outcomes so far
        </p>
        <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
          Admins stopped skipping the landing page
        </h2>
        <div className="space-y-4 max-w-[720px]">
          <p>
            While the project is ongoing and has not yet shipped, the research
            and testing phases have produced clear, validated outcomes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium text-foreground">
                The &quot;Action Center&quot; concept tested well.
              </strong>{" "}
              10 out of 10 participants understood the page&apos;s purpose
              without prompting. &quot;Needs your attention&quot; consistently
              drew first attention and drove immediate action attempts.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                The design reframe was validated.
              </strong>{" "}
              Moving from &quot;dashboard&quot; to &quot;action-oriented
              hub&quot; directly addressed the team&apos;s original fear — that
              admins would skip the page. In testing, participants engaged with
              the content rather than navigating away.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                AI must be opt-in and transparent.
              </strong>{" "}
              Regulated-industry admins require an on/off switch. AI as guide
              (not actor) is the acceptable pattern.
            </li>
            <li>
              <strong className="font-medium text-foreground">
                The JTBD framework changed how we build.
              </strong>{" "}
              The research revealed that most admin visits are reactive and
              people-centric — a finding that influenced not just this project
              but the team&apos;s broader product thinking about the console.
            </li>
          </ul>
        </div>
      </section>

      {/* Reflection */}
      <section className="pb-12">
        <p className="text-sm uppercase tracking-[0.08em] text-tertiary-foreground mb-3">
          Reflection
        </p>
        <h2 className="pb-4 text-xl xl:text-2xl max-w-[720px]">
          Research and stakeholder vision pulled in opposite directions
        </h2>
        <div className="space-y-4 max-w-[720px]">
          <p>
            The most challenging aspect of this project was reconciling user
            research with stakeholder expectations. Research told us admins
            arrive with a specific task and want to leave quickly. Stakeholders
            wanted &quot;Aha!&quot; moments that surface the product&apos;s
            value. Both are valid — the design challenge was honoring both
            without diluting either. Progressive disclosure became the answer: a
            simple, focused surface layer that rewards exploration without
            demanding it.
          </p>
          <h3 className="pt-4 text-lg xl:text-xl font-medium">
            The power of &quot;Not Another Dashboard&quot;
          </h3>
          <p>
            The team&apos;s shared fear of building &quot;just another
            dashboard&quot; became a productive constraint. It forced us to
            justify every element: does this help the admin understand what
            changed or what needs action? If the answer was no — if it was there
            for convenience, discoverability, or to fill space — it was fighting
            the page&apos;s core purpose.
          </p>
          <h3 className="pt-4 text-lg xl:text-xl font-medium">
            When to defer AI
          </h3>
          <p>
            We were excited about the AI chat concept. Testing showed it had
            potential — but also surfaced legitimate concerns we weren&apos;t
            ready to address (data governance, audit trails, regulatory
            compliance). Choosing to defer it rather than ship something
            half-formed was the right call, even though it simplified the design
            significantly.
          </p>
          <aside className="mt-8 border border-separator rounded-[20px] bg-accent-muted px-6 py-5 text-center">
            <p className="text-sm uppercase tracking-[0.06em] text-tertiary-foreground mb-2">
              Ongoing Project
            </p>
            <p>
              This case study will be updated as the project progresses through
              final stakeholder alignment, engineering handoff, implementation,
              and post-launch measurement.
            </p>
          </aside>
        </div>
      </section>
      </DeferCaseBody>
    </main>
  );
}
