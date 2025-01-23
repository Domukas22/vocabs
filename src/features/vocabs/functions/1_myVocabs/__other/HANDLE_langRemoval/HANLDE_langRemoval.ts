//
//
//

import { tr_PROPS } from "@/src/props";

export interface HANDLE_langRemoval_PROPS {
  lang_id: string;
  current_TRS: tr_PROPS[];
  SET_trs: (langs: tr_PROPS[]) => void;
}

export function HANDLE_langRemoval({
  lang_id,
  current_TRS,
  SET_trs,
}: HANDLE_langRemoval_PROPS) {
  const updated_TRS = current_TRS.filter((tr) => tr.lang_id !== lang_id);
  SET_trs([...updated_TRS]);
}
