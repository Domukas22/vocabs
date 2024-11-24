//
//
//
import { renderHook, act } from "@testing-library/react";

import USE_async from "./USE_async";
import HANDLE_internalError from "../../utils/SEND_internalError";
import HANDLE_keyboardDismiss from "../../utils/HANDLE_keyboardDismiss/HANDLE_keyboardDismiss";
import HANDLE_userError from "../../utils/HANDLE_userError/HANDLE_userError";
import { waitFor } from "@testing-library/react-native";

jest.mock("../../utils/SEND_internalError", () => jest.fn());
jest.mock("../../utils/HANDLE_keyboardDismiss/HANDLE_keyboardDismiss", () =>
  jest.fn()
);
jest.mock("../../utils/HANDLE_userError/HANDLE_userError", () => jest.fn());

// 1. Should initialize with correct default states
// 2. Should set loading state when execute is called
// 3. Should call `fn` and set data on success
// 4. Should handle API error response and set error state
// 5. Should handle unexpected error and call `HANDLE_userError`
// 6. Should call `HANDLE_keyboardDismiss` and `HANDLE_internalError` on error
// 7. Should reset errors when `RESET_errors` is called

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

    // Call execute
    act(() => {
      result.current.execute({});
    });

    // Ensure loading state is true immediately after execution starts
    expect(result.current.loading).toBe(true);

    // Wait for the loading state to become false after promise resolves
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert that the mock function was called and data is set correctly
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

  it("5. Should handle unexpected error and call `HANDLE_userError`", async () => {
    const mockError = new Error("Unexpected Error");
    const mockFn = jest.fn().mockRejectedValue(mockError);
    (HANDLE_userError as jest.Mock).mockReturnValue({
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
    expect(HANDLE_userError).toHaveBeenCalledWith({
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
    expect(HANDLE_internalError).toHaveBeenCalledWith({
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
});
