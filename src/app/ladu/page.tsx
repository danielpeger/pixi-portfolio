import Image from "next/image";
import BackLink from "@/components/BackLink";

type LaduPageProps = {
  searchParams: Promise<{ icons?: string | string[] }>;
};

export default async function LaduPage({ searchParams }: LaduPageProps) {
  await searchParams;

  return (
    <main className="px-8 md:px-[72px] py-16 max-w-[960px] mx-auto">
      <BackLink className="inline-block mb-8 text-lg md:text-base xl:text-xl" />
      <div
        data-vt="ladu-image"
        className="ladu-hero relative w-full aspect-5/4 rounded-[20px] overflow-hidden mb-8 border border-yellow-200 bg-accent-muted"
      >
        <Image
          src="/ladu.png"
          alt="Ladu"
          fill
          className="object-cover"
          unoptimized
          sizes="(max-width: 960px) 100vw, 960px"
          priority
        />
      </div>
      <h1 className="pb-4 text-2xl xl:text-3xl">Ladu</h1>
      <div className="space-y-4 text-lg md:text-base xl:text-xl max-w-[640px]">
        <p>
          <strong>Handel Laura</strong> is a gated parent portal and teacher
          console for a special-education practice in Gödöllő—not a brochure
          site. Parents whose children attend Laura&apos;s autism- and
          social-communication sessions can sign in to see remaining pass
          balance, session details, and a shared message timeline, then renew a
          prepaid <strong>bérlet</strong> (4 sessions) online. Laura uses the
          same product to manage students, log sessions, message families, and
          keep an audit trail. The work sits at the intersection of ecommerce,
          practice ops, and calm family-facing UX.
        </p>
        <p>
          Before this, session passes, remaining balances, notes to parents, and
          renewals lived in chat threads, bank transfers, and memory. Parents
          needed a reliable place to see how many sessions were left, when the
          pass was valid, and what Laura had written; Laura needed a single
          place to log that a session happened, adjust balance, message
          families, and see history without hunting through email. The product
          exists to close that gap for a small, trust-based special-education
          practice in Gödöllő.
        </p>
        <p>
          So the core job is continuity of the parent–teacher relationship:
          parents check the child&apos;s &ldquo;adatlap,&rdquo; buy or renew a
          bérlet when allowed, and read a shared timeline; Laura runs the
          roster, records sessions (and emails parents), and keeps an audit
          trail. Online Stripe payment is part of that purpose—reducing friction
          around prepaid sessions—while still allowing transfer or cash, because
          that matches how the practice actually works. Non-registered parents
          are supported for the same reason: the relationship often starts
          offline; the app shouldn&apos;t force signup before Laura can manage
          the child. In short: it&apos;s an operations and communication tool
          for one real practice, framed around prepaid development sessions,
          with the parent experience kept calm and clear and the teacher side
          built for accountability and speed.
        </p>
        <p>
          Design-wise, the app reads as a narrow, letter-like frame: emerald
          hero bands, Laura&apos;s headshot as the brand signal, Inter for
          clarity, and a white content column capped around{" "}
          <code>max-w-4xl</code>. Status is visual first—remaining sessions as a
          large emerald figure, pass rules in plain Hungarian, renew CTAs only
          when the business rules allow. Parent and teacher share the same
          student sections (header, current pass, session time, timeline);
          permissions and actions change by role, so the visual system stays one
          product, not two skins. Much of the UX engineering is about real
          practice friction: email verification with progressive resend backoff;
          a warm &ldquo;waiting for Laura to assign your child&rdquo; empty
          state in her first-person voice; support for parents who aren&apos;t
          registered yet; Stripe checkout alongside bank transfer or cash; and a
          composite <strong>Üzenetek</strong> timeline that merges messages,
          session logs, and purchases into one vertical story. The tone stays
          polite and practical—formal <strong>Ön</strong> for parents,
          operational clarity for the teacher—so the interface feels like an
          extension of the practice relationship rather than a generic
          dashboard.
        </p>
      </div>
    </main>
  );
}
