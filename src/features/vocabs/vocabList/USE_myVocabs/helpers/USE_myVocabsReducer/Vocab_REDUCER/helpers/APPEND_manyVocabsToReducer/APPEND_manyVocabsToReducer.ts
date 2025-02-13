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
  if (!state) throw err("Reducer 'state' was undefined");

  if (!state.data) throw err("Reducer 'state.data' was undefined");

  if (!state.data.vocabs)
    throw err("Reducer 'state.data.vocabs' was undefined");

  if (!state.data.printed_IDS)
    throw err("Reducer 'state.data.printed_IDS' was undefined");

  if (!payload) throw err("Reducer 'payload' was undefined");

  if (!payload.vocabs) throw err("Reducer 'payload.vocabs' was undefined");

  if (typeof payload.unpaginated_COUNT !== "number")
    throw err("Reducer 'payload.unpaginated_COUNT' was not a number");

  // Prevent duplicates: filter out vocabs that already exist in printed_IDS
  const newVocabs = payload.vocabs?.filter((vocab) => {
    if (!vocab.id)
      throw err("A vocab inside 'payload.vocabs' did not have an id");
    return !state?.data?.printed_IDS.has(vocab.id);
  });

  // Append new vocabs
  const updatedVocabs = [...state.data.vocabs, ...newVocabs];

  // Update printed ids
  const updatedPrintedIds = new Set(
    updatedVocabs?.map((v) => {
      if (!v.id) throw err("A vocab inside 'updatedVocabs' did not have an id");
      return v.id;
    })
  );

  return {
    data: {
      vocabs: updatedVocabs,
      printed_IDS: updatedPrintedIds,
      unpaginated_COUNT: payload.unpaginated_COUNT,
      HAS_reachedEnd: updatedVocabs.length >= payload.unpaginated_COUNT,
    },
    loading_STATE: "none",
  };
}
