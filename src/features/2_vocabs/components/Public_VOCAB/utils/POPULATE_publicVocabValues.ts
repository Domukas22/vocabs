//
//
//

import { Language_MODEL, List_MODEL, PublicVocab_MODEL } from "@/src/db/models";
import GET_langs from "../../../../utils/GET_langs";
import GET_defaultTranslations from "../../../../utils/GET_defaultTranslations";
import GET_langsFromTranslations from "../../../../utils/GET_langsFromTranslations";
import { PublicVocabSet_PROPS } from "../hooks/USE_publicVocabValues";

export default function POPULATE_publicVocabValues({
  vocab,
  set_FNs,
  languages,
}: {
  vocab: PublicVocab_MODEL | undefined;
  set_FNs: PublicVocabSet_PROPS;
  languages: Language_MODEL[];
}) {
  const { SET_modalTRs, SET_modalImg, SET_modalDesc, SET_modalLangs } = set_FNs;

  SET_modalImg(vocab?.image ? vocab.image : "");
  SET_modalDesc(vocab?.description ? vocab.description : "");
  SET_modalLangs(
    vocab?.public_translations
      ? GET_langsFromTranslations(vocab.public_translations, languages)
      : GET_langs({ languages, target: ["en", "de"] })
  );
  SET_modalTRs(
    vocab?.public_translations
      ? vocab.public_translations
      : GET_defaultTranslations(["en", "de"])
  );
}
