//
//
//

import { Language_PROPS, TranslationCreation_PROPS } from "@/src/db/props";

export default function GET_langsFromTranslations(
  trs: TranslationCreation_PROPS[],
  languages: Language_PROPS[]
) {
  return languages?.filter((lang) =>
    trs && trs?.length > 0 ? trs?.some((tr) => tr.lang_id === lang.id) : null
  );
}
