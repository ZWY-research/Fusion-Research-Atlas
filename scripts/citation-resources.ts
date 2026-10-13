import { readFileSync } from "node:fs";
export function citationResources() {
  const read = (file: string) =>
    readFileSync(new URL("../src/csl/" + file, import.meta.url), "utf8");
  return {
    style: read("nature.csl"),
    locales: {
      "en-GB": read("locales-en-GB.xml"),
      "en-US": read("locales-en-US.xml"),
    },
  };
}
