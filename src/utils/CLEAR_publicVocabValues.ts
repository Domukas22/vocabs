//
//
//

import { Language_MODEL } from "@/src/db/models";
import GET_langs from "./GET_langs";
import GET_defaultTranslations from "./GET_defaultTranslations";
import { PublicVocabSet_PROPS } from "../features/2_vocabs/components/Vocab/Public_VOCAB/components/PublicVocab_MODAL/hooks/USE_publicVocabValues";

export default function CLEAR_publicVocabValues({
  languages,
  set_FNs,
}: {
  languages: Language_MODEL[];
  set_FNs: PublicVocabSet_PROPS;
}) {
  const { SET_modalTRs, SET_modalImg, SET_modalDesc, SET_modalLangs } = set_FNs;

  SET_modalImg("");
  SET_modalDesc("");
  SET_modalLangs(GET_langs({ languages, starter: ["en", "de"] }));
  SET_modalTRs(GET_defaultTranslations(["en", "de"]));
}
