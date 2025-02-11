//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_reducerErr } from "../CREATE_reducerErr/CREATE_reducerErr";

/**
 * Appends new covabs to the end of the reducer state.
 *
 * @param state - The current state of the vocabs.
 * @param payload - New vocabs to add to the reducer + the new unpaginated_COUNT.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "ADD_newPaginatedVocabsToReducerState";

export function ADD_newPaginatedVocabsToReducerState(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number }
): myVocabs_REDUCER_RESPONSE_TYPE {
  // check if the CURRENT STATE has a valid vocab array

  if (!state?.data?.vocabs)
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'data.vocabs' was undefined"
    );

  // check if the PAYLOAD has a valid vocab array
  if (!payload?.vocabs) {
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'payload.vocabs' was undefined"
    );
  }

  // check if the PAYLOAD has a valid unpaginated count
  if (typeof payload?.unpaginated_COUNT !== "number") {
    return CREATE_reducerErr(
      function_NAME,
      "Reducer state 'payload.unpaginated_COUNT' was not a number"
    );
  }

  // Prevent duplicates: filter out vocabs that already exist in printed_IDS
  const newVocabs = payload.vocabs?.filter(
    (vocab) => !state?.data?.printed_IDS.has(vocab.id)
  );

  const updatedVocabs = [...state?.data?.vocabs, ...newVocabs];
  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v?.id));
  payload.vocabs.forEach((vocab) => updatedPrintedIds.add(vocab.id));

  return {
    ...state,
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: payload?.unpaginated_COUNT,
      HAS_reachedEnd: updatedVocabs?.length >= payload?.unpaginated_COUNT,
    },
  };
}
