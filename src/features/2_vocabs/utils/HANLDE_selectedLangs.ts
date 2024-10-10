//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/props";

export default function HANLDE_selectedLangs({
  new_LANGS,
  current_TRS,
  SET_trs,
}: {
  new_LANGS: Language_MODEL[];
  current_TRS: TranslationCreation_PROPS[];
  SET_trs: (langs: TranslationCreation_PROPS[]) => void;
}) {
  let updated_TRS = [...current_TRS];

  // Filter out translations for languages that are no longer selected
  updated_TRS = updated_TRS.filter((tr) =>
    new_LANGS.some((newLang) => newLang.id === tr.lang_id)
  );

  // Add new languages that don't have a translation yet
  new_LANGS.forEach((lang) => {
    if (!updated_TRS.some((tr) => tr.lang_id === lang.id)) {
      updated_TRS.push({
        lang_id: lang.id,
        text: "",
        highlights: [],
      });
    }
  });

  SET_trs(updated_TRS);
}
