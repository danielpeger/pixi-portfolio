import { SFLink } from "sf-symbols-lib/monochrome/SFLink";

type Bookmark = {
  id: string;
  title: string;
  href: string;
  host: string;
};

const BOOKMARKS: Bookmark[] = [
  {
    id: "ink-and-switch",
    title: "Ink & Switch",
    href: "https://inkandswitch.com",
    host: "inkandswitch.com",
  },
  {
    id: "tobias-ahlin",
    title: "Tobias Ahlin",
    href: "https://tobiasahlin.com",
    host: "tobiasahlin.com",
  },
  {
    id: "every-noise-at-once",
    title: "Every Noise at Once",
    href: "https://everynoise.com",
    host: "everynoise.com",
  },
  {
    id: "gapminder",
    title: "Gapminder",
    href: "https://www.gapminder.org",
    host: "gapminder.org",
  },
  {
    id: "kialo",
    title: "Kialo",
    href: "https://www.kialo.com",
    host: "kialo.com",
  },
  {
    id: "tensorflow-playground",
    title: "TensorFlow Playground",
    href: "https://playground.tensorflow.org/",
    host: "playground.tensorflow.org",
  },
  {
    id: "practical-typography",
    title: "Butterick's Practical Typography",
    href: "https://practicaltypography.com",
    host: "practicaltypography.com",
  },
  {
    id: "klim-foundry",
    title: "Klim Foundry",
    href: "https://klim.co.nz",
    host: "klim.co.nz",
  },
  {
    id: "rybitten",
    title: "RYBitten",
    href: "https://rybitten.space",
    host: "rybitten.space",
  },
  {
    id: "untitled",
    title: "Untitled",
    href: "https://untitled.new",
    host: "untitled.new",
  },
  {
    id: "animejs",
    title: "Anime.js",
    href: "https://animejs.com",
    host: "animejs.com",
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
            className="flex w-full cursor-pointer items-start justify-between gap-4 font-rubik"
          >
            <span>
              <span className="block">{bookmark.title}</span>
              <span className="block text-tertiary-foreground">
                {bookmark.host}
              </span>
            </span>
            <span className="mt-1 block size-5 shrink-0 overflow-clip text-tertiary-foreground">
              <SFLink aria-hidden size="md" className="size-full" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
