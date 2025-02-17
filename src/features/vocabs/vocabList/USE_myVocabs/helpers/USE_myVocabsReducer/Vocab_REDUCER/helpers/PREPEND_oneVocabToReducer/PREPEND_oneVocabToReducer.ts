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
  if (!state) throw err("Reducer 'state' was undefined");

  if (!state.data) throw err("Reducer 'state.data' was undefined");

  if (!state.data.vocabs)
    throw err("Reducer 'state.data.vocabs' was undefined");

  if (typeof state.data.unpaginated_COUNT !== "number")
    throw err("Reducer 'state.data.unpaginated_COUNT' was not a number");

  if (!payload) throw err("Reducer 'payload' was undefined");

  if (!payload.id) throw err("Reducer 'payload.id' was undefined");

  // Prevent duplicates
  if (state.data.printed_IDS.has(payload.id)) return state;

  const newVocabs = [payload, ...state.data.vocabs];
  const updatedIds = new Set(
    newVocabs?.map((v) => {
      if (!v.id) throw err("A vocab inside 'newVocabs' did not have an id");
      return v?.id;
    })
  );
  updatedIds.add(payload.id);
  const totalCount = state.data.unpaginated_COUNT + 1;

  return {
    data: {
      vocabs: newVocabs,
      printed_IDS: updatedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: newVocabs?.length >= totalCount,
    },
    z_myVocabsLoading_STATE: "none",
  };
}
