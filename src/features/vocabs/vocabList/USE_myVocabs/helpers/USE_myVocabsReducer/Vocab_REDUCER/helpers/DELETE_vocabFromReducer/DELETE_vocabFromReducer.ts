//
//
//

import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_reducerErr } from "../CREATE_reducerErr/CREATE_reducerErr";

/**
 * Deletes a vocab from the reducer by its ID.
 *
 * @param state - The current state of the vocabs reducer.
 * @param payload - The ID of the vocab to delete.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "DELETE_vocabFromReducer";

export function DELETE_vocabFromReducer(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: string
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

  // check if PAYLOAD has the vocab id string
  if (!payload)
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'payload' was undefined"
    );

  // Check if the vocab actually exists in the array before removing
  const vocabExists = state.data.vocabs.some((vocab) => vocab.id === payload);
  if (!vocabExists) {
    return state; // No change needed
  }

  // Filter out the vocab to delete
  const updatedVocabs = state.data.vocabs.filter(
    (vocab) => vocab.id !== payload
  );

  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v.id));
  const totalCount = state?.data?.unpaginated_COUNT - 1;

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: updatedVocabs?.length >= totalCount,
    },
  };
}
