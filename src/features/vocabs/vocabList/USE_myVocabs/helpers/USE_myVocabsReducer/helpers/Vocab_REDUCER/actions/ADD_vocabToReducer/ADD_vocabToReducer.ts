//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_err_TYPE } from "../../Vocab_REDUCER";

const function_NAME = "ADD_vocabToReducer";

/**
 * Adds a vocab to the reducer.
 *
 * @param state - The current state of the vocabs.
 * @param payload - The vocab object to add.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

export function ADD_vocabToReducer(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: Vocab_MODEL,
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

  // check if the PAYLOAD has a valid vocab id
  if (!payload?.id)
    return {
      error: CREATE_err("payload_vocab_id_undefined", function_NAME),
      loading_STATE: "error",
    };

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
