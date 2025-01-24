// import { renderHook, act, waitFor } from "@testing-library/react";
//
//
//

import {
  HANDLE_userErrorInsideFinalCatchBlock,
  HANDLE_keyboardDismiss,
  SEND_internalError,
} from "@/src/utils";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { USE_async } from "./USE_async";

jest.mock("@/src/utils/SEND_internalError", () => jest.fn());
jest.mock("../../utils/HANDLE_keyboardDismiss/HANDLE_keyboardDismiss", () =>
  jest.fn()
);
jest.mock(
  "../../utils/HANDLE_userErrorInsideFinalCatchBlock/HANDLE_userErrorInsideFinalCatchBlock",
  () => jest.fn()
);

describe("USE_async", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("1. Should initialize with correct default states", () => {
    const { result } = renderHook(() =>
      USE_async({
        fn: jest.fn(),
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();
  });

  it("2. Should set loading state when execute is called", async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: "mockData" });

    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    act(() => {
      result.current.execute({});
    });

    // Immediately after calling execute, loading should be true
    expect(result.current.loading).toBe(true);

    // Wait for the loading state to become false after promise resolves
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Ensure that the mock function was called and data is set correctly
    expect(mockFn).toHaveBeenCalled();
    expect(result.current.data).toBe("mockData");
    expect(result.current.error).toBeUndefined();
  });

  it("3. Should call `fn` and set data on success", async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: "mockData" });
    const mockOnSuccess = jest.fn();
    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        onSuccess: mockOnSuccess,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    await act(async () => {
      await result.current.execute({});
    });

    expect(mockFn).toHaveBeenCalled();
    expect(result.current.data).toBe("mockData");
    expect(mockOnSuccess).toHaveBeenCalledWith("mockData");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("4. Should handle API error response and set error state", async () => {
    const mockFn = jest.fn().mockResolvedValue({
      data: null,
      error: { error_TYPE: "api_error", user_MSG: "Mock API Error" },
    });

    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    await act(async () => {
      await result.current.execute({});
    });

    expect(mockFn).toHaveBeenCalled();
    expect(result.current.error).toEqual({
      error_TYPE: "api_error",
      user_MSG: "Mock API Error",
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("5. Should handle unexpected error and call `HANDLE_userErrorInsideFinalCatchBlock`", async () => {
    const mockError = new Error("Unexpected Error");
    const mockFn = jest.fn().mockRejectedValue(mockError);
    (HANDLE_userErrorInsideFinalCatchBlock as jest.Mock).mockReturnValue({
      error_TYPE: "internal_error",
      user_MSG: "Handled Error Message",
    });

    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    await act(async () => {
      await result.current.execute({});
    });

    expect(mockFn).toHaveBeenCalled();
    expect(HANDLE_userErrorInsideFinalCatchBlock).toHaveBeenCalledWith({
      error: mockError,
      internalErrorUser_MSG: "Default Error Message",
      function_NAME: "USE_async --> Test Function",
    });
    expect(result.current.error).toEqual({
      error_TYPE: "internal_error",
      user_MSG: "Handled Error Message",
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("6. Should call `HANDLE_keyboardDismiss` and `HANDLE_internalError` on error", async () => {
    const mockFn = jest.fn().mockResolvedValue({
      data: null,
      error: { error_TYPE: "api_error", user_MSG: "Mock API Error" },
    });

    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    await act(async () => {
      await result.current.execute({});
    });

    expect(HANDLE_keyboardDismiss).toHaveBeenCalledWith("api_error");
    expect(SEND_internalError).toHaveBeenCalledWith({
      error: { error_TYPE: "api_error", user_MSG: "Mock API Error" },
      function_NAME: "Test Function",
    });
  });

  it("7. Should reset errors when `RESET_errors` is called", async () => {
    const mockFn = jest.fn().mockResolvedValue({
      data: null,
      error: { error_TYPE: "api_error", user_MSG: "Mock API Error" },
    });

    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
      })
    );

    await act(async () => {
      await result.current.execute({});
    });

    expect(result.current.error).not.toBeUndefined();

    act(() => {
      result.current.RESET_errors();
    });

    expect(result.current.error).toBeUndefined();
  });

  it("8. Should return nothing if `SHOULD_returnNothing` is true", async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: "mockData" });
    const { result } = renderHook(() =>
      USE_async({
        fn: mockFn,
        defaultErr_MSG: "Default Error Message",
        fn_NAME: "Test Function",
        SHOULD_returnNothing: true,
      })
    );

    // Call execute
    act(() => {
      result.current.execute({});
    });

    // Check that loading, data, and error are cleared
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    // Ensure the function wasn't called since it returns nothing
    expect(mockFn).not.toHaveBeenCalled();
  });
});
