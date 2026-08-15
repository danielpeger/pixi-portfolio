import { SFEnvelopeFill } from "sf-symbols-lib/monochrome/SFEnvelopeFill";
import codepenLogomark from "@/assets/icons/codepen-logomark.svg?raw";
import githubMark from "@/assets/icons/github-mark.svg?raw";
import linkedinLogomark from "@/assets/icons/linkedin-logomark.svg?raw";

const LINKS = [
  {
    id: "github",
    title: "Github",
    href: "https://github.com/danielpeger",
    svg: githubMark,
  },
  {
    id: "codepen",
    title: "Codepen",
    href: "https://codepen.io/danielpeger",
    svg: codepenLogomark,
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/danielpeger/",
    svg: linkedinLogomark,
  },
  {
    id: "mail",
    title: "Mail",
    href: "mailto:pegerdaniel@gmail.com",
  },
] as const;

function BrandIcon({ svg }: { svg: string }) {
  return (
    <span
      aria-hidden
      className="block size-full [&_svg]:block [&_svg]:size-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function SocialLinks() {
  return (
    <ul className="mt-8 space-y-3">
      {LINKS.map((link) => (
        <li key={link.id}>
          <a
            href={link.href}
            className="flex w-full items-center gap-3 font-rubik"
          >
            <span className="block size-[20px] shrink-0 text-foreground">
              {"svg" in link ? (
                <BrandIcon svg={link.svg} />
              ) : (
                <SFEnvelopeFill
                  aria-hidden
                  size={20}
                  className="size-full [&_path]:[fill-opacity:1]"
                />
              )}
            </span>
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
