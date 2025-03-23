//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { SetStateAction, useCallback } from "react";

export function USE_prepareFetch({
  SET_error = () => {},
  SET_loadingState = () => {},
}: {
  SET_error: (value: SetStateAction<General_ERROR | undefined>) => void;
  SET_loadingState: (value: SetStateAction<loadingState_TYPES>) => void;
}) {
  const PREPARE_fetch = useCallback(
    (_loading_STATE: loadingState_TYPES) => {
      SET_error(undefined);
      SET_loadingState(_loading_STATE);
    },
    [SET_error, SET_loadingState]
  );

  return { PREPARE_fetch };
}
