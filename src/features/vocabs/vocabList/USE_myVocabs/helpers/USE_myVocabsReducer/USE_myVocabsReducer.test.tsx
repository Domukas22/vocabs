//
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { USE_myVocabsReducer } from "./USE_myVocabsReducer";

// Mock `SEND_internalError`
jest.mock("@/src/utils", () => ({
  SEND_internalError: jest.fn(),
}));

import { SEND_internalError } from "@/src/utils";
import { General_ERROR } from "@/src/types/error_TYPES";

describe("USE_myVocabsReducer", () => {
  test("1. Returns reducer and helper functions", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Ensure that the required functions are returned
    expect(result.current).toHaveProperty("reducer");
    expect(result.current).toHaveProperty("r_PREPEND_oneVocab");
    expect(result.current).toHaveProperty("r_UPDATE_oneVocab");
    expect(result.current).toHaveProperty("r_DELETE_oneVocab");
    expect(result.current).toHaveProperty("r_START_fetch");
    expect(result.current).toHaveProperty("r_APPEND_manyVocabs");
    expect(result.current).toHaveProperty("r_SET_error");
  });

  test("2. Logs error when reducer state has an error", async () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Simulate an error state in the reducer
    act(() => {
      result.current.r_SET_error({
        message: "Critical error",
      } as General_ERROR);
    });

    // Wait for the effect to run and check if the error handler was called
    await waitFor(() => {
      expect(SEND_internalError).toHaveBeenCalledWith({
        message: "Critical error",
      });
    });
  });

  test("3. Returns the reducer state correctly", () => {
    const { result } = renderHook(() => USE_myVocabsReducer());

    // Ensure the reducer state is returned correctly
    expect(result.current.reducer).toBeTruthy();
  });
});
