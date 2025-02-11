import { renderHook, act, waitFor } from "@testing-library/react-native";
import { loadingState_TYPES } from "@/src/types";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { USE_refetchVocabs } from "./USE_refetchVocabs";
import { USE_zustand } from "@/src/hooks";

jest.mock("@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState");
jest.mock("@/src/hooks", () => ({
  USE_zustand: jest.fn(),
}));

const mockRESET_reducerState = jest.fn();
const mockFETCH = jest.fn();
const mockUSE_zustand = USE_zustand as unknown as jest.Mock;

describe("USE_refetchVocabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. Calls RESET_reducerState and FETCH with the correct loading state on initial render", async () => {
    const mockDetermineLoadingState = DETERMINE_loadingState as jest.Mock;
    mockDetermineLoadingState.mockReturnValue("loading" as loadingState_TYPES);

    // Mocking USE_zustand hook values
    mockUSE_zustand.mockReturnValue({
      z_vocabDisplay_SETTINGS: {
        difficultyFilters: [],
        langFilters: [],
        sortDirection: "asc",
        sorting: "alphabetical",
      },
    });

    const { result } = renderHook(() =>
      USE_refetchVocabs({
        search: "test",
        targetList_ID: "123",
        RESET_reducerState: mockRESET_reducerState,
        FETCH: mockFETCH,
      })
    );

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1);
      expect(mockFETCH).toHaveBeenCalledWith("loading");
    });
  });

  it("2. Handles undefined values correctly and does not call FETCH when undefined values are passed", async () => {
    const mockDetermineLoadingState = DETERMINE_loadingState as jest.Mock;
    mockDetermineLoadingState.mockReturnValue("loading" as loadingState_TYPES);

    // Mocking undefined values for certain props
    mockUSE_zustand.mockReturnValue({
      z_vocabDisplay_SETTINGS: {
        difficultyFilters: undefined,
        langFilters: undefined,
        sortDirection: undefined,
        sorting: undefined,
      },
    });

    renderHook(() =>
      USE_refetchVocabs({
        search: undefined as unknown as string, // undefined search
        targetList_ID: undefined, // undefined targetList_ID
        RESET_reducerState: mockRESET_reducerState,
        FETCH: mockFETCH,
      })
    );

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1);
      expect(mockFETCH).toHaveBeenCalledWith("loading");
    });
  });

  it("3. Calls FETCH with the correct state when search changes", async () => {
    const mockDetermineLoadingState = DETERMINE_loadingState as jest.Mock;
    mockDetermineLoadingState.mockReturnValue("loading" as loadingState_TYPES);

    mockUSE_zustand.mockReturnValue({
      z_vocabDisplay_SETTINGS: {
        difficultyFilters: [],
        langFilters: [],
        sortDirection: "asc",
        sorting: "alphabetical",
      },
    });

    const { rerender } = renderHook(
      ({ search }) =>
        USE_refetchVocabs({
          search,
          targetList_ID: "123",
          RESET_reducerState: mockRESET_reducerState,
          FETCH: mockFETCH,
        }),
      {
        initialProps: { search: "initial" },
      }
    );

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1);
      expect(mockFETCH).toHaveBeenCalledWith("loading");
    });

    // Simulate search change
    rerender({ search: "new search" });

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(2); // should be called again
      expect(mockFETCH).toHaveBeenCalledWith("loading"); // should fetch again with the new state
    });
  });

  it("4. Handles missing FETCH function gracefully", async () => {
    const { result } = renderHook(() =>
      USE_refetchVocabs({
        search: "test",
        targetList_ID: "123",
        RESET_reducerState: mockRESET_reducerState,
        FETCH: undefined as any, // Passing undefined to FETCH
      })
    );

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1);
      expect(mockFETCH).not.toHaveBeenCalled(); // FETCH should not be called if undefined
    });
  });

  it("5. Calls FETCH only once if no relevant props change", async () => {
    const mockDetermineLoadingState = DETERMINE_loadingState as jest.Mock;
    mockDetermineLoadingState.mockReturnValue("loading" as loadingState_TYPES);

    mockUSE_zustand.mockReturnValue({
      z_vocabDisplay_SETTINGS: {
        difficultyFilters: [],
        langFilters: [],
        sortDirection: "asc",
        sorting: "alphabetical",
      },
    });

    const { rerender } = renderHook(() =>
      USE_refetchVocabs({
        search: "test",
        targetList_ID: "123",
        RESET_reducerState: mockRESET_reducerState,
        FETCH: mockFETCH,
      })
    );

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1);
      expect(mockFETCH).toHaveBeenCalledWith("loading");
    });

    // Simulate re-render with the same props
    rerender({});

    await waitFor(() => {
      expect(mockRESET_reducerState).toHaveBeenCalledTimes(1); // Should not call again
      expect(mockFETCH).toHaveBeenCalledTimes(1); // Should not call again
    });
  });
});
