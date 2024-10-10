//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/props";

export default function GET_langsFromTranslations(
  trs: TranslationCreation_PROPS[],
  languages: Language_MODEL[]
) {
  return languages?.filter((lang) => trs?.some((tr) => tr.lang_id === lang.id));
}
