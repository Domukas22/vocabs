import { renderHook, act } from "@testing-library/react-native";
import { USE_myVocabsReducer } from "./USE_myVocabsReducer";
import { SEND_internalError } from "@/src/utils";
import { Error_PROPS } from "@/src/props";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "./Vocab_REDUCER/types";
import { Vocab_MODEL } from "@/src/features/vocabs/types";

// Initial state for reducer
const myVocabsReducerInitial_STATE: myVocabs_REDUCER_RESPONSE_TYPE = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
    HAS_reachedEnd: false,
  },
  loading_STATE: "loading",
};

jest.mock("@/src/utils", () => ({
  SEND_internalError: jest.fn(),
}));

describe("USE_myVocabsReducer", () => {
  let initialState: myVocabs_REDUCER_RESPONSE_TYPE;

  beforeEach(() => {
    initialState = { ...myVocabsReducerInitial_STATE };

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // 1. Sets loading state correctly
  test("1. Sets loading state correctly", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Call the function to set loading state
    act(() => {
      result.current.SET_reducerLoadingState("loading");
    });

    expect(result.current.reducer_STATE.loading_STATE).toBe("loading");
  });

  // 2. Sets error state and triggers internal error log
  test("2. Sets error state and triggers internal error log", () => {
    const error = {
      message: "Some error occurred",
      code: "500",
    } as unknown as Error_PROPS;
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Triggering an error state
    act(() => {
      result.current.SET_reducerError(error);
    });

    expect(result.current.reducer_STATE.error).toEqual(error);
    expect(SEND_internalError).toHaveBeenCalledWith(error);
  });

  // 3. Resets reducer state correctly
  test("3. Resets reducer state correctly", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Triggering state reset
    act(() => {
      result.current.RESET_reducerState();
    });

    expect(result.current.reducer_STATE).toEqual(initialState);
  });

  // 4. Appends vocabs to pagination
  test("4. Appends vocabs to pagination", () => {
    const newVocabs = [{ id: "1", word: "example" }];
    const data = {
      vocabs: newVocabs as unknown as Vocab_MODEL[],
      unpaginated_COUNT: 1,
    };
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Appending vocabs
    act(() => {
      result.current.APPEND_vocabsToPagination(data);
    });

    // Check if the state updated correctly
    expect(result?.current?.reducer_STATE?.data?.vocabs).toContainEqual(
      newVocabs[0]
    );
    expect(result?.current?.reducer_STATE?.data?.unpaginated_COUNT).toBe(1);
  });

  // 5. Prepends vocab to reducer
  test("5. Prepends vocab to reducer", () => {
    const newVocab = { id: "1", word: "example" } as unknown as Vocab_MODEL;
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Prepending vocab
    act(() => {
      result.current.PREPEND_vocabToReducer(newVocab);
    });

    expect(result?.current?.reducer_STATE?.data?.vocabs).toContainEqual(
      newVocab
    );
  });

  // TODO ====> doesnt make sense
  test("6. Removes vocab from reducer", () => {
    const existingVocab = { id: "1", word: "example" };

    const { result } = renderHook(() => USE_myVocabsReducer());

    // Removing vocab
    act(() => {
      result.current.REMOVE_vocabFromReducer("1");
    });

    expect(result?.current?.reducer_STATE?.data?.vocabs).not.toContainEqual(
      existingVocab
    );
  });

  // 7. Handles undefined error gracefully
  test("7. Handles undefined error gracefully", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Setting error to undefined
    act(() => {
      result.current.SET_reducerError(undefined);
    });

    expect(result.current.reducer_STATE.error).toBeUndefined();
  });

  // 8. Handles undefined vocab gracefully
  test("8. Handles undefined vocab gracefully", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Attempting to prepend undefined vocab
    act(() => {
      result.current.PREPEND_vocabToReducer(
        undefined as unknown as Vocab_MODEL
      );
    });

    expect(result?.current?.reducer_STATE?.data?.vocabs).toBeUndefined();
    expect(result?.current?.reducer_STATE?.error).toBeDefined();
  });

  // 9. Handles empty vocabs array gracefully
  test("9. Handles empty vocabs array gracefully", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Appending empty vocabs array
    act(() => {
      result.current.APPEND_vocabsToPagination({
        vocabs: [],
        unpaginated_COUNT: 0,
      });
    });

    expect(result?.current?.reducer_STATE?.data?.vocabs).toEqual([]);
    expect(result?.current?.reducer_STATE?.data?.unpaginated_COUNT).toBe(0);
  });

  test("10. Does not trigger error log when there is no error", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Check that SEND_internalError is not called if there's no error
    expect(SEND_internalError).not.toHaveBeenCalled();
  });
});
