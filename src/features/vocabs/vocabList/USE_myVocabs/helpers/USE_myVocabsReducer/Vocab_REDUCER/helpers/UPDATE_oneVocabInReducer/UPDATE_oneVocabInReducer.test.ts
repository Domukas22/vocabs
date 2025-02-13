//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, UPDATE_oneVocab_PAYLOAD } from "../../types";
import { UPDATE_oneVocabInReducer } from "./UPDATE_oneVocabInReducer";
import { Vocab_TYPE } from "@/src/features/vocabs/types";

// Mock state and payload
const mockState = {
  data: {
    vocabs: [
      { id: "1", searchable: "Searchable1" },
      { id: "2", searchable: "Searchable2" },
    ] as Vocab_TYPE[],
    printed_IDS: new Set(["1", "2"]),
    unpaginated_COUNT: 2,
    HAS_reachedEnd: false,
  },
  loading_STATE: "none",
} as vocabsReducer_TYPE;

const updatePayload = {
  id: "1",
  searchable: "UpdatedSearchable",
} as UPDATE_oneVocab_PAYLOAD; // Payload for update

// Mock error function
const errorMessage = (message: string) => {
  return new General_ERROR({
    message,
    function_NAME: "UPDATE_oneVocabInReducer",
  });
};

describe("UPDATE_oneVocabInReducer", () => {
  test("1. Updates the vocab with the same id", () => {
    const updatedState = UPDATE_oneVocabInReducer(mockState, updatePayload);
    expect(updatedState?.data?.vocabs).toHaveLength(2);
    expect(updatedState?.data?.vocabs[0].searchable).toBe("UpdatedSearchable"); // Vocab should be updated
  });

  test("2. Throws error if state is undefined", () => {
    const invalidState = undefined as unknown as vocabsReducer_TYPE;
    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state' was undefined")
    );
  });

  test("3. Throws error if state.data is undefined", () => {
    const invalidState = {
      ...mockState,
      data: undefined,
    } as unknown as vocabsReducer_TYPE;
    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state.data' was undefined")
    );
  });

  test("4. Throws error if state.data.vocabs is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, vocabs: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state.data.vocabs' was undefined")
    );
  });

  test("5. Throws error if state.data.printed_IDS is undefined", () => {
    const invalidState = {
      ...mockState,
      data: { ...mockState.data, printed_IDS: undefined },
    } as unknown as vocabsReducer_TYPE;
    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state.data.printed_IDS' was undefined")
    );
  });

  test("6. Throws error if state.data.unpaginated_COUNT is not a number", () => {
    const invalidState = {
      data: {
        vocabs: [
          { id: "1", searchable: "Searchable1" },
          { id: "2", searchable: "Searchable2" },
        ] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: "not-a-number" as unknown as number,
        HAS_reachedEnd: false,
      },
      loading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state.data.unpaginated_COUNT' was not a number")
    );
  });

  test("7. Throws error if state.data.HAS_reachedEnd is not a boolean", () => {
    const invalidState = {
      data: {
        vocabs: [
          { id: "1", searchable: "Searchable1" },
          { id: "2", searchable: "Searchable2" },
        ] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: "notABoolean" as unknown as boolean,
      },
      loading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("Reducer 'state.data.HAS_reachedEnd' was not a boolean")
    );
  });

  test("8. Throws error if payload is undefined", () => {
    const invalidPayload = undefined as unknown as UPDATE_oneVocab_PAYLOAD;
    expect(() => UPDATE_oneVocabInReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload' was undefined")
    );
  });

  test("9. Throws error if payload.id is undefined", () => {
    const invalidPayload = {
      searchable: "UpdatedSearchable",
    } as unknown as UPDATE_oneVocab_PAYLOAD;
    expect(() => UPDATE_oneVocabInReducer(mockState, invalidPayload)).toThrow(
      errorMessage("Reducer 'payload.id' was undefined")
    );
  });

  test("10. Throws error if a vocab inside state.data.vocabs does not have an id", () => {
    const invalidState = {
      data: {
        vocabs: [
          { searchable: "Searchable1" },
          { id: "2", searchable: "Searchable2" },
        ] as Vocab_TYPE[],
        printed_IDS: new Set(["1", "2"]),
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      loading_STATE: "none",
    } as vocabsReducer_TYPE;

    expect(() => UPDATE_oneVocabInReducer(invalidState, updatePayload)).toThrow(
      errorMessage("A vocab inside 'state.data.vocabs' did not have an id")
    );
  });
});
