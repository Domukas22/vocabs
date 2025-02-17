//
//
//

import { renderHook, waitFor } from "@testing-library/react-native";
import { USE_myVocabs } from "./USE_myVocabs";
import {
  USE_myVocabsReducer,
  USE_refetchVocabs,
  USE_vocabReducerActions,
} from "./helpers";
import React, { useEffect } from "react";

jest.mock("./helpers", () => ({
  USE_myVocabsReducer: jest.fn(),
  USE_vocabReducerActions: jest.fn(),
  USE_refetchVocabs: jest.fn(),
}));

describe("USE_myVocabs", () => {
  it("1. Returns correct values on initial render", () => {
    // Setup mock return values for the child functions
    const mockReducer = {
      data: {
        vocabs: ["vocab1", "vocab2"],
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      error: null,
      z_myVocabsLoading_STATE: "loading",
    };
    const mockLOAD_moreVocabs = jest.fn();
    const mockPREPEND_oneVocab = jest.fn();
    const mockDELETE_oneVocab = jest.fn();
    const mockUPDATE_oneVocab = jest.fn();

    (USE_myVocabsReducer as jest.Mock).mockReturnValueOnce({
      reducer: mockReducer,
      r_PREPEND_oneVocab: mockPREPEND_oneVocab,
      r_DELETE_oneVocab: mockDELETE_oneVocab,
      r_START_fetch: jest.fn(),
      r_APPEND_manyVocabs: jest.fn(),
      r_UPDATE_oneVocab: mockUPDATE_oneVocab,
      r_SET_error: jest.fn(),
    });

    (USE_vocabReducerActions as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mockLOAD_moreVocabs,
      REFETCH_vocabs: jest.fn(),
    });

    const { result } = renderHook(() =>
      USE_myVocabs({
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
      })
    );

    // Assert initial state of the hook
    expect(result.current.vocabs).toEqual(["vocab1", "vocab2"]);
    expect(result.current.vocabs_ERROR).toBeNull();
    expect(result.current.z_myVocabsLoading_STATE).toBe("loading");
    expect(result.current.unpaginated_COUNT).toBe(2);
    expect(result.current.HAS_reachedEnd).toBe(false);
    expect(result.current.LOAD_moreVocabs).toBe(mockLOAD_moreVocabs);
    expect(result.current.r_PREPEND_oneVocab).toBe(mockPREPEND_oneVocab);
    expect(result.current.r_DELETE_oneVocab).toBe(mockDELETE_oneVocab);
    expect(result.current.r_UPDATE_oneVocab).toBe(mockUPDATE_oneVocab);
  });

  it("2. Calls refetch when search changes", () => {
    const mockRefetch = jest.fn();

    // Mock the return value for USE_vocabReducerActions
    (USE_vocabReducerActions as jest.Mock).mockReturnValue({
      LOAD_moreVocabs: jest.fn(),
      REFETCH_vocabs: mockRefetch,
    });

    // Mock the return value for USE_myVocabsReducer
    const mockReducer = {
      data: {
        vocabs: ["vocab1", "vocab2"],
        unpaginated_COUNT: 2,
        HAS_reachedEnd: false,
      },
      error: null,
      z_myVocabsLoading_STATE: "loading",
    };

    (USE_myVocabsReducer as jest.Mock).mockReturnValue({
      reducer: mockReducer,
      r_PREPEND_oneVocab: jest.fn(),
      r_DELETE_oneVocab: jest.fn(),
      r_START_fetch: jest.fn(),
      r_APPEND_manyVocabs: jest.fn(),
      r_UPDATE_oneVocab: jest.fn(),
      r_SET_error: jest.fn(),
    });

    // Mock USE_refetchVocabs to simulate the hook's useEffect behavior
    (USE_refetchVocabs as jest.Mock).mockImplementation(
      ({ search, targetList_ID, REFETCH_vocabs }) => {
        useEffect(() => {
          if (search) {
            REFETCH_vocabs(); // Simulate the refetch when search changes
          }
        }, [search, targetList_ID, REFETCH_vocabs]); // Trigger effect on search change
      }
    );

    const { rerender } = renderHook(
      ({ search }) =>
        USE_myVocabs({
          list_TYPE: "private",
          fetch_TYPE: "all",
          search,
          targetList_ID: "123",
        }),
      {
        initialProps: { search: "test" },
      }
    );

    // Expect the refetch function to be called on initial render
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    // Trigger re-render with a new search value
    rerender({ search: "newSearch" });

    // Check that refetch was called again after the search change
    expect(mockRefetch).toHaveBeenCalledTimes(2);
  });

  it("3. Handles undefined values gracefully", () => {
    const mockReducer = {
      data: undefined,
      error: undefined,
      z_myVocabsLoading_STATE: undefined,
    };

    (USE_myVocabsReducer as jest.Mock).mockReturnValueOnce({
      reducer: mockReducer,
      r_PREPEND_oneVocab: jest.fn(),
      r_DELETE_oneVocab: jest.fn(),
      r_START_fetch: jest.fn(),
      r_APPEND_manyVocabs: jest.fn(),
      r_UPDATE_oneVocab: jest.fn(),
      r_SET_error: jest.fn(),
    });

    const { result } = renderHook(() =>
      USE_myVocabs({
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
      })
    );

    expect(result.current.vocabs).toBeUndefined();
    expect(result.current.vocabs_ERROR).toBeUndefined();
    expect(result.current.z_myVocabsLoading_STATE).toBeUndefined();
    expect(result.current.unpaginated_COUNT).toBeUndefined();
    expect(result.current.HAS_reachedEnd).toBeUndefined();
  });
});
