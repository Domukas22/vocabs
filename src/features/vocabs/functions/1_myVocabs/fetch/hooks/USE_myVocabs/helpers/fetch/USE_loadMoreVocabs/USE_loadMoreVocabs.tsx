//
//
//

import { loadingState_TYPES } from "@/src/types";
import { useCallback } from "react";
import { myVocabsReducerState_PROPS } from "../../reducer/myVocabs_REDUCER/types";

export default function USE_loadMoreVocabs({
  state,
  FETCH,
}: {
  state: myVocabsReducerState_PROPS;
  FETCH: (fetch_TYPE: loadingState_TYPES) => Promise<null | undefined>;
}) {
  const LOAD_moreVocabs = useCallback(() => {
    if (state?.loading_STATE === "none") {
      FETCH("loading_more");
    }
  }, [state]);

  return { LOAD_moreVocabs };
}
