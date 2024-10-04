//
//

import { List_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { useState } from "react";

export interface CreateMyVocabValue_PROPS {
  modal_LIST: List_MODEL | undefined;
  modal_DIFF: 1 | 2 | 3;
  modal_DESC: string;
  modal_TRs: TranslationCreation_PROPS[];
}
export interface CreateMyVocabSet_PROPS {
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
  SET_modalList: React.Dispatch<React.SetStateAction<List_MODEL>>;
  SET_modalDiff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

export default function USE_createMyVocabValues(
  selected_LIST: List_MODEL | undefined
) {
  const [modal_LIST, SET_modalList] = useState<List_MODEL | undefined>(
    selected_LIST || undefined
  );
  const [modal_DIFF, SET_modalDiff] = useState<1 | 2 | 3>(3);
  const [modal_DESC, SET_modalDesc] = useState<string>("");
  const [modal_TRs, SET_modalTRs] = useState<TranslationCreation_PROPS[]>([]);

  return {
    modal_VALUES: {
      modal_TRs,
      modal_DESC,
      modal_LIST,
      modal_DIFF,
    },
    modalSet_FNS: {
      SET_modalTRs,
      SET_modalDesc,
      SET_modalList,
      SET_modalDiff,
    },
  };
}
