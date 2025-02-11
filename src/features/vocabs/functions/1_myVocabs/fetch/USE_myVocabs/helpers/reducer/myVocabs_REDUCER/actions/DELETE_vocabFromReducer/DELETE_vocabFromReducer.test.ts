//
//
//
import { DELETE_vocabFromReducer } from "./DELETE_vocabFromReducer";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { CREATE_err_TYPE } from "../../myVocabs_REDUCER";

describe("DELETE_vocabFromReducer", () => {
  const mockCreateError = jest.fn((code, func) => ({
    user_MSG: `${func}: ${code}`,
  })) as unknown as CREATE_err_TYPE;

  const initialState: myVocabs_REDUCER_RESPONSE_TYPE = {
    data: {
      vocabs: [
        { id: "1", word: "test" } as unknown as Vocab_MODEL,
        { id: "2", word: "example" } as unknown as Vocab_MODEL,
      ],
      printed_IDS: new Set(["1", "2"]),
      unpaginated_COUNT: 2,
      HAS_reachedEnd: false,
    },
    error: undefined,
    loading_STATE: "none",
  };

  test("1. Deletes a vocab successfully", () => {
    const newState = DELETE_vocabFromReducer(
      initialState,
      "1",
      mockCreateError
    );

    expect(newState?.data?.vocabs.length).toBe(1);
    expect(newState?.data?.vocabs.some((v) => v.id === "1")).toBe(false);
    expect(newState?.data?.unpaginated_COUNT).toBe(1);
    expect(newState.error).toBeUndefined();
  });

  test("2. Returns the same state when vocab ID doesn't exist", () => {
    const newState = DELETE_vocabFromReducer(
      initialState,
      "999",
      mockCreateError
    );

    expect(newState).toEqual(initialState);
  });

  test("3. Returns error when `state.data.vocabs` is undefined", () => {
    const brokenState = { ...initialState, data: undefined };

    const newState = DELETE_vocabFromReducer(brokenState, "1", mockCreateError);

    expect(newState.error).toEqual(
      mockCreateError(
        "current_state_vocabs_array_undefined",
        "DELETE_vocabFromReducer"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("4. Returns error when `state.data.unpaginated_COUNT` is not a number", () => {
    const brokenState = {
      ...initialState,
      data: { ...initialState.data, unpaginated_COUNT: "invalid" as any },
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = DELETE_vocabFromReducer(brokenState, "1", mockCreateError);

    expect(newState.error).toEqual(
      mockCreateError(
        "current_state_unpaginated_count_is_not_number",
        "DELETE_vocabFromReducer"
      )
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("5. Returns error when payload vocab ID is undefined", () => {
    const newState = DELETE_vocabFromReducer(
      initialState,
      undefined as any,
      mockCreateError
    );

    expect(newState.error).toEqual(
      mockCreateError("payload_vocab_id_undefined", "DELETE_vocabFromReducer")
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("6. Returns error when payload vocab ID is an empty string", () => {
    const newState = DELETE_vocabFromReducer(initialState, "", mockCreateError);

    expect(newState.error).toEqual(
      mockCreateError("payload_vocab_id_undefined", "DELETE_vocabFromReducer")
    );
    expect(newState.loading_STATE).toBe("error");
  });

  test("7. Ensures `unpaginated_COUNT` decrements only when deletion happens", () => {
    const prevState = { ...initialState };

    const newState = DELETE_vocabFromReducer(
      initialState,
      "2",
      mockCreateError
    );

    expect(newState?.data?.unpaginated_COUNT).toBe(1);
    expect(newState).not.toEqual(prevState);
  });

  test("8. Ensures `HAS_reachedEnd` updates correctly when needed", () => {
    const prevState = {
      ...initialState,
      data: {
        ...initialState.data,
        unpaginated_COUNT: 1,
        HAS_reachedEnd: false,
      },
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = DELETE_vocabFromReducer(prevState, "1", mockCreateError);

    expect(newState?.data?.HAS_reachedEnd).toBe(true);
  });
});
