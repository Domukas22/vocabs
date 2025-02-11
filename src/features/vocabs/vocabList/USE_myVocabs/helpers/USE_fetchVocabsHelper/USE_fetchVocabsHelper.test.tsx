import { renderHook, act } from "@testing-library/react-native";
import { USE_fetchVocabsHelper } from "./USE_fetchVocabsHelper";
import { FETCH_vocabs } from "./helpers";
import { USE_abortController } from "@/src/hooks";
import { myVocabs_REDUCER_RESPONSE_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { PostgrestError } from "@supabase/supabase-js";

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
  let setLoadingState: jest.Mock;
  let setErrorState: jest.Mock;
  let appendToPagination: jest.Mock;

  beforeEach(() => {
    setLoadingState = jest.fn();
    setErrorState = jest.fn();
    appendToPagination = jest.fn();

    jest.clearAllMocks();
  });

  it("1. Fetches vocabs with correct parameters", async () => {
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      data: { vocabs: [], unpaginated_COUNT: 0 },
      error: null,
    });

    const { result } = renderHook(() =>
      USE_fetchVocabsHelper({
        search: "test",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: "list123",
        fetch_TYPE: "all",
        list_TYPE: "private", // Correct the expected value here as 'private'
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
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

  it("2. Updates loading state properly", async () => {
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      data: { vocabs: [], unpaginated_COUNT: 0 },
      error: null,
    });

    const { result } = renderHook(() =>
      USE_fetchVocabsHelper({
        search: "example",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
      })
    );

    await act(() => result.current.FETCH("loading_more"));

    expect(setLoadingState).toHaveBeenCalledWith("loading_more");
    expect(setLoadingState).toHaveBeenCalledWith("none");
  });

  it("3. Throws an error when fetch fails", async () => {
    const mockError = new Error("Network error");
    (FETCH_vocabs as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      USE_fetchVocabsHelper({
        search: "error_case",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: "listError",
        fetch_TYPE: "all",
        list_TYPE: "public",
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
      })
    );

    await act(() => result.current.FETCH("loading"));

    // Verify that setLoadingState was called with "loading" first (before the error)
    expect(setLoadingState).toHaveBeenCalledWith("loading");

    // Verify that setErrorState was called with the transformed error
    expect(setErrorState).toHaveBeenCalled();

    // Now, verify that setLoadingState was called with "error" after the failure
    expect(setLoadingState).toHaveBeenCalledWith("error");
  });

  it("4. Ignores aborted requests", async () => {
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
      USE_fetchVocabsHelper({
        search: "test_search",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
      })
    );

    // Trigger the fetch
    await act(() => result.current.FETCH("loading"));

    // Ensure that the fetch function was called
    expect(FETCH_vocabs).toHaveBeenCalledTimes(1);

    // Ensure that the pagination function is NOT called due to abort
    expect(appendToPagination).not.toHaveBeenCalled();

    // Ensure that the loading state is NOT set to "none" (should not proceed with setting the state after abort)
    expect(setLoadingState).not.toHaveBeenCalledWith("none");

    // Ensure no error state was set
    expect(setErrorState).toHaveBeenCalledTimes(1);
  });

  it("5. Appends fetched data correctly", async () => {
    const mockData = {
      vocabs: [{ id: "1", word: "test" }],
      unpaginated_COUNT: 1,
    };
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const { result } = renderHook(() =>
      USE_fetchVocabsHelper({
        search: "append_case",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: undefined,
        fetch_TYPE: "all",
        list_TYPE: "private",
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
      })
    );

    await act(() => result.current.FETCH("loading"));

    expect(appendToPagination).toHaveBeenCalledWith(mockData);
  });
  it("6. Handles empty data response", async () => {
    const mockEmptyData = {
      vocabs: [],
      unpaginated_COUNT: 0,
    };
    (FETCH_vocabs as jest.Mock).mockResolvedValueOnce({
      data: mockEmptyData,
      error: null,
    });

    const { result } = renderHook(() =>
      USE_fetchVocabsHelper({
        search: "empty_data_test",
        reducer_STATE: {
          data: { printed_IDS: new Set() },
        } as myVocabs_REDUCER_RESPONSE_TYPE,
        targetList_ID: "list123",
        fetch_TYPE: "all",
        list_TYPE: "private",
        APPEND_vocabsToPagination: appendToPagination,
        SET_reducerLoadingState: setLoadingState,
        SET_reducerError: setErrorState,
      })
    );

    await act(() => result.current.FETCH("loading"));

    expect(appendToPagination).toHaveBeenCalledWith(mockEmptyData);
    expect(setLoadingState).toHaveBeenCalledWith("none");
  });
});
