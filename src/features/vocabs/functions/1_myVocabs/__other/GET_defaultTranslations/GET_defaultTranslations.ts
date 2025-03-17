//
//
//

export function GET_defaultTranslations(
  langs: string[] = ["en", "de"]
): { lang_id: string; text: string; highlights: number[] }[] {
  return langs?.map((lang) => ({
    lang_id: lang,
    text: "",
    highlights: [],
  }));
}
