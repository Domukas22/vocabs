//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_err_TYPE } from "../../Vocab_REDUCER";

const function_NAME = "UPDATE_reducerState";

/**
 * Appends new covabs to the end of the reducer state.
 *
 * @param state - The current state of the vocabs.
 * @param payload - New vocabs to add to the reducer + the new unpaginated_COUNT.
 * @param CREATE_err - Error handler function.
 * @returns The updated state of the vocabs.
 */

export function ADD_newPaginatedVocabsToReducerState(
  state: myVocabs_REDUCER_RESPONSE_TYPE,
  payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number },
  CREATE_err: CREATE_err_TYPE
): myVocabs_REDUCER_RESPONSE_TYPE {
  // check if the CURRENT STATE has a valid vocab array
  if (!state?.data?.vocabs)
    return {
      error: CREATE_err("current_state_vocabs_array_undefined", function_NAME),
      loading_STATE: "error",
    };

  // check if the PAYLOAD has a valid vocab array
  if (!payload?.vocabs) {
    return {
      error: CREATE_err("payload_vocabs_array_undefined", function_NAME),
      loading_STATE: "error",
    };
  }

  // check if the PAYLOAD has a valid unpaginated count
  if (typeof payload?.unpaginated_COUNT !== "number") {
    return {
      error: CREATE_err(
        "payload_unpaginated_count_is_not_number",
        function_NAME
      ),
      loading_STATE: "error",
    };
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
