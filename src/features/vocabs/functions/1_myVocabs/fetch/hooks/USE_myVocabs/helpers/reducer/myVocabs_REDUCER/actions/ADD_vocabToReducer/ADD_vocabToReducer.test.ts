//
//
//

import { renderHook } from "@testing-library/react-native";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { myVocabsReducerState_PROPS } from "../../types";
import { ADD_vocabToReducer } from "./ADD_vocabToReducer";

describe("ADD_vocabToReducer", () => {
  const initialState: myVocabsReducerState_PROPS = {
    data: {
      vocabs: [],
      printed_IDS: new Set(),
      unpaginated_COUNT: 0,
    },
    error: { value: false, msg: "" },
    loading_STATE: "none",
  };

  const validPayload = {
    id: "vocab1",
  } as Vocab_MODEL;

  test("1. Adds a vocab entry to an empty state", () => {
    const { result } = renderHook(() =>
      ADD_vocabToReducer(initialState, validPayload)
    );

    expect(result.current.data.vocabs).toHaveLength(1);
    expect(result.current.data.vocabs[0]).toEqual(validPayload);
    expect(result.current.data.printed_IDS.has(validPayload.id)).toBe(true);
    expect(result.current.data.unpaginated_COUNT).toBe(1);
  });

  test("2. Adds a vocab entry to a populated state", () => {
    const populatedState = {
      ...initialState,
      data: {
        vocabs: [validPayload],
        printed_IDS: new Set([validPayload.id]),
        unpaginated_COUNT: 1,
      },
    };

    const newPayload = {
      id: "vocab2",
    } as Vocab_MODEL;

    const { result } = renderHook(() =>
      ADD_vocabToReducer(populatedState, newPayload)
    );

    expect(result.current.data.vocabs).toHaveLength(2);
    expect(result.current.data.vocabs[0]).toEqual(newPayload);
    expect(result.current.data.vocabs[1]).toEqual(validPayload);
    expect(result.current.data.printed_IDS.has(newPayload.id)).toBe(true);
    expect(result.current.data.unpaginated_COUNT).toBe(2);
  });

  test("3. Does not break when duplicate vocab entry is added", () => {
    const populatedState = {
      ...initialState,
      data: {
        vocabs: [validPayload],
        printed_IDS: new Set([validPayload.id]),
        unpaginated_COUNT: 1,
      },
    };

    const { result } = renderHook(() =>
      ADD_vocabToReducer(populatedState, validPayload)
    );

    expect(result.current.data.vocabs).toHaveLength(2); // Added again but considered valid
    expect(result.current.data.printed_IDS.size).toBe(1); // Printed IDS doesn't duplicate
    expect(result.current.data.unpaginated_COUNT).toBe(2);
  });

  test("4. Handles undefined payload gracefully", () => {
    const { result } = renderHook(() =>
      ADD_vocabToReducer(initialState, undefined as unknown as Vocab_MODEL)
    );

    expect(result.current).toEqual(initialState); // Should return initial state
  });

  test("5. Handles incomplete payload", () => {
    const incompletePayload = {
      word: "missing-id",
      definition: "example definition",
    } as unknown as Vocab_MODEL;

    const { result } = renderHook(() =>
      ADD_vocabToReducer(initialState, incompletePayload)
    );

    expect(result.current.data.vocabs).toHaveLength(0);
    expect(result.current.data.unpaginated_COUNT).toBe(0);
  });

  test("6. Preserves state immutability", () => {
    const { result } = renderHook(() =>
      ADD_vocabToReducer(initialState, validPayload)
    );

    expect(result.current).not.toBe(initialState);
    expect(result.current.data).not.toBe(initialState.data);
    expect(result.current.data.vocabs).not.toBe(initialState.data.vocabs);
    expect(result.current.data.printed_IDS).not.toBe(
      initialState.data.printed_IDS
    );
  });

  test("7. Handles large payload", () => {
    const largePayload = Array.from({ length: 1000 }, (_, i) => ({
      id: `vocab-${i}`,
    })) as Vocab_MODEL[];

    let updatedState = initialState;
    largePayload.forEach((payload) => {
      updatedState = ADD_vocabToReducer(updatedState, payload);
    });

    expect(updatedState.data.vocabs).toHaveLength(1000);
    expect(updatedState.data.unpaginated_COUNT).toBe(1000);
    expect(updatedState.data.printed_IDS.size).toBe(1000);
  });

  test("8. Handles null initial state gracefully", () => {
    const { result } = renderHook(() =>
      ADD_vocabToReducer(
        null as unknown as myVocabsReducerState_PROPS,
        validPayload
      )
    );

    expect(result.current).toBeNull(); // Should not throw but return null
  });
});
