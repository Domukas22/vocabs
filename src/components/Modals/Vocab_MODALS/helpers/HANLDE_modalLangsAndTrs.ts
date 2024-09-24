//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";

export default function HANLDE_modalLangsAndTrs({
  new_LANGS,
  modal_TRs,
  SET_modalLangs,
  SET_modalTRs,
}: {
  new_LANGS: Language_MODEL[];
  modal_TRs: TranslationCreation_PROPS[];
  SET_modalLangs: React.Dispatch<React.SetStateAction<Language_MODEL[]>>;
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
}) {
  // this function receives a brand new language array

  // remove the translations with lang_id that don't exist in the new list
  let newTRs = modal_TRs.filter((tr) =>
    new_LANGS.some((newLang) => newLang.id === tr.lang_id)
  );

  // add emtty translations for each missing lang
  new_LANGS.forEach((lang) => {
    if (!newTRs?.some((tr) => tr.lang_id === lang.id)) {
      newTRs?.push({ lang_id: lang.id, text: "", highlights: [] });
    }
  });

  SET_modalLangs(new_LANGS);
  SET_modalTRs(newTRs);
}
