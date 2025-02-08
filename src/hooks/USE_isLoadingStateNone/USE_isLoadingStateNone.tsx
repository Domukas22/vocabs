//
//
//

import { myVocabs_REDUCER_RESPONSE_TYPE } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/helpers/reducer/myVocabs_REDUCER/types";
import { useMemo } from "react";

export function USE_isLoadingStateNone(state: myVocabs_REDUCER_RESPONSE_TYPE): {
  IS_loadingStateNone: boolean;
} {
  const IS_loadingStateNone = useMemo(
    () => state.loading_STATE === "none",
    [state.loading_STATE]
  );

  return { IS_loadingStateNone };
}
