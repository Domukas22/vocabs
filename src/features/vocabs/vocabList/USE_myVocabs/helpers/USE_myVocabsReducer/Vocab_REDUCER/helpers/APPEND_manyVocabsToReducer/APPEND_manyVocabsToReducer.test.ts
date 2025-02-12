//
//
//

import { renderHook, act } from "@testing-library/react-native";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { vocabsReducer_TYPE } from "../../types";

import { APPEND_manyVocabsToReducer } from "./APPEND_manyVocabsToReducer";

describe("UPDATE_reducerVocabState", () => {
  const mockCreateError = jest.fn((code, func) => ({
    user_MSG: `${func}: ${code}`,
  })) as unknown as CREATE_err_TYPe;

  const initialState: vocabsReducer_TYPE = {
    data: {
      vocabs: [],
      printed_IDS: new Set(),
      unpaginated_COUNT: 0,
      HAS_reachedEnd: false,
    },
    error: undefined,
    loading_STATE: "none",
  };

  const mockVocabs: Vocab_MODEL[] = [
    { id: "1", word: "test1" } as unknown as Vocab_MODEL,
    { id: "2", word: "test2" } as unknown as Vocab_MODEL,
  ];

  test("1. Appends new vocabs and updates state correctly", () => {
    const payload = { vocabs: mockVocabs, unpaginated_COUNT: 5 };

    const newState = APPEND_manyVocabsToReducer(
      initialState,
      payload,
      mockCreateError
    );

    expect(newState?.data?.vocabs).toEqual(mockVocabs);
    expect(newState?.data?.unpaginated_COUNT).toBe(5);
    expect(newState?.data?.HAS_reachedEnd).toBe(false);
    expect(newState.error).toBeUndefined();
  });

  test("2. Merges new vocabs without duplicates", () => {
    const prevState = {
      ...initialState,
      data: {
        ...initialState.data,
        vocabs: [{ id: "1", word: "test1" } as unknown as Vocab_MODEL],
        printed_IDS: new Set(["1"]),
      },
    } as vocabsReducer_TYPE;

    const payload = {
      vocabs: [{ id: "2", word: "test2" } as unknown as Vocab_MODEL],
      unpaginated_COUNT: 5,
    };

    const newState = APPEND_manyVocabsToReducer(
      prevState,
      payload,
      mockCreateError
    );

    expect(newState?.data?.vocabs.length).toBe(2);
    expect(newState?.data?.printed_IDS.has("1")).toBe(true);
    expect(newState?.data?.printed_IDS.has("2")).toBe(true);
  });

  test("3. Sets HAS_reachedEnd correctly", () => {
    const payload = { vocabs: mockVocabs, unpaginated_COUNT: 2 };

    const newState = APPEND_manyVocabsToReducer(
      initialState,
      payload,
      mockCreateError
    );

    expect(newState?.data?.HAS_reachedEnd).toBe(true);
  });

  test("4. Returns error when state vocabs array is undefined", () => {
    const brokenState = { ...initialState, data: undefined };

    const newState = APPEND_manyVocabsToReducer(
      brokenState,
      { vocabs: mockVocabs, unpaginated_COUNT: 5 },
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError(
        "current_state_vocabs_array_undefined",
        "UPDATE_reducerState"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("5. Returns error when payload vocabs array is undefined", () => {
    const newState = APPEND_manyVocabsToReducer(
      initialState,
      { vocabs: undefined, unpaginated_COUNT: 5 } as any,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError("payload_vocabs_array_undefined", "UPDATE_reducerState")
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("6. Returns error when payload unpaginated_COUNT is not a number", () => {
    const newState = APPEND_manyVocabsToReducer(
      initialState,
      { vocabs: mockVocabs, unpaginated_COUNT: "not_a_number" } as any,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError(
        "payload_unpaginated_count_is_not_number",
        "UPDATE_reducerState"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("7. Avoids adding duplicate vocabs", () => {
    const prevState = {
      ...initialState,
      data: {
        ...initialState.data,
        vocabs: [
          { id: "1", word: "test1" } as unknown as Vocab_MODEL,
          { id: "2", word: "test2" } as unknown as Vocab_MODEL,
        ],
        printed_IDS: new Set(["1", "2"]),
      },
    } as vocabsReducer_TYPE;

    const payload = {
      vocabs: [
        { id: "2", word: "test2" } as unknown as Vocab_MODEL, // Duplicate
        { id: "3", word: "test3" } as unknown as Vocab_MODEL, // New vocab
      ],
      unpaginated_COUNT: 5,
    };

    const newState = APPEND_manyVocabsToReducer(
      prevState,
      payload,
      mockCreateError
    );

    expect(newState?.data?.vocabs.length).toBe(3); // Only one new vocab should be added
    expect(newState?.data?.printed_IDS.has("1")).toBe(true);
    expect(newState?.data?.printed_IDS.has("2")).toBe(true);
    expect(newState?.data?.printed_IDS.has("3")).toBe(true);
  });
});
