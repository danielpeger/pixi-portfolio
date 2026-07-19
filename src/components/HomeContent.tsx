import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import PixiSketch from "@/components/PixiSketch";

type HomeContentProps = {
  active?: boolean;
};

export default function HomeContent({ active = true }: HomeContentProps) {
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
            I've been a product designer since 2016, and I'm currently pursuing
            a master’s in software engineering.
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
          <TransitionLink
            href="/overview"
            className="block max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0"
          >
            <div
              data-vt="overview-image"
              className="relative w-full bg-accent-muted aspect-5/4 rounded-[20px] overflow-hidden mb-2"
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
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <TransitionLink
          href="/ratio"
          className="block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0"
        >
          <div
            data-vt="ratio-image"
            className="relative w-full bg-accent-muted aspect-5/4 rounded-[20px] overflow-hidden mb-2"
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
    </main>
  );
}
