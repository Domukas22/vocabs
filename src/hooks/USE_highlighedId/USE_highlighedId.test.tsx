//
//
//
import { renderHook, act } from "@testing-library/react-native";
import { USE_highlighedId } from "./USE_highlighedId"; // Adjust the path to where your hook is located

describe("USE_highlighedId", () => {
  // 1. Initialize with default values (highlighted_ID should be undefined)
  it("1. Initializes with highlighted_ID as undefined", () => {
    const { result } = renderHook(() => USE_highlighedId());
    expect(result.current.highlighted_ID).toBeUndefined();
  });

  // 2. Highlight an ID and check if highlighted_ID is set correctly
  it("2. Highlights an ID when highlight is called", () => {
    const { result } = renderHook(() => USE_highlighedId());
    act(() => {
      result.current.highlight("123"); // Call highlight with an ID
    });
    expect(result.current.highlighted_ID).toBe("123");
  });

  // 3. Check if highlighted_ID is reset after the default timeout (5000 ms)
  it("3. Resets highlighted_ID after the duration", async () => {
    jest.useFakeTimers(); // Mock timers to speed up setTimeout
    const { result } = renderHook(() => USE_highlighedId(5000));

    act(() => {
      result.current.highlight("123");
    });

    expect(result.current.highlighted_ID).toBe("123");

    // Fast-forward time to simulate the duration
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.highlighted_ID).toBeUndefined();
    jest.useRealTimers(); // Restore real timers
  });

  // 4. Test if highlight function does not work if already locked
  it("4. Does not allow highlighting when locked", () => {
    const { result } = renderHook(() => USE_highlighedId());

    // Trigger highlight first time
    act(() => {
      result.current.highlight("123");
    });

    // Try highlighting again while locked
    act(() => {
      result.current.highlight("456");
    });

    // Check if the second highlight is ignored
    expect(result.current.highlighted_ID).toBe("123");
  });

  // 5. Test custom duration for highlight
  it("5. Highlights with custom duration", async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => USE_highlighedId(2000));

    act(() => {
      result.current.highlight("123");
    });

    expect(result.current.highlighted_ID).toBe("123");

    // Fast-forward time by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.highlighted_ID).toBeUndefined();
    jest.useRealTimers();
  });

  // 6. Handle edge case of empty string as ID
  it("6. Handles empty string as ID", () => {
    const { result } = renderHook(() => USE_highlighedId());
    act(() => {
      result.current.highlight(""); // Empty string as ID
    });
    expect(result.current.highlighted_ID).toBe("");
  });

  // 7. Handle edge case of undefined ID
  it("7. Handles undefined ID gracefully", () => {
    const { result } = renderHook(() => USE_highlighedId());
    act(() => {
      result.current.highlight(undefined); // Undefined ID
    });
    expect(result.current.highlighted_ID).toBeUndefined();
  });

  // 8. Test for a zero duration (should immediately reset)
  it("8. Highlights and resets immediately with a 0 duration", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => USE_highlighedId(0));

    act(() => {
      result.current.highlight("123");
    });

    expect(result.current.highlighted_ID).toBe("123");

    // Fast-forward time by 0 ms (should reset immediately)
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.highlighted_ID).toBeUndefined();
  });
});
