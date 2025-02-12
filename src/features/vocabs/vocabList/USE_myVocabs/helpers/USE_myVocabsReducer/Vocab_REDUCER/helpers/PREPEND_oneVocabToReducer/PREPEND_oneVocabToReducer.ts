//
//
//

import { vocabsReducer_TYPE, PREPEND_oneVocab_PAYLOAD } from "../../types";
import { General_ERROR } from "@/src/types/error_TYPES";

/**
 * Adds a vocab to the reducer.
 *
 * @param state - The current state of the vocabs.
 * @param payload - The vocab object to add.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "PREPEND_oneVocabToReducer";

const err = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME,
  });
};

export function PREPEND_oneVocabToReducer(
  state: vocabsReducer_TYPE,
  payload: PREPEND_oneVocab_PAYLOAD
): vocabsReducer_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    throw err("Reducer state 'data.vocabs' was undefined");

  // check if the CURRENT STATE has a valid unpaginated count
  if (typeof state?.data?.unpaginated_COUNT !== "number")
    throw err("Reducer state 'payload.unpaginated_COUNT' was not a number");

  // check if the PAYLOAD has a valid vocab id
  if (!payload?.id) throw err("Reducer state 'payload.id' was undefined");

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
