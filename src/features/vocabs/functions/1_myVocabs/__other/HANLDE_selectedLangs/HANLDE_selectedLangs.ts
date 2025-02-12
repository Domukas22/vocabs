//
//
//

import { VocabTr_TYPE } from "@/src/features/vocabs/types";

export function HANLDE_selectedLangs({
  newLang_IDS,
  current_TRS,
  SET_trs,
}: {
  newLang_IDS: string[] | undefined;
  current_TRS: VocabTr_TYPE[];
  SET_trs: (langs: VocabTr_TYPE[]) => void;
}) {
  let updated_TRS = [...current_TRS];

  // Filter out translations for languages that are no longer selected
  updated_TRS = updated_TRS.filter((tr) =>
    newLang_IDS?.some((newLang_ID) => newLang_ID === tr.lang_id)
  );

  // Add new languages that don't have a translation yet
  newLang_IDS?.forEach((newLang_ID) => {
    if (!updated_TRS.some((tr) => tr.lang_id === newLang_ID)) {
      updated_TRS.push({
        lang_id: newLang_ID,
        text: "",
        highlights: [],
      });
    }
  });

  SET_trs(updated_TRS);
}
