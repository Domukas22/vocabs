//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { minVocabTranslations } from "../constants/globalVars";

export default function REMOVE_lang({
  langs,
  SET_langs,
  targetLang_ID,
}: {
  langs: Language_MODEL[];
  SET_langs: React.Dispatch<React.SetStateAction<Language_MODEL[]>>;
  targetLang_ID: string;
}) {
  if (langs.length !== minVocabTranslations) {
    SET_langs((prev) => prev.filter((lang) => lang.id !== targetLang_ID));
  }
}
