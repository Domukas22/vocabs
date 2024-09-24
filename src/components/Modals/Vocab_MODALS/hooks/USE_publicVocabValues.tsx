//
//

import {
  Language_MODEL,
  List_MODEL,
  TranslationCreation_PROPS,
} from "@/src/db/models";
import { useState } from "react";

export interface PublicVocabState_PROPS {
  modal_IMG: string;
  modal_DESC: string;
  modal_TRs: TranslationCreation_PROPS[];
  modal_LANGS: Language_MODEL[];
}
export interface PublicVocabSet_PROPS {
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
  SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
  SET_modalLangs: React.Dispatch<React.SetStateAction<Language_MODEL[]>>;
}

export default function USE_publicVocabValues() {
  const [modal_IMG, SET_modalImg] = useState<string>("");
  const [modal_DESC, SET_modalDesc] = useState<string>("");
  const [modal_TRs, SET_modalTRs] = useState<TranslationCreation_PROPS[]>([]);
  const [modal_LANGS, SET_modalLangs] = useState<Language_MODEL[]>([]);

  return {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LANGS,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalLangs,
  };
}
