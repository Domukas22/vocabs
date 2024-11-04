//
//
//

import { FetchedSharedList_PROPS } from "../hooks/USE_sharedLists";

export default function FORMAT_listVocabCount(
  lists: FetchedSharedList_PROPS[]
) {
  return lists.map((list) => ({
    ...list,
    vocab_COUNT: list.vocabs?.[0]?.count || 0,
  }));
}
