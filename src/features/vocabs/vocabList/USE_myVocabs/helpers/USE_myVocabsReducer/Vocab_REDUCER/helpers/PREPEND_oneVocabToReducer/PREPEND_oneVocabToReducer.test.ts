//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, PREPEND_oneVocab_PAYLOAD } from "../../types";
import { PREPEND_oneVocabToReducer } from "./PREPEND_oneVocabToReducer";
import { Vocab_TYPE } from "@/src/features/vocabs/types";

// Mock state and payload
const mockState = {
  data: {
    vocabs: [{ id: "1" }, { id: "2" }] as Vocab_TYPE[],
    printed_IDS: new Set(["1", "2"]),
    unpaginated_COUNT: 2,
    HAS_reachedEnd: false,
  },
  loading_STATE: "none",
} as vocabsReducer_TYPE;

const validPayload = { id: "3" } as PREPEND_oneVocab_PAYLOAD; // New vocab to add
const invalidPayload = { id: "4" } as PREPEND_oneVocab_PAYLOAD; // Vocab not to be prepended (already exists)

// Mock error function
const errorMessage = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME: "PREPEND_oneVocabToReducer",
  });
};

describe("PREPEND_oneVocabToReducer", () => {
  test("1. Prepends the vocab with the given id", () => {
    const updatedState = PREPEND_oneVocabToReducer(mockState, validPayload);
    expect(updatedState?.data?.vocabs).toHaveLength(3);
    expect(updatedState?.data?.vocabs.map((vocab) => vocab.id)).toEqual([
      "3",
      "1",
      "2",
    ]);
    expect(updatedState?.data?.printed_IDS.has("3")).toBe(true);
  });

  test("2. Throws error if state is undefined", () => {
    const invalidState = undefined as unknown as vocabsReducer_TYPE;
    expect(() => PREPEND_oneVocabToReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state' was undefined")
    );
  });

  test("3. Throws error if state.data is undefined", () => {
    const invalidState = {
      ...mockState,
      data: undefined,
    } as unknown as vocabsReducer_TYPE;
    expect(() => PREPEND_oneVocabToReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state.data' was undefined")
    );
  });

  test("4. Throws error if state.data.vocabs is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, vocabs: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => PREPEND_oneVocabToReducer(invalidState, validPayload)).toThrow(
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
    expect(() => PREPEND_oneVocabToReducer(invalidState, validPayload)).toThrow(
      errorMessage("Reducer 'state.data.unpaginated_COUNT' was not a number")
    );
  });

  test("6. Throws error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as PREPEND_oneVocab_PAYLOAD;
    expect(() => PREPEND_oneVocabToReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload' was undefined")
    );
  });

  test("7. Throws error if payload.id is undefined", () => {
    const invalidPayload = {
      id: undefined,
    } as unknown as PREPEND_oneVocab_PAYLOAD;
    expect(() => PREPEND_oneVocabToReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload.id' was undefined")
    );
  });

  test("8. Prevents duplicates when vocab already exists", () => {
    const state = {
      data: {
        vocabs: [{ id: "1" }, { id: "2" }] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      loading_STATE: "none",
    } as vocabsReducer_TYPE;

    const payload = { id: "2" } as PREPEND_oneVocab_PAYLOAD;

    const updatedState = PREPEND_oneVocabToReducer(state, payload);
    expect(updatedState).toEqual(state); // No change
  });

  test("9. Throws error if a vocab inside 'newVocabs' did not have an id", () => {
    const invalidState = {
      data: {
        vocabs: [{ id: "1" }, { notid: "2" }] as Vocab_TYPE[], // Missing 'id' for second vocab
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      loading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => PREPEND_oneVocabToReducer(invalidState, validPayload)).toThrow(
      errorMessage("A vocab inside 'newVocabs' did not have an id")
    );
  });
});
