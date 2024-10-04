//
//
//

import { TranslationCreation_PROPS } from "@/src/db/models";

export interface HANDLE_langRemoval_PROPS {
  lang_id: string;
  current_TRS: TranslationCreation_PROPS[];
  SET_trs: (langs: TranslationCreation_PROPS[]) => void;
}

export default function HANDLE_langRemoval({
  lang_id,
  current_TRS,
  SET_trs,
}: HANDLE_langRemoval_PROPS) {
  const updated_TRS = current_TRS.filter((tr) => tr.lang_id !== lang_id);
  SET_trs([...updated_TRS]);
}
