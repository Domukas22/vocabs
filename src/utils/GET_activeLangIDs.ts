//
//
//

import { TranslationCreation_PROPS } from "@/src/db/models";

export default function GET_activeLangIDs(
  translations: TranslationCreation_PROPS[]
) {
  return translations?.filter((t) => t.lang_id).map((t) => t.lang_id) || [];
}
