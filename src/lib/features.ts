/** Query-param feature switches. Use `?icons=off` to restore the pre-icon header. */

export function isIconsOff(
  searchParams: Pick<URLSearchParams, "get"> | { icons?: string | string[] },
): boolean {
  if ("get" in searchParams && typeof searchParams.get === "function") {
    return searchParams.get("icons") === "off";
  }
  const value = (searchParams as { icons?: string | string[] }).icons;
  return Array.isArray(value) ? value[0] === "off" : value === "off";
}

/** Append active feature params (e.g. icons=off) onto an href. */
export function withFeatureParams(
  href: string,
  searchParams: Pick<URLSearchParams, "get">,
): string {
  if (!isIconsOff(searchParams)) return href;

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const qIndex = withoutHash.indexOf("?");
  const path = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;
  const existing = qIndex >= 0 ? withoutHash.slice(qIndex + 1) : "";
  const params = new URLSearchParams(existing);
  params.set("icons", "off");
  const query = params.toString();
  return `${path}?${query}${hash}`;
}
