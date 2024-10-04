//
//

import { List_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import GET_defaultTranslations from "@/src/utils/GET_defaultTranslations";
import { useState } from "react";

export interface CreateMyVocabValue_PROPS {
  list: List_MODEL | undefined;
  diff: 1 | 2 | 3;
  desc: string;
  trs: TranslationCreation_PROPS[];
}
export interface CreateMyVocabSet_PROPS {
  SET_trs: React.Dispatch<React.SetStateAction<TranslationCreation_PROPS[]>>;
  SET_desc: React.Dispatch<React.SetStateAction<string>>;
  SET_list: React.Dispatch<React.SetStateAction<List_MODEL>>;
  SET_diff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

export default function USE_createMyVocabFormValues(
  initial_List: List_MODEL | undefined
) {
  const [list, SET_list] = useState<List_MODEL | undefined>(
    initial_List || undefined
  );
  const [diff, SET_diff] = useState<1 | 2 | 3>(3);
  const [desc, SET_desc] = useState<string>("");
  const [trs, SET_trs] = useState<TranslationCreation_PROPS[]>(
    GET_defaultTranslations(list?.default_LANGS) || []
  );

  return {
    modal_VALUES: {
      trs,
      desc,
      list,
      diff,
    },
    modalSet_FNS: {
      SET_trs,
      SET_desc,
      SET_list,
      SET_diff,
    },
  };
}
