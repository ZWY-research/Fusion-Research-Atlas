// Types for the small public citeproc-js API used by FRA.
declare module "citeproc" {
  const CSL: {
    Engine: new (
      sys: {
        retrieveLocale: (language: string) => string | false;
        retrieveItem: (id: string) => object;
      },
      style: string,
      language?: string,
    ) => {
      updateItems(ids: string[]): void;
      makeBibliography():
        | [{ entry_ids: string[][]; bibliography_errors?: unknown[] }, string[]]
        | false;
    };
  };
  export default CSL;
}
