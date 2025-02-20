//
//
//

import { List_TYPE, raw_List_TYPE } from "@/src/features_new/lists/types";

export function FORMAT_rawLists(lists: raw_List_TYPE[]): {
  formated_LISTS: List_TYPE[];
} {
  const formated_LISTS = lists.map((list) => {
    // Convert comma-separated language strings into arrays
    const defaultLangIds = list.default_lang_ids
      ?.split(",")
      ?.map((id) => id.trim());
    const collectedLangIds = list.collected_lang_ids
      ?.split(",")
      ?.map((id) => id.trim());

    // Initialize vocab_INFOS
    const vocab_INFOS = list.vocabs
      ? list.vocabs.reduce(
          (acc, vocab) => {
            if (vocab.difficulty === 1) acc.diff_1++;
            if (vocab.difficulty === 2) acc.diff_2++;
            if (vocab.difficulty === 3) acc.diff_3++;
            if (vocab.is_marked) acc.marked++;
            return acc;
          },
          { diff_1: 0, diff_2: 0, diff_3: 0, marked: 0 }
        )
      : undefined;

    return {
      ...list,
      default_lang_ids: defaultLangIds,
      collected_lang_ids: collectedLangIds,
      vocab_INFOS, // Transformed from vocabs
      vocab_count: list.vocab_count?.[0]?.count || 0,
      vocabs: undefined, // Remove original vocabs field
    };
  });

  return { formated_LISTS };
}
