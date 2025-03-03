//
//
//

import i18next from "i18next";
import { useMemo } from "react";

export function USE_getAppLangId() {
  const appLang_ID = useMemo(() => i18next.language || "en", []);

  return { appLang_ID };
}
