//
//
//

import { Language_MODEL, List_MODEL } from "@/src/db/models";
import { PrivateVocabSet_PROPS } from "../hooks/USE_privateVocabValues";
import GET_langs from "./GET_langs";
import GET_defaultTranslations from "./GET_defaultTranslations";

export default function CLEAR_privateVocabValues({
  languages,
  selected_LIST,
  set_FNs,
}: {
  languages: Language_MODEL[];
  selected_LIST: List_MODEL;
  set_FNs: PrivateVocabSet_PROPS;
}) {
  const {
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  } = set_FNs;

  SET_modalList(selected_LIST);
  SET_modalImg("");
  SET_modalDesc("");
  SET_modalDiff(3);
  SET_modalLangs(GET_langs({ languages, starter: ["en", "de"] }));
  SET_modalTRs(GET_defaultTranslations(["en", "de"]));
}
