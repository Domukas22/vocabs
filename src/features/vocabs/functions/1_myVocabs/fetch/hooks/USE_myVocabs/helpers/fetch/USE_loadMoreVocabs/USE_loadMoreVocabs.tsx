//
//
//

import { loadingState_TYPES } from "@/src/types";
import { useCallback } from "react";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../reducer/myVocabs_REDUCER/types";

export default function USE_loadMoreVocabs({
  reducer_STATE: state,
  FETCH,
}: {
  reducer_STATE: myVocabs_REDUCER_RESPONSE_TYPE;
  FETCH: (fetch_TYPE: loadingState_TYPES) => Promise<null | undefined>;
}) {
  const LOAD_moreVocabs = useCallback(() => {
    if (state?.loading_STATE === "none") {
      FETCH("loading_more");
    }
  }, [state]);

  return { LOAD_moreVocabs };
}
