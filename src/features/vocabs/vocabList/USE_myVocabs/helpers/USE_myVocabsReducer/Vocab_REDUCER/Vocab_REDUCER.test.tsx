//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { vocabsReducer_TYPE, myVocabsReducerAction_PROPS } from "./types";
import { Vocab_REDUCER } from "./Vocab_REDUCER";
import {
  PREPEND_oneVocabToReducer,
  APPEND_manyVocabsToReducer,
  START_vocabReducerFetch,
} from "./helpers";

// Mocking helper functions
jest.mock("./helpers", () => ({
  PREPEND_oneVocabToReducer: jest.fn(),
  DELETE_vocabFromReducer: jest.fn(),
  SET_reducerError: jest.fn(),
  APPEND_manyVocabsToReducer: jest.fn(),
  UPDATE_oneVocabInReducer: jest.fn(),
  START_vocabReducerFetch: jest.fn(),
}));

describe("Vocab_REDUCER", () => {
  const mockState = {} as vocabsReducer_TYPE;

  test("1. Returns state if no error is thrown by helper function", () => {
    const mockAction = {
      type: "START_fetch",
      payload: {},
    } as myVocabsReducerAction_PROPS;

    // Mock the function to return state
    (START_vocabReducerFetch as jest.Mock).mockReturnValueOnce(mockState);

    const result = Vocab_REDUCER(mockState, mockAction);

    expect(result).toBe(mockState); // The state should be returned if no error occurs
  });

  test("2. Returns state if action.type doesn't match any available options", () => {
    const invalidAction = {
      type: "INVALID_ACTION",
      payload: {},
    } as unknown as myVocabsReducerAction_PROPS;

    const result = Vocab_REDUCER(mockState, invalidAction);

    expect(result).toBe(mockState); // The state should remain unchanged for unrecognized actions
  });

  test("3. Catches and returns error if helper function throws an error", () => {
    const errorMessage = "Error in helper function";

    // Mock helper function to throw an error
    (START_vocabReducerFetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const result = Vocab_REDUCER(mockState, {
      type: "START_fetch",
      payload: "filtering",
    });

    expect(result.error).toBeInstanceOf(General_ERROR);
    expect(result?.error?.message).toBe(errorMessage);
    expect(result.z_myVocabsLoading_STATE).toBe("error"); // Ensure the state has an error and loading state set to "error"
  });

  test("4. Ensures each helper function works as expected (APPEND_manyVocabs)", () => {
    const mockAction = {
      type: "APPEND_manyVocabs",
      payload: {},
    } as myVocabsReducerAction_PROPS;

    (APPEND_manyVocabsToReducer as jest.Mock).mockReturnValueOnce(mockState);

    const result = Vocab_REDUCER(mockState, mockAction);

    expect(result).toBe(mockState); // Should return the modified state from APPEND_manyVocabsToReducer
  });

  test("5. Ensures each helper function works as expected (PREPEND_oneVocab)", () => {
    const mockAction = {
      type: "PREPEND_oneVocab",
      payload: {},
    } as myVocabsReducerAction_PROPS;

    (PREPEND_oneVocabToReducer as jest.Mock).mockReturnValueOnce(mockState);

    const result = Vocab_REDUCER(mockState, mockAction);

    expect(result).toBe(mockState); // Should return the modified state from PREPEND_oneVocabToReducer
  });

  test("6. Ensures error handling for invalid action types", () => {
    const invalidAction = {
      type: "INVALID_ACTION",
      payload: {},
    } as unknown as myVocabsReducerAction_PROPS;

    const result = Vocab_REDUCER(mockState, invalidAction);

    expect(result).toBe(mockState); // No change to state
  });

  test("7. Ensures error handling if multiple helper functions throw errors", () => {
    const errorMessage = "Multiple errors occurred";

    // Simulate both helper functions throwing errors
    (START_vocabReducerFetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const result = Vocab_REDUCER(mockState, {
      type: "START_fetch",
      payload: "filtering",
    });

    expect(result.error).toBeInstanceOf(General_ERROR);
    expect(result?.error?.message).toBe(errorMessage);
    expect(result.z_myVocabsLoading_STATE).toBe("error");
  });
});
