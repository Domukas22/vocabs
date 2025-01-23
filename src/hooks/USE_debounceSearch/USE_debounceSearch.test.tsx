//
//
//

import { renderHook, act } from "@testing-library/react-native";
import { USE_debounceSearch } from "./USE_debounceSearch"; // Adjust the path to where your hook is located

describe("USE_debounceSearch", () => {
  // 1. Initialize with default values
  it("1. Initializes with default values", () => {
    const { result } = renderHook(() => USE_debounceSearch());
    expect(result.current.search).toBe("");
    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 2. Update debouncedSearch after a delay
  it("2. Updates debouncedSearch after a delay", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      result.current.SET_search("test");
    });

    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(true);

    // Wait for the debounce delay to pass (250ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current.debouncedSearch).toBe("test");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 3. Immediate update when search is empty
  it("3. Updates debouncedSearch immediately when search is empty", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      result.current.SET_search("test");
    });

    act(() => {
      jest.advanceTimersByTime(250); // Wait for debounce to happen
    });

    expect(result.current.debouncedSearch).toBe("test");

    act(() => {
      result.current.SET_search("");
    });

    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 4. DebouncedSearch resets correctly when search is cleared
  it("4. Resets debouncedSearch and IS_debouncing when search is cleared", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      result.current.SET_search("test");
    });

    act(() => {
      jest.advanceTimersByTime(250); // Wait for debounce
    });

    expect(result.current.debouncedSearch).toBe("test");
    expect(result.current.IS_debouncing).toBe(false);

    act(() => {
      result.current.SET_search("");
    });

    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 5. Handles multiple rapid search updates and debounces correctly
  it("5. Handles multiple rapid search updates and debounces correctly", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      result.current.SET_search("first");
    });

    act(() => {
      result.current.SET_search("second");
    });
    act(() => {
      result.current.SET_search("third");
    });

    expect(result.current.debouncedSearch).toBe(""); // Should still be empty as debounce happens only after 200ms

    act(() => {
      jest.advanceTimersByTime(250); // Wait for the last debounce to finish
    });

    expect(result.current.debouncedSearch).toBe("third");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 6. Debouncing flag works correctly
  it("6. Sets IS_debouncing flag correctly", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      result.current.SET_search("test");
    });

    expect(result.current.IS_debouncing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(250); // Wait for the debounce to finish
    });

    expect(result.current.IS_debouncing).toBe(false);
  });

  // 7. Handle undefined or null search gracefully
  it("7. Handles undefined or null search gracefully", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      // Simulate undefined search value
      result.current.SET_search(undefined as any);
    });

    expect(result.current.search).toBe(""); // Should default to empty string
    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);

    act(() => {
      // Simulate null search value
      result.current.SET_search(null as any);
    });

    expect(result.current.search).toBe(""); // Should default to empty string
    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);
  });

  // 8. Handle non-string input gracefully
  it("8. Handles non-string input gracefully", () => {
    const { result } = renderHook(() => USE_debounceSearch());

    act(() => {
      // Simulate non-string input like a number
      result.current.SET_search(123 as any);
    });

    expect(result.current.search).toBe(""); // Should handle invalid input and default to empty string
    expect(result.current.debouncedSearch).toBe("");
    expect(result.current.IS_debouncing).toBe(false);
  });
});
