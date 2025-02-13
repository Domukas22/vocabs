//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { useCallback } from "react";
import { FETCH_myVocabs_RESPONSE_TYPE } from "../USE_fetchVocabs/helpers/FETCH_vocabs/types";
import {
  APPEND_manyVocabs_PAYLOAD,
  SET_error_PAYLOAD,
  START_fetch_PAYLOAD,
} from "../USE_myVocabsReducer/Vocab_REDUCER/types";

export function USE_fetchVocabsAndHanldeState({
  FETCH_vocabs = () => Promise.resolve(undefined),
  r_START_fetch = () => {},
  r_APPEND_manyVocabs = () => {},
  r_SET_error = () => {},
}: {
  FETCH_vocabs: (
    loadingState_TYPE: loadingState_TYPES
  ) => Promise<FETCH_myVocabs_RESPONSE_TYPE | undefined>;
  r_START_fetch: (payload: START_fetch_PAYLOAD) => void;
  r_APPEND_manyVocabs: (payload: APPEND_manyVocabs_PAYLOAD) => void;
  r_SET_error: (payload: SET_error_PAYLOAD) => void;
}) {
  const FETCH_vocabsAndHanldeState = useCallback(
    async (loadingState_TYPE: loadingState_TYPES) => {
      try {
        r_START_fetch(loadingState_TYPE);
        const data = await FETCH_vocabs(loadingState_TYPE);

        if (!data)
          throw new General_ERROR({
            function_NAME: "FETCH_vocabsAndHanldeState",
            message:
              "FETCH_vocabs returned an undefined 'data' object, although it didn't throw an error",
          });

        r_APPEND_manyVocabs(data);
      } catch (error: any) {
        r_SET_error(
          new General_ERROR({
            function_NAME:
              error?.function_NAME || "USE_fetchVocabsAndHanldeState",
            message: error.message,
            errorToSpread: error,
          })
        );
      }
    },
    [FETCH_vocabs]
  );

  return { FETCH_vocabsAndHanldeState };
}
