//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, START_fetch_PAYLOAD } from "../../types";
import { START_vocabReducerFetch } from "./START_vocabReducerFetch";
import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";

// Mock state and payload
const mockState = {
  data: {
    vocabs: [{ id: "1" }, { id: "2" }] as raw_Vocab_TYPE[],
    printed_IDS: new Set(["1", "2"]),
    unpaginated_COUNT: 2,
    HAS_reachedEnd: false,
  },
  z_myVocabsLoading_STATE: "none",
} as vocabsReducer_TYPE;

const loadingMorePayload = "loading_more" as START_fetch_PAYLOAD; // Trigger for loading more
const resetPayload = "reset" as START_fetch_PAYLOAD; // Reset the state

// Mock error function
const errorMessage = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME: "START_vocabReducerFetch",
  });
};

describe("START_vocabReducerFetch", () => {
  test("1. Sets loading state to 'loading_more' without modifying data when payload is 'loading_more'", () => {
    const updatedState = START_vocabReducerFetch(mockState, loadingMorePayload);
    expect(updatedState?.z_myVocabsLoading_STATE).toBe("loading_more");
    expect(updatedState?.data).toEqual(mockState.data); // Data state remains unchanged
  });

  test("2. Resets the state when payload is not 'loading_more'", () => {
    const updatedState = START_vocabReducerFetch(mockState, resetPayload);
    expect(updatedState?.z_myVocabsLoading_STATE).toBe("reset");
    expect(updatedState?.data?.vocabs).toEqual([]);
    expect(updatedState?.data?.printed_IDS).toEqual(new Set());
    expect(updatedState?.data?.unpaginated_COUNT).toBe(0);
    expect(updatedState?.data?.HAS_reachedEnd).toBe(false);
  });

  test("3. Throws error if state is undefined", () => {
    const invalidState = undefined as unknown as vocabsReducer_TYPE;
    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state' was undefined")
    );
  });

  test("4. Throws error if state.data is undefined", () => {
    const invalidState = {
      ...mockState,
      data: undefined,
    } as unknown as vocabsReducer_TYPE;
    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state.data' was undefined")
    );
  });

  test("5. Throws error if state.data.vocabs is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, vocabs: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state.data.vocabs' was undefined")
    );
  });

  test("6. Throws error if state.data.printed_IDS is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, printed_IDS: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state.data.printed_IDS' was undefined")
    );
  });

  test("7. Throws error if state.data.unpaginated_COUNT is not a number", () => {
    const invalidState = {
      data: {
        vocabs: [{ id: "1" }, { id: "2" }] as raw_Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: "not-a-number" as unknown as number,
        HAS_reachedEnd: false,
      },
      z_myVocabsLoading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state.data.unpaginated_COUNT' was not a number")
    );
  });

  test("8. Throws error if state.data.HAS_reachedEnd is not a boolean", () => {
    const invalidState = {
      data: {
        vocabs: [{ id: "1" }, { id: "2" }] as raw_Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: "notABoolean" as unknown as boolean,
      },
      z_myVocabsLoading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => START_vocabReducerFetch(invalidState, resetPayload)).toThrow(
      errorMessage("Reducer 'state.data.HAS_reachedEnd' was not a boolean")
    );
  });

  test("9. Throws error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as START_fetch_PAYLOAD;
    expect(() => START_vocabReducerFetch(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload' was undefined")
    );
  });
});
