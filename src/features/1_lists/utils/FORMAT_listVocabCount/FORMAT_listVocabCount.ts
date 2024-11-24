//
//
//

import { FetchedSharedList_PROPS } from "../props";

export default function FORMAT_listVocabCount(
  lists: FetchedSharedList_PROPS[] | undefined | null
) {
  if (!lists) return [];

  return lists?.map((list) => ({
    ...list,
    vocab_COUNT: list.vocabs?.[0]?.count || 0,
  }));
}
