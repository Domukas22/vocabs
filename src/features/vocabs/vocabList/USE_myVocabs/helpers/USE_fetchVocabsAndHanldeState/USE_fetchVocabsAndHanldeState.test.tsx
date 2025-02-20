import { renderHook, act } from "@testing-library/react-native";
import { USE_fetchVocabsAndHanldeState } from "./USE_fetchVocabsAndHanldeState";
import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_RESPONSE_TYPE } from "../../../../../../features_new/vocabs/hooks/fetchVocabs/FETCH_vocabs/types";
import {
  APPEND_manyVocabs_PAYLOAD,
  SET_error_PAYLOAD,
  START_fetch_PAYLOAD,
} from "../USE_myVocabsReducer/Vocab_REDUCER/types";

describe("USE_fetchVocabsAndHanldeState", () => {
  it("1. Hides variables when vocabs are fetched correctly", async () => {
    const mockData = {
      vocabs: [{ id: "1" }],
      unpaginated_COUNT: 1,
    } as FETCH_myVocabs_RESPONSE_TYPE;

    const mockFETCH_vocabs = jest.fn().mockResolvedValue(mockData);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).toHaveBeenCalledWith(mockData);
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("2. Throws an error when fetch returns undefined data", async () => {
    const mockFETCH_vocabs = jest.fn().mockResolvedValue(undefined);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith(
      expect.objectContaining({
        function_NAME: "FETCH_vocabsAndHanldeState",
        message:
          "FETCH_vocabs returned an undefined 'data' object, although it didn't throw an error",
      })
    );
  });

  it("3. Calls error handler when fetch fails", async () => {
    const mockError = new Error("Network error");
    const mockFETCH_vocabs = jest.fn().mockRejectedValue(mockError);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Network error",
      })
    );
  });

  it("4. Handles undefined fetch response gracefully", async () => {
    const mockFETCH_vocabs = jest.fn().mockResolvedValue(undefined);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalled();
  });

  it("5. Handles no data (empty vocabs) correctly", async () => {
    const mockData = {
      vocabs: [],
      unpaginated_COUNT: 0,
    } as FETCH_myVocabs_RESPONSE_TYPE;

    const mockFETCH_vocabs = jest.fn().mockResolvedValue(mockData);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).toHaveBeenCalledWith(mockData);
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("6. Catches error thrown by r_START_fetch", async () => {
    const mockData = {
      vocabs: [{ id: "1" }],
      unpaginated_COUNT: 1,
    } as FETCH_myVocabs_RESPONSE_TYPE;

    const mockFETCH_vocabs = jest.fn().mockResolvedValue(mockData);
    const mockStartFetch = jest.fn().mockImplementation(() => {
      throw new Error("Error in r_START_fetch");
    });
    const mockAppendManyVocabs = jest.fn();
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockFETCH_vocabs).not.toHaveBeenCalled();
    expect(mockAppendManyVocabs).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error in r_START_fetch",
      })
    );
  });

  it("7. Catches error thrown by r_APPEND_manyVocabs", async () => {
    const mockData = {
      vocabs: [{ id: "1" }],
      unpaginated_COUNT: 1,
    } as FETCH_myVocabs_RESPONSE_TYPE;

    const mockFETCH_vocabs = jest.fn().mockResolvedValue(mockData);
    const mockStartFetch = jest.fn();
    const mockAppendManyVocabs = jest.fn().mockImplementation(() => {
      throw new Error("Error in r_APPEND_manyVocabs");
    });
    const mockSetError = jest.fn();

    const { result } = renderHook(() =>
      USE_fetchVocabsAndHanldeState({
        FETCH_vocabs: mockFETCH_vocabs,
        r_START_fetch: mockStartFetch,
        r_APPEND_manyVocabs: mockAppendManyVocabs,
        r_SET_error: mockSetError,
      })
    );

    await act(async () => result.current.FETCH_vocabsAndHanldeState("loading"));

    expect(mockStartFetch).toHaveBeenCalledWith("loading");
    expect(mockFETCH_vocabs).toHaveBeenCalledWith("loading");
    expect(mockAppendManyVocabs).toHaveBeenCalledWith(mockData);
    expect(mockSetError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error in r_APPEND_manyVocabs",
      })
    );
  });
});
