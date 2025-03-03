//
//
//

import { z_USE_langs } from "@/src/features_new/languages/hooks/zustand/z_USE_langs/z_USE_langs";
import { useMemo } from "react";

export function USE_getOneTargetLang({
  targetLang_ID = "",
}: {
  targetLang_ID: string;
}) {
  const { z_GET_oneLangById } = z_USE_langs();

  const target_LANG = useMemo(
    () => z_GET_oneLangById(targetLang_ID),
    [targetLang_ID]
  );

  return { target_LANG };
}
