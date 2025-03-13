//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

export function APPEND_vocabs(
  vocabs: Vocab_TYPE[],
  unpaginated_COUNT: number,
  loadMore: boolean
) {
  return (state: any) => {
    const newVocabs = loadMore ? [...state.vocabs, ...vocabs] : vocabs;

    return {
      z_vocabs: newVocabs,
      z_unpaginated_COUNT: unpaginated_COUNT,
      z_printed_IDS: new Set(newVocabs.map((x) => x.id)),
      z_HAS_reachedEnd: newVocabs.length >= unpaginated_COUNT,
      z_loading_STATE: "none" as loadingState_TYPES,
    };
  };
}
