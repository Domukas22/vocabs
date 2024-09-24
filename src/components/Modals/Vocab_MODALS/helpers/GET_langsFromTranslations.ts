//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";

export default function GET_langsFromTranslations(
  modal_TRs: TranslationCreation_PROPS[],
  languages: Language_MODEL[]
) {
  return languages.filter((lang) =>
    modal_TRs.some((tr) => tr.lang_id === lang.id)
  );
}
