//
//
//

import { Vocab_PROPS, Language_PROPS, List_PROPS } from "@/src/db/props";
import { PrivateVocabSet_PROPS } from "../../../hooks/USE_myVocabValues";
import GET_langs from "@/src/features/4_languages/utils/GET_langs";
import GET_defaultTranslations from "@/src/features/2_vocabs/utils/GET_defaultTranslations";
import GET_langsFromTranslations from "@/src/features/4_languages/utils/GET_langsFromTranslations";

export default function POPULATE_vocabValues({
  vocab,
  set_FNs,
  languages,
  selected_LIST,
}: {
  vocab: Vocab_PROPS | undefined;
  set_FNs: PrivateVocabSet_PROPS;
  languages: Language_PROPS[];
  selected_LIST: List_PROPS | null | undefined;
}) {
  const {
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  } = set_FNs;

  SET_modalList(selected_LIST || null);
  SET_modalImg(vocab?.image ? vocab.image : "");
  SET_modalDesc(vocab?.description ? vocab.description : "");
  SET_modalDiff(vocab?.difficulty ? vocab.difficulty : 3);
  SET_modalLangs(
    vocab?.translations
      ? GET_langsFromTranslations(vocab.translations, languages)
      : selected_LIST?.default_LANGS
      ? GET_langs({ languages, target: selected_LIST.default_LANGS })
      : GET_langs({ languages, target: ["en", "de"] })
  );
  SET_modalTRs(
    vocab?.translations
      ? vocab.translations
      : selected_LIST?.default_LANGS
      ? GET_defaultTranslations(selected_LIST.default_LANGS)
      : GET_defaultTranslations(["en", "de"])
  );
}
