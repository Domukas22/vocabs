//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { DELETE_oneVocab_PAYLOAD, vocabsReducer_TYPE } from "../../types";

/**
 * Deletes a vocab from the reducer by its ID.
 *
 * @param state - The current state of the vocabs reducer.
 * @param payload - The ID of the vocab to delete.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

const function_NAME = "DELETE_vocabFromReducer";

const err = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME,
  });
};

export function DELETE_vocabFromReducer(
  state: vocabsReducer_TYPE,
  payload: DELETE_oneVocab_PAYLOAD
): vocabsReducer_TYPE {
  if (!state) throw err("Reducer 'state' was undefined");

  if (!state.data) throw err("Reducer 'state.data' was undefined");

  if (!state.data.vocabs)
    throw err("Reducer 'state.data.vocabs' was undefined");

  if (typeof state.data.unpaginated_COUNT !== "number")
    throw err("Reducer 'state.data.unpaginated_COUNT' was not a number");

  if (!payload) throw err("Reducer 'payload' was undefined");

  // Check if the vocab actually exists in the array before removing
  const vocabExists = state.data.vocabs.some((vocab) => vocab.id === payload);
  if (!vocabExists) return state; // No change needed

  // Filter out the vocab to delete
  const updatedVocabs = state.data.vocabs.filter((v) => {
    if (!v.id)
      throw err("A vocab inside 'state.data.vocabs' did not have an id");
    return v.id !== payload;
  });

  const updatedPrintedIds = new Set(updatedVocabs?.map((v) => v.id));

  const totalCount = state.data.unpaginated_COUNT - 1;

  return {
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: totalCount,
      HAS_reachedEnd: updatedVocabs.length >= totalCount,
    },
    z_myVocabsLoading_STATE: "none",
  };
}
