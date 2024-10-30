//
//
//

export default function GET_defaultTranslations(langs: string = "en, de") {
  return langs.split(",").map((lang) => ({
    lang_id: lang,
    text: "",
    highlights: [],
  }));
}
