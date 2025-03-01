//
//
//

import { COLLECT_allMyListsLangIds_RAW_RESPONSE_TYPE } from "../../types";

export function FORMAT_rawColelctedLangIds(
  rawLang_IDs: COLLECT_allMyListsLangIds_RAW_RESPONSE_TYPE
): {
  lang_IDs: string[];
} {
  if (!rawLang_IDs) return { lang_IDs: [] };

  const lang_IDs = Array.from(
    new Set(rawLang_IDs.flatMap((item) => item.collected_lang_ids))
  );

  return { lang_IDs };
}
