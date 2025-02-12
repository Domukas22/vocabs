//
//
//

import { APPEND_manyVocabs_PAYLOAD, vocabsReducer_TYPE } from "../../types";
import { General_ERROR } from "@/src/types/error_TYPES";

/**
 * Appends new covabs to the end of the reducer state.
 *
 * @param state - The current state of the vocabs.
 * @param payload - New vocabs to add to the reducer + the new unpaginated_COUNT.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "APPEND_manyVocabsToReducer";

const err = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME,
  });
};

export function APPEND_manyVocabsToReducer(
  state: vocabsReducer_TYPE,
  payload: APPEND_manyVocabs_PAYLOAD
): vocabsReducer_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    throw err("Reducer state 'data.vocabs' was undefined");

  // check if the PAYLOAD has a valid vocab array
  if (!payload?.vocabs)
    throw err("Reducer state 'payload.vocabs' was undefined");

  // check if the PAYLOAD has a valid unpaginated count
  if (typeof payload?.unpaginated_COUNT !== "number")
    throw err("Reducer state 'payload.unpaginated_COUNT' was not a number");

  // Prevent duplicates: filter out vocabs that already exist in printed_IDS
  const newVocabs = payload.vocabs?.filter(
    (vocab) => !state?.data?.printed_IDS.has(vocab.id)
  );

  // If 'CLEAR_previous' is true, it means we re-fetching based on dependency changes
  // Else, we are loading additional vocabs (pagination)
  const updatedVocabs = [...state?.data?.vocabs, ...newVocabs];

  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v?.id));
  payload.vocabs.forEach((vocab) => updatedPrintedIds.add(vocab.id));

  return {
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: payload?.unpaginated_COUNT,
      HAS_reachedEnd: updatedVocabs?.length >= payload?.unpaginated_COUNT,
    },
    loading_STATE: "none",
  };
}
