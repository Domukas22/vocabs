//
//
// 🔴🔴 OUTDATED 🔴🔴

import { renderHook } from "@testing-library/react-native";
import { USE_getActiveFilterCount } from "./USE_getActiveFilterCount"; // Adjust the path as needed
import {
  z_listDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";

describe("USE_getActiveFilterCount", () => {
  test("should return 0 when no filters are provided", () => {
    const { result } = renderHook(() => USE_getActiveFilterCount(undefined));

    expect(result.current).toBe(0);
  });

  test("should return correct count for langFilters only", () => {
    const displaySettings = {
      langFilters: ["en", "de"],
    } as z_listDisplaySettings_PROPS;

    const { result } = renderHook(() =>
      USE_getActiveFilterCount(displaySettings)
    );

    expect(result.current).toBe(2); // Two language filters
  });

  test("should return correct count for difficultyFilters only", () => {
    const displaySettings = {
      difficultyFilters: [1, 2],
      langFilters: [],
    } as unknown as z_vocabDisplaySettings_PROPS;

    const { result } = renderHook(() =>
      USE_getActiveFilterCount(displaySettings)
    );

    expect(result.current).toBe(2); // Two difficulty filters
  });

  test("should return correct count for both langFilters and difficultyFilters", () => {
    const displaySettings = {
      difficultyFilters: [1, 2],
      langFilters: ["en", "fr"],
    } as z_vocabDisplaySettings_PROPS;

    const { result } = renderHook(() =>
      USE_getActiveFilterCount(displaySettings)
    );

    expect(result.current).toBe(4); // Two language filters + two difficulty filters
  });

  test("should return 0 when difficultyFilters is not present", () => {
    const displaySettings = {
      langFilters: ["en", "de"],
    } as z_listDisplaySettings_PROPS;

    const { result } = renderHook(() =>
      USE_getActiveFilterCount(displaySettings)
    );

    expect(result.current).toBe(2); // Only language filters, no difficulty filters
  });

  test("should handle missing langFilters gracefully", () => {
    const displaySettings: z_vocabDisplaySettings_PROPS = {
      difficultyFilters: [1],
      langFilters: undefined, // langFilters is undefined
    } as unknown as z_vocabDisplaySettings_PROPS;

    const { result } = renderHook(() =>
      USE_getActiveFilterCount(displaySettings)
    );

    expect(result.current).toBe(1); // One difficulty filter, no language filters
  });
});
