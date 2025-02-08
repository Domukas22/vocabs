import { renderHook, act, waitFor } from "@testing-library/react-native";
import { myVocabs_REDUCER } from "./myVocabs_REDUCER";
import {
  myVocabs_REDUCER_RESPONSE_TYPE,
  myVocabsReducerAction_PROPS,
} from "./types";
import {
  SET_reducerLoadingState,
  ADD_newPaginatedVocabsToReducerState,
  ADD_vocabToReducer,
  DELETE_vocabFromReducer,
  SET_reducerError,
} from "./actions";

// Mock the action functions
jest.mock("./actions", () => ({
  SET_reducerLoadingState: jest.fn(),
  ADD_newPaginatedVocabsToReducerState: jest.fn(),
  ADD_vocabToReducer: jest.fn(),
  DELETE_vocabFromReducer: jest.fn(),
  SET_reducerError: jest.fn(),
}));

describe("myVocabs_REDUCER", () => {
  let initialState: myVocabs_REDUCER_RESPONSE_TYPE;

  beforeEach(() => {
    initialState = {
      data: {
        vocabs: [],
        printed_IDS: new Set(),
        unpaginated_COUNT: 0,
        HAS_reachedEnd: false,
      },
      error: undefined,
      loading_STATE: "none",
    };

    // Reset mock functions before each test
    jest.clearAllMocks();
  });

  // 1. Hides variables when calling SET_LOADING_STATE
  test("1. Corrently call the function to adjust loading state", () => {
    const action: myVocabsReducerAction_PROPS = {
      type: "SET_LOADING_STATE",
      payload: "loading",
    };

    myVocabs_REDUCER(initialState, action);

    // Check if SET_reducerLoadingState was called with correct args
    expect(SET_reducerLoadingState).toHaveBeenCalledWith(
      initialState,
      "loading"
    );
  });

  // 2. Adds paginated vocab correctly
  test("2. Corrently call the function to add newly paginated vocabs", () => {
    const newVocabs = [{ id: "1", word: "example" }];
    const action = {
      type: "ADD_VOCABS_TO_PAGINATION",
      payload: newVocabs,
    } as unknown as myVocabsReducerAction_PROPS;

    myVocabs_REDUCER(initialState, action);

    // Check if ADD_newPaginatedVocabsToReducerState was called with correct arguments
    expect(ADD_newPaginatedVocabsToReducerState).toHaveBeenCalledWith(
      initialState,
      newVocabs,
      expect.any(Function)
    );
  });

  // 3. Adds vocab correctly
  test("3. Corrently call the function to add a single vocab", () => {
    const newVocab = { id: "1", word: "example" };
    const action = {
      type: "ADD_VOCAB",
      payload: newVocab,
    } as unknown as myVocabsReducerAction_PROPS;

    myVocabs_REDUCER(initialState, action);

    // Check if ADD_vocabToReducer was called with correct arguments
    expect(ADD_vocabToReducer).toHaveBeenCalledWith(
      initialState,
      newVocab,
      expect.any(Function)
    );
  });

  // 4. Deletes vocab correctly
  test("4. Corrently call the function to delete a vocab", () => {
    const existingVocab = { id: "1", word: "example" };
    const stateWithVocab = {
      ...initialState,
      data: {
        vocabs: [existingVocab],
        printed_IDS: new Set(["1"]),
        unpaginated_COUNT: 1,
      },
    } as unknown as myVocabs_REDUCER_RESPONSE_TYPE;

    const action = {
      type: "DELETE_VOCAB",
      payload: existingVocab,
    } as unknown as myVocabsReducerAction_PROPS;

    myVocabs_REDUCER(stateWithVocab, action);

    // Check if DELETE_vocabFromReducer was called with correct arguments
    expect(DELETE_vocabFromReducer).toHaveBeenCalledWith(
      stateWithVocab,
      existingVocab,
      expect.any(Function)
    );
  });

  // 5. Sets error state correctly
  test("5. Corrently call the function to set an error", () => {
    const error = { message: "Some error occurred" };
    const action = {
      type: "SET_ERROR",
      payload: error,
    } as unknown as myVocabsReducerAction_PROPS;

    myVocabs_REDUCER(initialState, action);

    // Check if SET_reducerError was called with correct arguments
    expect(SET_reducerError).toHaveBeenCalledWith(initialState, error);
  });

  // 6. Resets state correctly
  test("6. Corrently call the function to reset the reducer state", () => {
    const resetState = {
      data: {
        vocabs: [],
        printed_IDS: new Set(),
        unpaginated_COUNT: 0,
        HAS_reachedEnd: false,
      },
      error: undefined,
      loading_STATE: "none",
    };
    const action = {
      type: "RESET_STATE",
      payload: resetState,
    } as unknown as myVocabsReducerAction_PROPS;

    const newState = myVocabs_REDUCER(initialState, action);

    expect(newState).toEqual(resetState); // Should match the reset state
  });

  // 7. Handles unknown action gracefully
  test("7. Handles unknown action gracefully", () => {
    const action = {
      type: "UNKNOWN_ACTION",
      payload: {},
    } as unknown as myVocabsReducerAction_PROPS;

    const newState = myVocabs_REDUCER(initialState, action);

    expect(newState).toEqual(initialState); // Should return the initial state unchanged
  });

  // 8. Handles empty action payload gracefully
  test("8. Handles empty payload gracefully", () => {
    const action = {
      type: "ADD_VOCAB",
      payload: {},
    } as unknown as myVocabsReducerAction_PROPS;

    myVocabs_REDUCER(initialState, action);

    // Check that the ADD_vocabToReducer action was called, but with empty payload
    expect(ADD_vocabToReducer).toHaveBeenCalledWith(
      initialState,
      {},
      expect.any(Function)
    );
  });
});
