//
//
//

import { VocabTr_TYPE } from "@/src/features/vocabs/types";

export interface HANDLE_langRemoval_PROPS {
  lang_id: string;
  current_TRS: VocabTr_TYPE[];
  SET_trs: (langs: VocabTr_TYPE[]) => void;
}

export function HANDLE_langRemoval({
  lang_id,
  current_TRS,
  SET_trs,
}: HANDLE_langRemoval_PROPS) {
  const updated_TRS = current_TRS.filter((tr) => tr.lang_id !== lang_id);
  SET_trs([...updated_TRS]);
}
