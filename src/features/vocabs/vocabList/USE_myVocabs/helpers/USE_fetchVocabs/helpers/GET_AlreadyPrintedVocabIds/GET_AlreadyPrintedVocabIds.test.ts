import { renderHook, act, waitFor } from "@testing-library/react-native";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { vocabsReducer_TYPE } from "../../../USE_myVocabsReducer/Vocab_REDUCER/types";
import { GET_AlreadyPrintedVocabIds } from "./GET_AlreadyPrintedVocabIds";

describe("GET_AlreadyPrintedVocabIds", () => {
  let mockReducerState: vocabsReducer_TYPE;

  beforeEach(() => {
    mockReducerState = {
      data: {
        printed_IDS: new Set(["vocab1", "vocab2", "vocab3"]),
      },
    } as vocabsReducer_TYPE;
  });

  it("1. Returns an empty Set when loadingState_TYPE is not 'loading_more'", async () => {
    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("2. Returns printed_IDS from reducer state when loadingState_TYPE is 'loading_more'", async () => {
    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(
      new Set(["vocab1", "vocab2", "vocab3"])
    );
  });

  it("3. Handles undefined printed_IDS gracefully", async () => {
    mockReducerState = {
      data: {},
    } as vocabsReducer_TYPE;

    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("4. Handles null data gracefully in the reducer state", async () => {
    mockReducerState = {
      data: null,
    } as unknown as vocabsReducer_TYPE;

    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("5. Handles an empty reducer state gracefully", async () => {
    mockReducerState = {} as vocabsReducer_TYPE;

    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("6. Returns an empty Set when 'loadingState_TYPE' is 'error'", async () => {
    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("error", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("7. Returns an empty Set when the reducer state is undefined", async () => {
    mockReducerState = undefined as any;

    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs).toEqual(new Set());
  });

  it("8. Throws an error when called with invalid loadingState_TYPE", async () => {
    try {
      const { result } = renderHook(() =>
        GET_AlreadyPrintedVocabIds(
          "invalid_type" as loadingState_TYPES,
          mockReducerState
        )
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("9. Correctly handles edge cases with a very large set of printed IDs", async () => {
    mockReducerState = {
      data: {
        printed_IDS: new Set(
          Array(1000)
            .fill("vocab")
            .map((vocab, index) => `${vocab}${index}`)
        ),
      },
    } as vocabsReducer_TYPE;

    const { result } = renderHook(() =>
      GET_AlreadyPrintedVocabIds("loading_more", mockReducerState)
    );

    expect(result.current.alreadyPrintedVocab_IDs.size).toBe(1000);
  });
});
