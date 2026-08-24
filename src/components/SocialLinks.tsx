import { SFDocumentFill } from "sf-symbols-lib/monochrome/SFDocumentFill";
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
  {
    id: "cv",
    title: "Download CV",
    href: "/DanielPeger.pdf",
    newTab: true,
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
    <ul className="flex flex-col gap-3">
      {LINKS.map((link) => (
        <li
          key={link.id}
          className={
            link.id === "cv" ? "mt-2 border-t border-separator pt-4" : undefined
          }
        >
          <a
            href={link.href}
            className="group flex w-full items-center gap-3 font-rubik"
            {...("newTab" in link
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="block size-[20px] shrink-0 text-foreground">
              {"svg" in link ? (
                <BrandIcon svg={link.svg} />
              ) : link.id === "cv" ? (
                <SFDocumentFill
                  aria-hidden
                  size={20}
                  className="size-full [&_path]:[fill-opacity:1]"
                />
              ) : (
                <SFEnvelopeFill
                  aria-hidden
                  size={20}
                  className="size-full [&_path]:[fill-opacity:1]"
                />
              )}
            </span>
            <span className="group-hover:underline">{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
