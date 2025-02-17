//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, DELETE_oneVocab_PAYLOAD } from "../../types";
import { DELETE_vocabFromReducer } from "./DELETE_vocabFromReducer";
import { Vocab_TYPE } from "@/src/features/vocabs/types";

// Mock state and payload
const mockState = {
  data: {
    vocabs: [{ id: "1" }, { id: "2" }] as Vocab_TYPE[],
    printed_IDS: new Set(["1", "2"]),
    unpaginated_COUNT: 2,
    HAS_reachedEnd: false,
  },
  z_myVocabsLoading_STATE: "none",
} as vocabsReducer_TYPE;

const validPayload = "2" as DELETE_oneVocab_PAYLOAD; // id to delete
const invalidPayload = "3" as DELETE_oneVocab_PAYLOAD; // id not in the vocabs

const errorMessage = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME: "DELETE_vocabFromReducer",
  });
};

describe("DELETE_vocabFromReducer", () => {
  test("1. Deletes the vocab with the given id", () => {
    const updatedState = DELETE_vocabFromReducer(mockState, validPayload);
    expect(updatedState?.data?.vocabs).toHaveLength(1);
    expect(updatedState?.data?.vocabs.map((vocab) => vocab.id)).toEqual(["1"]);
    expect(updatedState?.data?.printed_IDS.has("2")).toBe(false);
  });

  test("2. Throws error if state is undefined", () => {
    const invalidState = undefined as unknown as vocabsReducer_TYPE;
    expect(() => DELETE_vocabFromReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state' was undefined")
    );
  });

  test("3. Throws error if state.data is undefined", () => {
    const invalidState = {
      ...mockState,
      data: undefined,
    } as unknown as vocabsReducer_TYPE;
    expect(() => DELETE_vocabFromReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state.data' was undefined")
    );
  });

  test("4. Throws error if state.data.vocabs is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, vocabs: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => DELETE_vocabFromReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state.data.vocabs' was undefined")
    );
  });

  test("5. Throws error if state.data.unpaginated_COUNT is not a number", () => {
    const invalidState = {
      ...mockState,
      data: {
        vocabs: [{ id: "1" }, { id: "2" }] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: "not-a-number" as unknown as number,
        HAS_reachedEnd: false,
      },
    };
    expect(() => DELETE_vocabFromReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state.data.unpaginated_COUNT' was not a number")
    );
  });

  test("6. Throws error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as DELETE_oneVocab_PAYLOAD;
    expect(() => DELETE_vocabFromReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload' was undefined")
    );
  });

  test("7. Returns the same state if vocab doesn't exist", () => {
    const updatedState = DELETE_vocabFromReducer(mockState, invalidPayload);
    expect(updatedState).toEqual(mockState); // No change
  });

  test("8. Updates printed_IDS after deletion", () => {
    const updatedState = DELETE_vocabFromReducer(mockState, validPayload);
    expect(updatedState?.data?.printed_IDS.has("2")).toBe(false);
    expect(updatedState?.data?.printed_IDS.has("1")).toBe(true);
  });

  test("9. Throws error if a vocab inside 'state.data.vocabs' does not have an id", () => {
    const invalidState = {
      data: {
        vocabs: [{ id: "1" }, { notid: "2" }] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      z_myVocabsLoading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => DELETE_vocabFromReducer(invalidState, "1")).toThrow(
      errorMessage("A vocab inside 'state.data.vocabs' did not have an id")
    );
  });
});
