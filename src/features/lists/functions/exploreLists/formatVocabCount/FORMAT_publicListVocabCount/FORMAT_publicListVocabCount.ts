//
//
//

import { FetchedSharedList_PROPS } from "../../props";

export function FORMAT_publicListVocabCount(
  lists: FetchedSharedList_PROPS[] | undefined | null
) {
  if (!lists) return [];

  return lists?.map((list) => ({
    ...list,
    vocab_COUNT: list.vocabs?.[0]?.count || 0,
  }));
}
