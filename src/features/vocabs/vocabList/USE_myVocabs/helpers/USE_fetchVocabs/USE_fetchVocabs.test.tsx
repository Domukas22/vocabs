import { renderHook, act } from "@testing-library/react-native";
import { USE_fetchVocabs } from "./USE_fetchVocabs";
import { FETCH_vocabs } from "./helpers";
import { USE_abortController } from "@/src/hooks";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { General_ERROR } from "@/src/types/error_TYPES";

// Mock dependencies
jest.mock("./helpers", () => ({
  FETCH_vocabs: jest.fn(),
  GET_AlreadyPrintedVocabIds: jest.fn(() => ({
    alreadyPrintedVocab_IDs: new Set(),
  })),
}));
jest.mock("@/src/hooks", () => ({
  USE_zustand: jest.fn(() => ({
    z_user: { id: "123" },
    z_vocabDisplay_SETTINGS: {
      difficultyFilters: [],
      langFilters: [],
      sortDirection: "asc",
      sorting: "alphabetical",
    },
  })),
  USE_abortController: jest.fn(() => ({
    START_newRequest: jest.fn(() => ({
      signal: { aborted: false },
    })),
  })),
}));
jest.mock("@/src/utils/TRANSFORM_error/TRANSFORM_error", () => ({
  TRANSFORM_error: jest.fn(),
}));

describe("USE_fetchVocabsHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. Fetches vocabs with correct parameters", async () => {
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      vocabs: [],
      unpaginated_COUNT: 0,
    });

    const { result } = renderHook(() =>
      USE_fetchVocabs({
        search: "test",
        reducer: {
          data: { printed_IDS: new Set() },
        } as vocabsReducer_TYPE,
        targetList_ID: "list123",
        fetch_TYPE: "all",
        list_TYPE: "private", // Correct the expected value here as 'private'
      })
    );

    await act(() => result.current.FETCH("loading"));

    expect(FETCH_vocabs).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "test",
        user_id: "123",
        fetch_TYPE: "all",
        list_TYPE: "private", // Correct the expected value here as 'private'
        excludeIds: new Set(),
      })
    );
  });

  it("2. Throws an error when fetch fails", async () => {
    const mockError = new Error("Network error");
    (FETCH_vocabs as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      USE_fetchVocabs({
        search: "error_case",
        reducer: {
          data: { printed_IDS: new Set() },
        } as vocabsReducer_TYPE,
        targetList_ID: "listError",
        fetch_TYPE: "all",
        list_TYPE: "public",
      })
    );

    try {
      await act(() => result.current.FETCH("loading"));
    } catch (error) {
      expect(error).toBeInstanceOf(General_ERROR);
      expect((error as General_ERROR).message).toBe("Network error");
      expect((error as General_ERROR).function_NAME).toBe("USE_fetchVocabs");
    }
  });

  it("3. Ignores aborted requests", async () => {
    // Mock the fetch function to simulate the aborted state
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      data: { vocabs: [], unpaginated_COUNT: 0 },
    });

    // Mock the actual abort controller to simulate aborted request
    const mockAbortController = {
      START_newRequest: jest.fn(() => ({
        signal: { aborted: true },
      })),
    };

    // Mock USE_abortController to return the mock controller
    (USE_abortController as jest.Mock).mockReturnValueOnce(mockAbortController);

    // Set up the hook for the test
    const { result } = renderHook(() =>
      USE_fetchVocabs({
        search: "test_search",
        reducer: {
          data: { printed_IDS: new Set() },
        } as vocabsReducer_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
      })
    );

    const response = await act(() => result.current.FETCH("loading"));

    expect(FETCH_vocabs).toHaveBeenCalledTimes(1);
    expect(response).toBeUndefined();
  });
  it("4. Throws error if returned 'data' object was undefined", async () => {
    // Mock the fetch function to simulate the aborted state
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce(undefined);

    // Set up the hook for the test
    const { result } = renderHook(() =>
      USE_fetchVocabs({
        search: "test_search",
        reducer: {
          data: { printed_IDS: new Set() },
        } as vocabsReducer_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
      })
    );

    try {
      await act(() => result.current.FETCH("loading"));
    } catch (error) {
      expect(error).toBeInstanceOf(General_ERROR);
      expect((error as General_ERROR).message).toBe(
        "FETCH_vocabs returned an undefined 'data' object, although it didn't throw an error"
      );
      expect((error as General_ERROR).function_NAME).toBe("USE_fetchVocabs");
    }
  });

  it("5. Returns valid data", async () => {
    const mockData = {
      vocabs: [{ id: "1", word: "test" }],
      unpaginated_COUNT: 1,
    };
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() =>
      USE_fetchVocabs({
        search: "append_case",
        reducer: {
          data: { printed_IDS: new Set() },
        } as vocabsReducer_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
      })
    );

    const response = await act(() => result.current.FETCH("loading"));

    expect(response).toBe(mockData);
  });
});
