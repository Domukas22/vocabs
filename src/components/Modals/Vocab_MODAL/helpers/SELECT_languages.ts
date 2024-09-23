//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";

interface SelectLanguages_ROPS {
  newLangSelection: Language_MODEL[];
  modal_TRs: TranslationCreation_PROPS[];
}

export default function GET_handledLangs({
  newLangSelection,
  modal_TRs,
}: SelectLanguages_ROPS) {
  // if a tr doesn't have a lang included in the newSelection, delete it
  let newTranslations = modal_TRs?.filter((tr) =>
    newLangSelection.some((lang) => lang.id === tr.lang_id)
  );

  // add missing languages to the translations
  newLangSelection.forEach((lang) => {
    if (!newTranslations?.some((tr) => tr.lang_id === lang.id)) {
      newTranslations?.push({ lang_id: lang.id, text: "", highlights: [] });
    }
  });

  return newTranslations;
}
