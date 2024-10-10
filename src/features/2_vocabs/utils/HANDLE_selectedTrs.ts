//
//
//

import { TranslationCreation_PROPS } from "@/src/db/props";

export default function HANLDE_selectedHighlights({
  new_HIGHLIGHTS,
  lang_id,
  current_TRS,
  SET_trs,
}: {
  new_HIGHLIGHTS: number[];
  lang_id: string;
  current_TRS: TranslationCreation_PROPS[];
  SET_trs: (langs: TranslationCreation_PROPS[]) => void;
}) {
  let updated_TRS = [...current_TRS].map((tr) => {
    if (tr.lang_id === lang_id) tr.highlights = new_HIGHLIGHTS;
    return tr;
  });

  SET_trs(updated_TRS);
}
