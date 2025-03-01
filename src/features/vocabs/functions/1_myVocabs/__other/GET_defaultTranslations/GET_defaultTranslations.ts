//
//
//

export function GET_defaultTranslations(langs: string[] = ["en", "de"]) {
  return langs?.map((lang) => ({
    lang_id: lang,
    text: "",
    highlights: [],
  }));
}
