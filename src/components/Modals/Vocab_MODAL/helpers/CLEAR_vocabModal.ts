//
//
//

import { List_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import GET_defaultTranslations from "./GET_defaultTranslations";

interface ClearVocabModal_PROPS {
  SET_modalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
  SET_modalDiff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
}

export default function CLEAR_vocabModal(set_FNs: ClearVocabModal_PROPS) {
  const {
    SET_modalList,
    SET_modalDiff,
    SET_modalImg,
    SET_modalDesc,
    SET_modalTRs,
  } = set_FNs;

  SET_modalList(null);
  SET_modalDiff(3);
  SET_modalImg("");
  SET_modalDesc("");
  SET_modalTRs(GET_defaultTranslations(["en", "de"]));
}
