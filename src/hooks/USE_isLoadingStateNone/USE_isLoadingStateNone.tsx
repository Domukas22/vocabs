//
//
//

import { myVocabsReducerState_PROPS } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/helpers/reducer/myVocabs_REDUCER/myVocabs_REDUCER";
import { useMemo } from "react";

export function USE_isLoadingStateNone(state: myVocabsReducerState_PROPS): {
  IS_loadingStateNone: boolean;
} {
  const IS_loadingStateNone = useMemo(
    () => state.loading_STATE === "none",
    [state.loading_STATE]
  );

  return { IS_loadingStateNone };
}
