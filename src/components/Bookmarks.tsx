import { SFLink } from "sf-symbols-lib/monochrome/SFLink";

type Bookmark = {
  id: string;
  title: string;
  href: string;
};

const BOOKMARKS: Bookmark[] = [
  {
    id: "ink-and-switch",
    title: "Ink & Switch",
    href: "https://inkandswitch.com",
  },
  {
    id: "tobias-ahlin",
    title: "Tobias Ahlin",
    href: "https://tobiasahlin.com",
  },
  {
    id: "every-noise-at-once",
    title: "Every Noise at Once",
    href: "https://everynoise.com",
  },
  {
    id: "gapminder",
    title: "Gapminder",
    href: "https://www.gapminder.org",
  },
  {
    id: "kialo",
    title: "Kialo",
    href: "https://www.kialo.com",
  },
  {
    id: "tensorflow-playground",
    title: "TensorFlow Playground",
    href: "https://playground.tensorflow.org/",
  },
  {
    id: "practical-typography",
    title: "Butterick's Practical Typography",
    href: "https://practicaltypography.com",
  },
  {
    id: "klim-foundry",
    title: "Klim Foundry",
    href: "https://klim.co.nz",
  },
  {
    id: "rybitten",
    title: "RYBitten",
    href: "https://rybitten.space",
  },
  {
    id: "untitled",
    title: "Untitled",
    href: "https://untitled.new",
  },
  {
    id: "animejs",
    title: "Anime.js",
    href: "https://animejs.com",
  },
];

export default function Bookmarks() {
  return (
    <ul>
      {BOOKMARKS.map((bookmark, index) => (
        <li
          key={bookmark.id}
          className={
            index < BOOKMARKS.length - 1
              ? "pb-3 mb-2 border-b border-separator"
              : undefined
          }
        >
          <a
            href={bookmark.href}
            className="flex w-full cursor-pointer items-center justify-between gap-4 font-rubik"
          >
            {bookmark.title}
            <span className="block size-5 shrink-0 overflow-clip text-tertiary-foreground">
              <SFLink aria-hidden size="md" className="size-full" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
