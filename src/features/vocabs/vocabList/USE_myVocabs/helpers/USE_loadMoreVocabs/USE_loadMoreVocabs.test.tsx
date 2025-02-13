//
//
//

import { renderHook, act } from "@testing-library/react-native";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import { USE_loadMoreVocabs } from "./USE_loadMoreVocabs";

describe("USE_loadMoreVocabs", () => {
  let mockState: vocabsReducer_TYPE;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockState = {
      loading_STATE: "none",
    };
    mockFetch = jest.fn();
  });

  it("1. Calls FETCH_vocabsAndHanldeState with 'loading_more' when loading_STATE is 'none'", async () => {
    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).toHaveBeenCalledWith("loading_more");
  });

  it("2. Does not call FETCH_vocabsAndHanldeState when loading_STATE is not 'none'", async () => {
    mockState.loading_STATE = "loading_more";

    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("3. Handles undefined loading_STATE gracefully", async () => {
    mockState = {} as vocabsReducer_TYPE;

    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("4. Does not call FETCH_vocabsAndHanldeState when reducer is missing", async () => {
    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: undefined as any,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("5. Calls FETCH_vocabsAndHanldeState when loading_STATE is exactly 'none'", async () => {
    mockState.loading_STATE = "none";

    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).toHaveBeenCalledWith("loading_more");
  });

  it("6. Handles invalid or unexpected loading_STATE gracefully", async () => {
    mockState.loading_STATE = "invalid_state" as any;

    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    // Expect that FETCH_vocabsAndHanldeState was not called since the state is invalid
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("7. Calls FETCH_vocabsAndHanldeState after multiple valid invocations with correct state transitions", async () => {
    mockState.loading_STATE = "none";

    const { result } = renderHook(() =>
      USE_loadMoreVocabs({
        reducer: mockState,
        FETCH_vocabsAndHanldeState: mockFetch,
      })
    );

    // Call multiple times
    await act(async () => {
      result.current.LOAD_moreVocabs();
      result.current.LOAD_moreVocabs();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith("loading_more");
  });

  it("8. Handles an asynchronous state change correctly", async () => {
    mockState.loading_STATE = "none";

    const { result, rerender } = renderHook(
      ({ state }) =>
        USE_loadMoreVocabs({
          reducer: state,
          FETCH_vocabsAndHanldeState: mockFetch,
        }),
      { initialProps: { state: mockState } }
    );

    // Trigger the first call
    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    // Change the state to simulate a transition
    mockState = { loading_STATE: "loading_more" };
    rerender({ state: mockState });

    // Call again
    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    // Expect that the first call was made and the second one was not
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
