//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";

export function PREPARE_vocabsForFetch(
  loadMore: boolean,
  loading_STATE: loadingState_TYPES
) {
  return (state: any) => {
    const newState: any = {
      z_error: undefined,
      z_loading_STATE: loading_STATE,
      z_vocabs: loadMore ? state.z_vocabs : [], // If loading more, keep the current vocabs; otherwise, clear it
    };

    return newState;
  };
}
