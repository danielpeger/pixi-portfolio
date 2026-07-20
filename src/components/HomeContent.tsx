import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import PixiSketch from "@/components/PixiSketch";
import { withFeatureParams } from "@/lib/features";

type HomeContentProps = {
  active?: boolean;
  /** When true, restores the pre-icon header layout (`?icons=off`). */
  iconsOff?: boolean;
};

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
          className="h-[92svh] md:h-[min(92svh,800px)] xl:h-[min(92svh,960px)]"
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          {iconsOff ? (
            <p>
              A design engineer who puts the <em>soft</em> in software. <br />{" "}
              I've been a product designer since 2016, and I'm currently pursuing
              a master’s in software engineering.
            </p>
          ) : (
            <>
              <div className="mb-8">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2"
                >
                  <circle cx="20" cy="20" r="20" fill="#FFCC01" />
                </svg>
                <p>
                  A design engineer who puts the <em>soft</em> in software.{" "}
                  <br /> I've been a product designer since 2016, and I'm
                  currently pursuing a master’s in software engineering.
                </p>
              </div>
              <div className="mb-8">
                <svg
                  width="41"
                  height="41"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2"
                >
                  <path
                    d="M0 0H13.5334V13.5334H27.0666V27.0666H40.6V40.6H0V0Z"
                    fill="#F14E3A"
                  />
                </svg>
                <p>
                  I love creating useful and fun things, exploring ideas, making
                  sense of complexity. I’m a purpose-driven generalist, who works
                  to see human potential actualized, envisioning a world where
                  technology elevates the best of our nature.
                </p>
              </div>
              <div className="mb-8">
                <svg
                  width="47"
                  height="45"
                  viewBox="0 0 47 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2"
                >
                  <path
                    d="M9.10529 43.6996C10.3093 44.574 11.7072 44.996 13.0948 44.996C15.1832 44.996 17.2442 44.04 18.5706 42.2434C18.5744 42.2396 18.578 42.2356 18.5814 42.2314C18.5846 42.2272 18.5878 42.223 18.5908 42.2188L18.5954 42.2122C18.5986 42.2078 18.6016 42.2034 18.6046 42.1992L23.2982 35.745L27.9918 42.1992C27.9964 42.2062 28.0012 42.2116 28.0058 42.2176C28.008 42.2204 28.01 42.2232 28.0122 42.2264C30.223 45.2376 34.471 45.901 37.4946 43.703C40.5216 41.5052 41.1984 37.2556 39.0148 34.2208L39.01 34.2132C39.006 34.2068 39.0028 34.202 38.9978 34.197L34.3144 27.7392L41.9024 25.2692C45.4668 24.109 47.4258 20.261 46.266 16.6952C45.1064 13.1296 41.263 11.1699 37.6952 12.3267L30.1074 14.7866L30.104 6.80128C30.1004 3.05188 27.0496 0 23.3016 0C19.5536 0 16.5028 3.05188 16.4994 6.80468L16.4926 14.7832L8.90465 12.3233C8.90165 12.3233 8.89799 12.3226 8.89431 12.3216C8.88953 12.3203 8.88463 12.3184 8.88081 12.3165C5.31983 11.1733 1.49015 13.133 0.333773 16.692C-0.822627 20.2508 1.12285 24.0852 4.67021 25.2556C4.67349 25.2566 4.67643 25.2578 4.67925 25.259L4.69175 25.2638L4.69745 25.2658L12.282 27.7358L7.59857 34.1936C7.59687 34.197 7.59435 34.2004 7.59181 34.2038C7.58923 34.2072 7.58671 34.2106 7.58501 34.214C5.39805 37.2488 6.07829 41.5018 9.10529 43.6996Z"
                    fill="#2F80ED"
                  />
                </svg>
                <p>
                  Douglas Engelbart, Ivan Sutherland, Bret Victor, Tristan Harris
                  and Matthew Butterick are some of my heroes.
                </p>
              </div>
              <div>
                <svg
                  width="57"
                  height="29"
                  viewBox="0 0 57 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M37.3814 28.2H56.4C56.4 12.6256 43.7744 0 28.2 0C12.6256 0 0 12.6256 0 28.2H19.0186C19.0186 23.1292 23.1292 19.0186 28.2 19.0186C33.2708 19.0186 37.3814 23.1292 37.3814 28.2Z"
                    fill="#27AE60"
                  />
                </svg>
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
                iconsOff ? "bg-accent-muted" : "bg-blue-50"
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
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <TransitionLink
          href={ratioHref}
          className="block px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0"
        >
          {!iconsOff && (
            <h3 className="pb-4 text-xl xl:text-2xl">
              Projects I'm most proud of
            </h3>
          )}
          <div
            data-vt="ratio-image"
            className={`relative w-full aspect-5/4 rounded-[20px] overflow-hidden mb-2 ${
              iconsOff ? "bg-accent-muted" : "bg-red-50"
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
    </main>
  );
}
