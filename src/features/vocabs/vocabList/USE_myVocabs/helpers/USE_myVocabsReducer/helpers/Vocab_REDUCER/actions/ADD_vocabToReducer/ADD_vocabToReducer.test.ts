import { ADD_vocabToReducer } from "./ADD_vocabToReducer";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_err_TYPE } from "../../Vocab_REDUCER";

describe("ADD_vocabToReducer", () => {
  const mockCreateError = jest.fn((code, func) => ({
    user_MSG: `${func}: ${code}`,
  })) as unknown as CREATE_err_TYPE;

  const initialState: myVocabs_REDUCER_RESPONSE_TYPE = {
    data: {
      vocabs: [],
      printed_IDS: new Set(),
      unpaginated_COUNT: 0,
      HAS_reachedEnd: false,
    },
    error: undefined,
    loading_STATE: "none",
  };

  const mockVocab: Vocab_MODEL = {
    id: "1",
    word: "example",
  } as unknown as Vocab_MODEL;

  test("1. Adds a vocab successfully", () => {
    const newState = ADD_vocabToReducer(
      initialState,
      mockVocab,
      mockCreateError
    );

    expect(newState?.data?.vocabs.length).toBe(1);
    expect(newState?.data?.vocabs[0]).toEqual(mockVocab);
    expect(newState?.data?.unpaginated_COUNT).toBe(1);
    expect(newState?.data?.HAS_reachedEnd).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  test("2. Prevents duplicate vocab entries", () => {
    const prevState = {
      ...initialState,
      data: {
        ...initialState.data,
        vocabs: [mockVocab], // Existing vocab
        printed_IDS: new Set(["1"]), // Existing ID
        unpaginated_COUNT: 1,
      },
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = ADD_vocabToReducer(prevState, mockVocab, mockCreateError);

    // Ensure the vocab count remains the same (no duplicate added)
    expect(newState?.data?.vocabs.length).toBe(1); // Should still be 1
    expect(newState?.data?.unpaginated_COUNT).toBe(1); // Count shouldn't increase
    expect(newState?.data?.printed_IDS.has("1")).toBe(true); // ID should still be there

    // Ensure the state has not changed (reference check)
    expect(newState).toEqual(prevState);
  });

  test("3. Returns error when state vocabs array is undefined", () => {
    const brokenState = { ...initialState, data: undefined };

    const newState = ADD_vocabToReducer(
      brokenState,
      mockVocab,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError(
        "current_state_vocabs_array_undefined",
        "ADD_vocabToReducer"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("4. Returns error when state unpaginated count is not a number", () => {
    const brokenState = {
      ...initialState,
      data: { ...initialState.data, unpaginated_COUNT: "not_a_number" as any },
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = ADD_vocabToReducer(
      brokenState,
      mockVocab,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError(
        "current_state_unpaginated_count_is_not_number",
        "ADD_vocabToReducer"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("5. Returns error when payload vocab id is undefined", () => {
    const brokenVocab = { word: "example" } as unknown as Vocab_MODEL;

    const newState = ADD_vocabToReducer(
      initialState,
      brokenVocab,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError("payload_vocab_id_undefined", "ADD_vocabToReducer")
    );
    expect(newState.loading_STATE).toBe("error");
  });
});
