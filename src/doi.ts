export function normalizeDoi(input: string): string {
  let value = input.trim();
  if (/^https?:\/\/(?:dx\.)?doi\.org\//i.test(value)) {
    const url = new URL(value);
    if (url.search || url.hash)
      throw Error("Encode reserved DOI characters in resolver URLs");
    try {
      value = decodeURIComponent(url.pathname.slice(1));
    } catch {
      throw Error("Invalid DOI URL encoding");
    }
  } else value = value.replace(/^doi:\s*/i, "");
  if (
    !/^10\.\d{4,9}\/\S+$/i.test(value) ||
    [...value].some((c) => c.charCodeAt(0) < 32)
  )
    throw Error("Invalid DOI");
  return value.toLowerCase();
}
export function doiUrl(value: string) {
  return (
    "https://doi.org/" +
    normalizeDoi(value).split("/").map(encodeURIComponent).join("/")
  );
}
const key = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKC")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
export type Bibliography = {
  doi: string | null;
  title: string;
  authors: string[];
  year: number;
  journal: string;
};
export function compareMetadata(record: Bibliography, actual: Bibliography) {
  return {
    doi:
      record.doi !== null &&
      actual.doi !== null &&
      normalizeDoi(record.doi) === normalizeDoi(actual.doi),
    title: key(record.title) === key(actual.title),
    authors:
      record.authors.length === actual.authors.length &&
      record.authors.every((a, i) => key(a) === key(actual.authors[i])),
    year: record.year === actual.year,
    journal: key(record.journal) === key(actual.journal),
  };
}
export function fromCrossref(m: {
  DOI: string;
  title: string[];
  author: { given?: string; family: string }[];
  "container-title": string[];
  published: { "date-parts": number[][] };
}): Bibliography {
  return {
    doi: normalizeDoi(m.DOI),
    title: m.title[0],
    authors: m.author.map((a) => [a.given, a.family].filter(Boolean).join(" ")),
    year: m.published["date-parts"][0][0],
    journal: m["container-title"][0],
  };
}
