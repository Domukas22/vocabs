//
//
//

import { z_USE_langs } from "@/src/features_new/languages/hooks/zustand/z_USE_langs/z_USE_langs";
import { useMemo } from "react";

export function USE_getTargetLangs({
  targetLang_IDS = [],
}: {
  targetLang_IDS: string[];
}) {
  const { z_GET_langsByLangId } = z_USE_langs();

  console.log(targetLang_IDS);

  const target_LANGS = useMemo(
    () => z_GET_langsByLangId(targetLang_IDS),
    [targetLang_IDS]
  );

  return { target_LANGS };
}
