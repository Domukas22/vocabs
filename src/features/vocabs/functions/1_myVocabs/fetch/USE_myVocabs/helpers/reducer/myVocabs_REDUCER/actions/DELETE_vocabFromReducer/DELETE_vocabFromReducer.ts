//
//
//

import { CREATE_err_TYPE } from "../../myVocabs_REDUCER";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";

const function_NAME = "DELETE_vocabFromReducer";

/**
 * Deletes a vocab from the reducer by its ID.
 *
 * @param state - The current state of the vocabs reducer.
 * @param payload - The ID of the vocab to delete.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

export function DELETE_vocabFromReducer(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: string,
  CREATE_err: CREATE_err_TYPE
): myVocabs_REDUCER_RESPONSE_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    return {
      error: CREATE_err("current_state_vocabs_array_undefined", function_NAME),
      loading_STATE: "error",
    };

  // check if the CURRENT STATE has a valid unpaginated count
  if (typeof state?.data?.unpaginated_COUNT !== "number")
    return {
      error: CREATE_err(
        "current_state_unpaginated_count_is_not_number",
        function_NAME
      ),
      loading_STATE: "error",
    };

  // check if PAYLOAD has the vocab id string
  if (!payload)
    return {
      error: CREATE_err("payload_vocab_id_undefined", function_NAME),
      loading_STATE: "error",
    };

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
