//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_reducerErr } from "../CREATE_reducerErr/CREATE_reducerErr";

/**
 * Adds a vocab to the reducer.
 *
 * @param state - The current state of the vocabs.
 * @param payload - The vocab object to add.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "ADD_vocabToReducer";

export function ADD_vocabToReducer(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: Vocab_MODEL
): myVocabs_REDUCER_RESPONSE_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'data.vocabs' was undefined"
    );

  // check if the CURRENT STATE has a valid unpaginated count
  if (typeof state?.data?.unpaginated_COUNT !== "number")
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'payload.unpaginated_COUNT' was not a number"
    );

  // check if the PAYLOAD has a valid vocab id
  if (!payload?.id)
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'payload.id' was undefined"
    );

  // Prevent duplicates
  if (state.data.printed_IDS.has(payload.id)) {
    return state;
  }

  const newVocabs = [payload, ...state?.data?.vocabs];
  const updatedIds = new Set(newVocabs?.map((v) => v?.id));
  updatedIds.add(payload?.id);
  const totalCount = state?.data?.unpaginated_COUNT + 1;

  return {
    ...state,
    data: {
      vocabs: newVocabs,
      printed_IDS: updatedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: newVocabs?.length >= totalCount,
    },
  };
}
