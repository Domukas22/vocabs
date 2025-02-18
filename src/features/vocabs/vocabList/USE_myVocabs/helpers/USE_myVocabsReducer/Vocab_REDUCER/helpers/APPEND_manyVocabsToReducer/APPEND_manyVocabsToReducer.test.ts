///
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, APPEND_manyVocabs_PAYLOAD } from "../../types";
import { APPEND_manyVocabsToReducer } from "./APPEND_manyVocabsToReducer";
import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";

// Mock state and payload
const mockState = {
  data: {
    vocabs: [{ id: "1" }, { id: "2" }],
    printed_IDS: new Set(["1", "2"]),
    unpaginated_COUNT: 2,
    HAS_reachedEnd: false,
  },
  z_myVocabsLoading_STATE: "none",
} as vocabsReducer_TYPE;

const validPayload = {
  vocabs: [{ id: "3" }, { id: "4" }],
  unpaginated_COUNT: 4,
} as APPEND_manyVocabs_PAYLOAD;

const invalidPayload = {
  vocabs: [],
  unpaginated_COUNT: 0,
} as APPEND_manyVocabs_PAYLOAD;

const errorMessage = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME: "APPEND_manyVocabsToReducer",
  });
};

describe("APPEND_manyVocabsToReducer", () => {
  // 1. Successfully appends new vocabs and updates the state
  test("1. Appends new vocabs without duplicates", () => {
    const updatedState = APPEND_manyVocabsToReducer(mockState, validPayload);
    expect(updatedState?.data?.vocabs).toHaveLength(4);
    expect(updatedState?.data?.vocabs.map((vocab) => vocab.id)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
    expect(updatedState?.data?.printed_IDS.has("3")).toBe(true);
    expect(updatedState?.data?.printed_IDS.has("4")).toBe(true);
  });

  // 2. Throws an error when state is undefined
  test("2. Throws error if state is undefined", () => {
    const invalidState = undefined as unknown as vocabsReducer_TYPE;
    expect(() =>
      APPEND_manyVocabsToReducer(invalidState, validPayload)
    ).toThrow(errorMessage("Reducer 'state' was undefined"));
  });

  // 3. Throws an error when state.data is undefined
  test("3. Throws error if state.data is undefined", () => {
    const invalidState = {
      ...mockState,
      data: undefined,
    } as unknown as vocabsReducer_TYPE;
    expect(() =>
      APPEND_manyVocabsToReducer(invalidState, validPayload)
    ).toThrow(errorMessage("Reducer 'state.data' was undefined"));
  });

  // 4. Throws an error when state.data.vocabs is undefined
  test("4. Throws error if state.data.vocabs is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, vocabs: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() =>
      APPEND_manyVocabsToReducer(invalidState, validPayload)
    ).toThrow(errorMessage("Reducer 'state.data.vocabs' was undefined"));
  });

  // 5. Throws an error when state.data.printed_IDS is undefined
  test("5. Throws error if state.data.printed_IDS is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, printed_IDS: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() =>
      APPEND_manyVocabsToReducer(invalidState, validPayload)
    ).toThrow(errorMessage("Reducer 'state.data.printed_IDS' was undefined"));
  });

  // 6. Throws an error when payload is undefined
  test("6. Throws error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as APPEND_manyVocabs_PAYLOAD;
    expect(() => APPEND_manyVocabsToReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload' was undefined")
    );
  });

  // 7. Throws an error when payload.vocabs is undefined
  test("7. Throws error if payload.vocabs is undefined", () => {
    const _invalidPayload = {
      vocabs: undefined as unknown as raw_Vocab_TYPE[],
      unpaginated_COUNT: 4,
    };
    expect(() =>
      APPEND_manyVocabsToReducer(mockState, _invalidPayload)
    ).toThrow(errorMessage("Reducer 'payload.vocabs' was undefined"));
  });

  // 8. Throws an error when payload.unpaginated_COUNT is not a number
  test("8. Throws error if payload.unpaginated_COUNT is not a number", () => {
    const _invalidPayloadCount = {
      ...validPayload,
      unpaginated_COUNT: "invalid" as unknown as number,
    };
    expect(() =>
      APPEND_manyVocabsToReducer(mockState, _invalidPayloadCount)
    ).toThrow(
      errorMessage("Reducer 'payload.unpaginated_COUNT' was not a number")
    );
  });

  // 9. Handles empty vocabs array and returns the same state
  test("9. Returns the same state if no new vocabs are provided", () => {
    const updatedState = APPEND_manyVocabsToReducer(mockState, invalidPayload);
    expect(updatedState?.data?.vocabs).toEqual(mockState?.data?.vocabs);
    expect(updatedState?.data?.printed_IDS).toEqual(
      mockState?.data?.printed_IDS
    );
  });

  // 10. Throws an error when a vocab inside payload.vocabs does not have an id
  test("10. Throws error if a vocab inside 'payload.vocabs' does not have an id", () => {
    const invalidPayload = {
      vocabs: [
        { id: "3" },
        { id: undefined as unknown as string },
      ] as raw_Vocab_TYPE[],
      unpaginated_COUNT: 4,
    };
    expect(() => APPEND_manyVocabsToReducer(mockState, invalidPayload)).toThrow(
      errorMessage("A vocab inside 'payload.vocabs' did not have an id")
    );
  });

  // 11. Throws an error when a vocab inside updated vocabs does not have an id
  test("11. Throws error if a vocab inside 'updatedVocabs' did not have an id", () => {
    const invalidState = {
      data: {
        vocabs: [{ thing: "s" }, { id: "2" }],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 4,
        HAS_reachedEnd: false,
      },
      z_myVocabsLoading_STATE: "none",
    } as vocabsReducer_TYPE;

    const validPayload = {
      vocabs: [{ id: "3" }],
      unpaginated_COUNT: 4,
    } as APPEND_manyVocabs_PAYLOAD;

    expect(() =>
      APPEND_manyVocabsToReducer(invalidState, validPayload)
    ).toThrow(
      errorMessage("A vocab inside 'updatedVocabs' did not have an id")
    );
  });
});
