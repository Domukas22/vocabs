//
//
//

import { tr_PROPS } from "@/src/db/props";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";

export default function GET_langsFromTranslations(
  trs: tr_PROPS[],
  languages: Language_MODEL[]
) {
  return languages?.filter((lang) =>
    trs && trs?.length > 0 ? trs?.some((tr) => tr.lang_id === lang.id) : null
  );
}
