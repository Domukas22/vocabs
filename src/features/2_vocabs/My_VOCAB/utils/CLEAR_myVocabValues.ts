//
//
//

import { Language_MODEL, List_MODEL } from "@/src/db/models";

import GET_langs from "@/src/utils/GET_langs";
import GET_defaultTranslations from "@/src/utils/GET_defaultTranslations";
import { PrivateVocabSet_PROPS } from "../hooks/USE_myVocabValues";

export default function CLEAR_myVocabValues({
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
  SET_modalLangs(GET_langs({ languages, target: ["en", "de"] }));
  SET_modalTRs(GET_defaultTranslations(["en", "de"]));
}
