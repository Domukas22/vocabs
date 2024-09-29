//
//
//

import { Vocab_MODEL, Language_MODEL, List_MODEL } from "@/src/db/models";
import { PrivateVocabSet_PROPS } from "../hooks/USE_myVocabValues";
import GET_langs from "../../../../utils/GET_langs";
import GET_defaultTranslations from "../../../../utils/GET_defaultTranslations";
import GET_langsFromTranslations from "../../../../utils/GET_langsFromTranslations";

export default function POPULATE_privateVocabValues({
  vocab,
  set_FNs,
  languages,
  selected_LIST,
}: {
  vocab: Vocab_MODEL | undefined;
  set_FNs: PrivateVocabSet_PROPS;
  languages: Language_MODEL[];
  selected_LIST: List_MODEL;
}) {
  const {
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  } = set_FNs;
  console.log(selected_LIST.default_TRs);

  SET_modalList(selected_LIST);
  SET_modalImg(vocab?.image ? vocab.image : "");
  SET_modalDesc(vocab?.description ? vocab.description : "");
  SET_modalDiff(vocab?.difficulty ? vocab.difficulty : 3);
  SET_modalLangs(
    vocab?.translations
      ? GET_langsFromTranslations(vocab.translations, languages)
      : selected_LIST.default_TRs
      ? GET_langs({ languages, target: selected_LIST.default_TRs })
      : GET_langs({ languages, target: ["en", "de"] })
  );
  SET_modalTRs(
    vocab?.translations
      ? vocab.translations
      : selected_LIST.default_TRs
      ? GET_defaultTranslations(selected_LIST.default_TRs)
      : GET_defaultTranslations(["en", "de"])
  );
}
