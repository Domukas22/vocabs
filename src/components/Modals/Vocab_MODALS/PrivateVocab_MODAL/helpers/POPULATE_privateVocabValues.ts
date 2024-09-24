//
//
//

import { Vocab_MODEL, Language_MODEL, List_MODEL } from "@/src/db/models";
import { PrivateVocabSet_PROPS } from "../hooks/USE_privateVocabValues";
import GET_defaultLangs from "../../helpers/GET_defaultLangs";
import GET_defaultTranslations from "../../helpers/GET_defaultTranslations";
import GET_langsFromTranslations from "../../helpers/GET_langsFromTranslations";

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

  SET_modalList(selected_LIST);
  SET_modalImg(vocab?.image ? vocab.image : "");
  SET_modalDesc(vocab?.description ? vocab.description : "");
  SET_modalDiff(vocab?.difficulty ? vocab.difficulty : 3);
  SET_modalLangs(
    vocab?.translations
      ? GET_langsFromTranslations(vocab.translations, languages)
      : GET_defaultLangs({ languages, starter: ["en", "de", "fr", "lt"] })
  );
  SET_modalTRs(
    vocab?.translations
      ? vocab.translations
      : GET_defaultTranslations(["en", "de", "fr", "lt"])
  );
}
