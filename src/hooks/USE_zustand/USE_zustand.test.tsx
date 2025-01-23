//
//
//

import { renderHook, act } from "@testing-library/react-native";
import {
  USE_zustand,
  z_listDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "./USE_zustand"; // Adjust the path as needed
import User_MODEL from "../../db/models/User_MODEL";

describe("USE_zustand Store", () => {
  test("should set and get user", () => {
    const { result } = renderHook(() => USE_zustand());
    const testUser = {
      id: "1",
      name: "Test User",
      email: "testuser@example.com",
    } as unknown as User_MODEL;

    act(() => {
      result.current.z_SET_user(testUser);
    });

    expect(result.current.z_user).toEqual(testUser);
  });

  test("should update list display settings", () => {
    const { result } = renderHook(() => USE_zustand());

    const newSettings = {
      sorting: "date",
      sortDirection: "ascending",
      langFilters: ["en"],
    } as z_listDisplaySettings_PROPS;

    act(() => {
      result.current.z_SET_listDisplaySettings(newSettings);
    });

    expect(result.current.z_listDisplay_SETTINGS).toEqual({
      ...result.current.z_listDisplay_SETTINGS,
      ...newSettings,
    });
  });

  test("should update vocab display settings", () => {
    const { result } = renderHook(() => USE_zustand());

    const newSettings = {
      SHOW_description: false,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "fr",
      sorting: "shuffle",
      sortDirection: "ascending",
      difficultyFilters: [1, 2],
      langFilters: ["fr"],
    } as z_vocabDisplaySettings_PROPS;

    act(() => {
      result.current.z_SET_vocabDisplaySettings(newSettings);
    });

    expect(result.current.z_vocabDisplay_SETTINGS).toEqual({
      ...result.current.z_vocabDisplay_SETTINGS,
      ...newSettings,
    });
  });

  test("should handle undefined user", () => {
    const { result } = renderHook(() => USE_zustand());

    act(() => {
      result.current.z_SET_user(undefined);
    });

    expect(result.current.z_user).toBeUndefined();
  });

  test("should handle partial update of list display settings", () => {
    const { result } = renderHook(() => USE_zustand());

    const partialSettings = {
      sortDirection: "ascending",
    } as z_listDisplaySettings_PROPS;

    act(() => {
      result.current.z_SET_listDisplaySettings(partialSettings);
    });

    expect(result.current.z_listDisplay_SETTINGS.sortDirection).toBe(
      "ascending"
    );
  });

  test("should handle partial update of vocab display settings", () => {
    const { result } = renderHook(() => USE_zustand());

    const partialSettings = {
      SHOW_description: false,
    };

    act(() => {
      result.current.z_SET_vocabDisplaySettings(partialSettings);
    });

    expect(result.current.z_vocabDisplay_SETTINGS.SHOW_description).toBe(false);
  });
});
