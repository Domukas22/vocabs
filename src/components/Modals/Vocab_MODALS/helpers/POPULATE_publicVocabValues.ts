//
//
//

import { Language_MODEL, PublicVocab_MODEL } from "@/src/db/models";
import GET_defaultLangs from "./GET_defaultLangs";
import GET_defaultTranslations from "./GET_defaultTranslations";
import GET_langsFromTranslations from "./GET_langsFromTranslations";
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
      : GET_defaultLangs({ languages, starter: ["en", "de", "fr", "lt"] })
  );
  SET_modalTRs(
    vocab?.public_translations
      ? vocab.public_translations
      : GET_defaultTranslations(["en", "de", "fr", "lt"])
  );
}
