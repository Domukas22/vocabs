import { renderHook, act, waitFor } from "@testing-library/react-native";
import { USE_vocabReducerActions } from "./USE_vocabReducerActions";
import { USE_fetchVocabs } from "../USE_fetchVocabs/USE_fetchVocabs";
import { USE_fetchVocabsAndHanldeState } from "../USE_fetchVocabsAndHanldeState/USE_fetchVocabsAndHanldeState";
import { USE_loadMoreVocabs } from "../USE_loadMoreVocabs/USE_loadMoreVocabs";
import { vocabsReducer_TYPE } from "../USE_myVocabsReducer/Vocab_REDUCER/types";
import {
  vocabFetch_TYPES,
  list_TYPES,
} from "../USE_fetchVocabs/helpers/FETCH_vocabs/types";

jest.mock("../USE_fetchVocabs/USE_fetchVocabs", () => ({
  USE_fetchVocabs: jest.fn(),
}));

jest.mock(
  "../USE_fetchVocabsAndHanldeState/USE_fetchVocabsAndHanldeState",
  () => ({
    USE_fetchVocabsAndHanldeState: jest.fn(),
  })
);

jest.mock("../USE_loadMoreVocabs/USE_loadMoreVocabs", () => ({
  USE_loadMoreVocabs: jest.fn(),
}));

const mock_START_fetch = jest.fn();
const mock_APPEND_manyVocabs = jest.fn();
const mock_SET_error = jest.fn();

describe("USE_vocabReducerActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1. Returns correct functions on initial render", async () => {
    const mock_FETCH_vocabs = jest.fn();
    const mock_FETCH_vocabsAndHanldeState = jest.fn();
    const mock_LOAD_moreVocabs = jest.fn();

    (USE_fetchVocabs as jest.Mock).mockReturnValueOnce({
      FETCH: mock_FETCH_vocabs,
    });
    (USE_fetchVocabsAndHanldeState as jest.Mock).mockReturnValueOnce({
      FETCH_vocabsAndHanldeState: mock_FETCH_vocabsAndHanldeState,
    });
    (USE_loadMoreVocabs as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mock_LOAD_moreVocabs,
    });

    const { result } = renderHook(() =>
      USE_vocabReducerActions({
        reducer: "someReducer" as unknown as vocabsReducer_TYPE,
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
        r_START_fetch: mock_START_fetch,
        r_APPEND_manyVocabs: mock_APPEND_manyVocabs,
        r_SET_error: mock_SET_error,
      })
    );

    expect(result.current.LOAD_moreVocabs).toBe(mock_LOAD_moreVocabs);
    expect(result.current.REFETCH_vocabs).toBe(mock_FETCH_vocabsAndHanldeState);
  });

  it("2. Handles undefined or incorrect values gracefully", async () => {
    const mock_FETCH_vocabs = jest.fn();
    const mock_FETCH_vocabsAndHanldeState = jest.fn();
    const mock_LOAD_moreVocabs = jest.fn();

    (USE_fetchVocabs as jest.Mock).mockReturnValueOnce({
      FETCH: mock_FETCH_vocabs,
    });
    (USE_fetchVocabsAndHanldeState as jest.Mock).mockReturnValueOnce({
      FETCH_vocabsAndHanldeState: mock_FETCH_vocabsAndHanldeState,
    });
    (USE_loadMoreVocabs as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mock_LOAD_moreVocabs,
    });

    const { result } = renderHook(() =>
      USE_vocabReducerActions({
        reducer: undefined as unknown as vocabsReducer_TYPE,
        list_TYPE: undefined as unknown as list_TYPES,
        fetch_TYPE: undefined as unknown as vocabFetch_TYPES,
        search: undefined as unknown as string,
        targetList_ID: undefined,
        r_START_fetch: mock_START_fetch,
        r_APPEND_manyVocabs: mock_APPEND_manyVocabs,
        r_SET_error: mock_SET_error,
      })
    );

    expect(result.current.LOAD_moreVocabs).toBe(mock_LOAD_moreVocabs);
    expect(result.current.REFETCH_vocabs).toBe(mock_FETCH_vocabsAndHanldeState);
  });

  it("3. Handles missing arguments gracefully", async () => {
    const mock_FETCH_vocabs = jest.fn();
    const mock_FETCH_vocabsAndHanldeState = jest.fn();
    const mock_LOAD_moreVocabs = jest.fn();

    (USE_fetchVocabs as jest.Mock).mockReturnValueOnce({
      FETCH: mock_FETCH_vocabs,
    });
    (USE_fetchVocabsAndHanldeState as jest.Mock).mockReturnValueOnce({
      FETCH_vocabsAndHanldeState: mock_FETCH_vocabsAndHanldeState,
    });
    (USE_loadMoreVocabs as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mock_LOAD_moreVocabs,
    });
    const { result } = renderHook(() =>
      USE_vocabReducerActions({
        reducer: "someReducer" as any,
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
        r_START_fetch: undefined as any,
        r_APPEND_manyVocabs: undefined as any,
        r_SET_error: mock_SET_error,
      })
    );

    expect(result.current.LOAD_moreVocabs).toBeDefined();
    expect(result.current.REFETCH_vocabs).toBeDefined();
  });

  it("4. Calls LOAD_moreVocabs only when necessary", async () => {
    const mock_FETCH_vocabs = jest.fn();
    const mock_FETCH_vocabsAndHanldeState = jest.fn();
    const mock_LOAD_moreVocabs = jest.fn();

    (USE_fetchVocabs as jest.Mock).mockReturnValueOnce({
      FETCH: mock_FETCH_vocabs,
    });
    (USE_fetchVocabsAndHanldeState as jest.Mock).mockReturnValueOnce({
      FETCH_vocabsAndHanldeState: mock_FETCH_vocabsAndHanldeState,
    });
    (USE_loadMoreVocabs as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mock_LOAD_moreVocabs,
    });

    const { result } = renderHook(() =>
      USE_vocabReducerActions({
        reducer: "someReducer" as any,
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
        r_START_fetch: mock_START_fetch,
        r_APPEND_manyVocabs: mock_APPEND_manyVocabs,
        r_SET_error: mock_SET_error,
      })
    );

    await act(async () => {
      result.current.LOAD_moreVocabs();
    });

    expect(mock_LOAD_moreVocabs).toHaveBeenCalledTimes(1);
  });
  it("5. Calls REFETCH_vocabs only when necessary", async () => {
    const mock_FETCH_vocabs = jest.fn();
    const mock_FETCH_vocabsAndHanldeState = jest.fn();
    const mock_LOAD_moreVocabs = jest.fn();

    (USE_fetchVocabs as jest.Mock).mockReturnValueOnce({
      FETCH: mock_FETCH_vocabs,
    });
    (USE_fetchVocabsAndHanldeState as jest.Mock).mockReturnValueOnce({
      FETCH_vocabsAndHanldeState: mock_FETCH_vocabsAndHanldeState,
    });
    (USE_loadMoreVocabs as jest.Mock).mockReturnValueOnce({
      LOAD_moreVocabs: mock_LOAD_moreVocabs,
    });

    const { result } = renderHook(() =>
      USE_vocabReducerActions({
        reducer: "someReducer" as any,
        list_TYPE: "private",
        fetch_TYPE: "all",
        search: "test",
        targetList_ID: "123",
        r_START_fetch: mock_START_fetch,
        r_APPEND_manyVocabs: mock_APPEND_manyVocabs,
        r_SET_error: mock_SET_error,
      })
    );

    await act(async () => {
      result.current.REFETCH_vocabs("loading");
    });

    expect(mock_FETCH_vocabsAndHanldeState).toHaveBeenCalledTimes(1);
  });
});
