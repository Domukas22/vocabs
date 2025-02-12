//
//

import { VocabTr_TYPE } from "@/src/features/vocabs/types";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import List_MODEL from "@/src/db/models/List_MODEL";
import { useState } from "react";

export interface PrivateVocabState_PROPS {
  modal_LIST: List_MODEL | null | undefined;
  modal_DIFF: 1 | 2 | 3;
  modal_IMG: string;
  modal_DESC: string;
  modal_TRs: VocabTr_TYPE[];
  modal_LANGS: Language_MODEL[];
}
export interface PrivateVocabSet_PROPS {
  SET_modalTRs: React.Dispatch<React.SetStateAction<VocabTr_TYPE[]>>;
  SET_modalImg: React.Dispatch<React.SetStateAction<string>>;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
  SET_modalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
  SET_modalDiff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  SET_modalLangs: React.Dispatch<React.SetStateAction<Language_MODEL[]>>;
}

export function USE_myVocabValues(
  selected_LIST: List_MODEL | null | undefined
) {
  const [modal_LIST, SET_modalList] = useState<List_MODEL | null>(
    selected_LIST || null
  );
  const [modal_DIFF, SET_modalDiff] = useState<1 | 2 | 3>(3);
  const [modal_IMG, SET_modalImg] = useState<string>("");
  const [modal_DESC, SET_modalDesc] = useState<string>("");
  const [modal_TRs, SET_modalTRs] = useState<VocabTr_TYPE[]>([]);
  const [modal_LANGS, SET_modalLangs] = useState<Language_MODEL[]>([]);

  return {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LIST,
    modal_DIFF,
    modal_LANGS,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  };
}
