import { useMemo } from "react";
import { natureReferences } from "./citations";
import type { Source } from "./model";
import style from "./csl/nature.csl?raw";
import gb from "./csl/locales-en-GB.xml?raw";
import us from "./csl/locales-en-US.xml?raw";
export const natureResources = { style, locales: { "en-GB": gb, "en-US": us } };
export function useReferences(sources: Source[], ids: string[]) {
  return useMemo(() => {
    try {
      return {
        entries: natureReferences(sources, ids, natureResources),
        error: "",
      };
    } catch (error) {
      return { entries: [], error: String(error) };
    }
  }, [sources, ids]);
}
