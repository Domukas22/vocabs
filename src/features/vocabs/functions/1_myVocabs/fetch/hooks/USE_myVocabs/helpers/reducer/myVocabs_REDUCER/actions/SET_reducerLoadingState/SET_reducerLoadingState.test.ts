import { renderHook, act } from "@testing-library/react-native";

import { myVocabs_REDUCER_RESPONSE_TYPE } from "../../types";
import { SET_reducerLoadingState } from "./SET_reducerLoadingState";
import { loadingState_TYPES } from "@/src/types";

describe("SET_reducerLoadingState", () => {
  const initialState = {
    loading_STATE: "none",
    error: undefined, // Example of another state value that should not be affected
  } as unknown as myVocabs_REDUCER_RESPONSE_TYPE;

  test("1. Updates loading state when payload is provided", () => {
    const newLoadingState: loadingState_TYPES = "loading";

    const newState = SET_reducerLoadingState(initialState, newLoadingState);

    expect(newState.loading_STATE).toBe(newLoadingState);
    expect(newState.error).toBe(initialState.error); // Ensure other state values are preserved
  });

  test("2. Resets loading state when payload is falsy", () => {
    const prevState = {
      ...initialState,
      loading_STATE: "loading",
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = SET_reducerLoadingState(
      prevState,
      "" as loadingState_TYPES
    );

    expect(newState.loading_STATE).toBe("none");
    expect(newState.error).toBe(prevState.error);
  });

  test("3. Does not modify other state properties", () => {
    const prevState = {
      ...initialState,
      loading_STATE: "loading",
      error: { user_MSG: "Some error" },
    } as myVocabs_REDUCER_RESPONSE_TYPE;

    const newState = SET_reducerLoadingState(prevState, "searching");

    expect(newState.loading_STATE).toBe("searching");
    expect(newState.error).toEqual(prevState.error);
  });

  test("4. Handles unexpected payload values", () => {
    const prevState = { ...initialState, loading_STATE: "loading" };

    // @ts-expect-error Testing unexpected payload
    const newState = SET_reducerLoadingState(prevState, 123);

    expect(newState.loading_STATE).toBe(123);
    expect(newState.error).toBe(prevState.error);
  });

  test("5. Handles null as a payload", () => {
    const prevState = { ...initialState, loading_STATE: "loading" };

    // @ts-expect-error Testing null payload
    const newState = SET_reducerLoadingState(prevState, null);

    expect(newState.loading_STATE).toBe("none");
    expect(newState.error).toBe(prevState.error);
  });

  test("6. Handles undefined payload gracefully", () => {
    const prevState = { ...initialState, loading_STATE: "loading" };

    // @ts-expect-error Undefined payload case
    const newState = SET_reducerLoadingState(prevState, undefined);

    expect(newState.loading_STATE).toBe("none");
    expect(newState.error).toBe(prevState.error);
  });
});
