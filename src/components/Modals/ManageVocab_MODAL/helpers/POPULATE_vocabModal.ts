//
//
//

import {
  List_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import GET_defaultTranslations from "./GET_defaultTranslations";

interface PopulateVocabModal_PROPS {
  list: List_MODEL;
  vocab: Vocab_MODEL | null;
  set_FNs: {
    SET_modalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
    SET_modalDiff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
    SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
    SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
    SET_modalTRs: React.Dispatch<
      React.SetStateAction<TranslationCreation_PROPS[]>
    >;
  };
}

export default function POPULATE_vocabModal({
  list,
  vocab,
  set_FNs,
}: PopulateVocabModal_PROPS) {
  const {
    SET_modalList,
    SET_modalDiff,
    SET_modalImg,
    SET_modalDesc,
    SET_modalTRs,
  } = set_FNs;

  SET_modalList(list);
  SET_modalDiff(vocab?.difficulty ? vocab.difficulty : 3);
  SET_modalImg(vocab?.image ? vocab.image : "");
  SET_modalDesc(vocab?.description ? vocab.description : "");
  SET_modalTRs(
    vocab?.translations
      ? vocab.translations
      : GET_defaultTranslations(["en", "de"])
  );
}
