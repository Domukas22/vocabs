//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";

export default function REMOVE_modalLangAndTr({
  targetLang_ID,
  modal_LANGS,
  SET_modalLangs,
  SET_modalTRs,
}: {
  modal_LANGS: Language_MODEL[];
  SET_modalLangs: React.Dispatch<React.SetStateAction<Language_MODEL[]>>;
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
  targetLang_ID: string;
}) {
  if (modal_LANGS.length !== 2) {
    SET_modalLangs((prev) => prev.filter((lang) => lang.id !== targetLang_ID));
    SET_modalTRs((prev) => prev?.filter((tr) => tr.lang_id !== targetLang_ID));
  }
}
