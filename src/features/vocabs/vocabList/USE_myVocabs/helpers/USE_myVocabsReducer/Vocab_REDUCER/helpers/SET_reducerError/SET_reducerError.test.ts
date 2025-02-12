import { renderHook, act } from "@testing-library/react-native";

import { vocabsReducer_TYPE } from "../../types";
import { Error_PROPS } from "@/src/types/error_TYPES";
import { SET_reducerError } from "./SET_reducerError";

describe("SET_reducerError", () => {
  const initialState = {
    error: undefined,
    loading_STATE: "none", // Example of other state values that should not be affected
  } as unknown as vocabsReducer_TYPE;

  test("1. Sets error when payload is provided", () => {
    const errorPayload = { user_MSG: "Something went wrong" } as Error_PROPS;

    const newState = SET_reducerError(initialState, errorPayload);

    expect(newState.error).toEqual(errorPayload);
    expect(newState.loading_STATE).toBe(initialState.loading_STATE);
  });

  test("2. Clears error when payload is undefined", () => {
    const prevState = {
      ...initialState,
      error: { user_MSG: "Old error" } as Error_PROPS,
    };

    const newState = SET_reducerError(prevState, undefined);

    expect(newState.error).toBeUndefined();
    expect(newState.loading_STATE).toBe(prevState.loading_STATE);
  });

  test("3. Handles null error gracefully", () => {
    const prevState = {
      ...initialState,
      error: null as unknown as Error_PROPS,
    };

    const newState = SET_reducerError(prevState, undefined);

    expect(newState.error).toBeUndefined();
    expect(newState.loading_STATE).toBe(prevState.loading_STATE);
  });

  test("4. Does not modify other state properties", () => {
    const prevState = {
      ...initialState,
      error: { user_MSG: "Keep this" } as Error_PROPS,
    };

    const newState = SET_reducerError(prevState, {
      user_MSG: "New error",
    } as Error_PROPS);

    expect(newState.error).toEqual({ user_MSG: "New error" });
    expect(newState.loading_STATE).toBe(prevState.loading_STATE);
  });

  test("5. Handles incorrect error structure", () => {
    const prevState = { ...initialState, error: { user_MSG: "Valid error" } };

    // @ts-expect-error Testing incorrect structure
    const newState = SET_reducerError(prevState, { invalidProp: "Oops" });

    expect(newState.error).toEqual({ invalidProp: "Oops" });
    expect(newState.loading_STATE).toBe(prevState.loading_STATE);
  });

  test("6. Handles empty object as payload", () => {
    const prevState = {
      ...initialState,
      error: { user_MSG: "Existing error" },
    };

    // @ts-expect-error Empty object as payload
    const newState = SET_reducerError(prevState, {} as Error_PROPS);

    expect(newState.error).toEqual({});
    expect(newState.loading_STATE).toBe(prevState.loading_STATE);
  });
});
