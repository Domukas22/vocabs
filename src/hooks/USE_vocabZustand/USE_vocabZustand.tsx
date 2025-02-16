//
//
//

import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { IS_vocabMarkedBeingUpdated } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers";
import { UPDATE_vocabMarked } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers/UPDATE_vocabMarked/UPDATE_vocabMarked";
import { FETCH_vocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers";
import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import {
  IS_vocabMarkedBeingDeleted,
  SOFTDELETE_vocab,
} from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/helpers";
import {
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
} from "@/src/features/vocabs/vocabList/USE_updateVocabDifficulty/helpers";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { Delay, SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { create } from "zustand";

export type PREPEND_oneVocab_PAYLOAD = Vocab_TYPE;
export type UPDATE_oneVocab_PAYLOAD = Vocab_TYPE;
export type APPEND_manyVocabs_PAYLOAD = FETCH_myVocabs_RESPONSE_TYPE;
export type DELETE_oneVocab_PAYLOAD = string;
export type SET_error_PAYLOAD = General_ERROR;
export type START_fetch_PAYLOAD = loadingState_TYPES;

export type myVocabsReducerAction_PROPS =
  | { type: "PREPEND_oneVocab"; payload: PREPEND_oneVocab_PAYLOAD }
  | { type: "UPDATE_oneVocab"; payload: UPDATE_oneVocab_PAYLOAD }
  | {
      type: "APPEND_manyVocabs";
      payload: APPEND_manyVocabs_PAYLOAD;
    }
  | { type: "DELETE_oneVocab"; payload: DELETE_oneVocab_PAYLOAD }
  | {
      type: "SET_error";
      payload: SET_error_PAYLOAD;
    }
  | { type: "START_fetch"; payload: START_fetch_PAYLOAD };

export type vocabsReducer_TYPE = {
  data?: {
    vocabs: Vocab_TYPE[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
    HAS_reachedEnd: boolean;
  };
  loading_STATE?: loadingState_TYPES;
  error?: General_ERROR;
};

//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////

type Vocabs_STATE = {
  vocabs: Vocab_TYPE[];
  printed_IDS: Set<string>;
  unpaginated_COUNT: number;
  HAS_reachedEnd: boolean;
  loading_STATE: loadingState_TYPES;
  error?: General_ERROR;
  currentVocab_ACTIONS: currentVocabAction_TYPE[];

  r_FETCH_vocabs: (
    args: FETCH_myVocabs_ARG_TYPES,
    loadMore?: boolean,
    loading_STATE?: loadingState_TYPES
  ) => Promise<void>;
  r_MARK_vocab: (vocab_ID: string, val: boolean) => Promise<void>;
  r_UPDATE_vocabDifficulty: (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3
  ) => Promise<void>;
  r_SOFTDELETE_vocab: (vocab_ID: string) => Promise<void>;
};

export const USE_vocabZustand = create<Vocabs_STATE>((set, get) => ({
  vocabs: [],
  printed_IDS: new Set<string>(),
  HAS_reachedEnd: false,
  unpaginated_COUNT: 0,
  loading_STATE: "none",
  error: undefined,
  currentVocab_ACTIONS: [],

  r_FETCH_vocabs: async (
    args: FETCH_myVocabs_ARG_TYPES,
    loadMore: boolean = false,
    loading_STATE
  ) => {
    const { search, targetList_ID, difficultyFilters, langFilters } = args;

    try {
      // ----------------------------------------
      const _loading_STATE =
        loading_STATE ||
        DETERMINE_loadingState({
          search,
          targetList_ID,
          difficultyFilters,
          langFilters,
        });
      // ----------------------------------------
      set({ error: undefined, loading_STATE: _loading_STATE });
      if (!loadMore) set({ vocabs: [] });
      // ----------------------------------------
      const data = await FETCH_vocabs({
        ...args,
        excludeIds: loadMore ? get().printed_IDS : new Set(),
      });

      if (!data)
        throw new General_ERROR({
          function_NAME: "r_FETCH_vocabs",
          message:
            "'FETCH_vocabs' returned an undefined 'data' object, although it didn't throw an error",
        });

      if (loadMore) {
        set((state) => ({
          vocabs: loadMore ? [...state.vocabs, ...data.vocabs] : data.vocabs,
          unpaginated_COUNT: data.unpaginated_COUNT,
          printed_IDS: new Set(data.vocabs.map((v) => v.id)),
          HAS_reachedEnd: data.vocabs.length >= data.unpaginated_COUNT,
          loading_STATE: "none",
        }));
      } else {
        set({
          vocabs: data.vocabs,
          unpaginated_COUNT: data.unpaginated_COUNT,
          printed_IDS: new Set(data.vocabs.map((v) => v.id)),
          HAS_reachedEnd: data.vocabs.length >= data.unpaginated_COUNT,
          loading_STATE: "none",
        });
      }
    } catch (error: any) {
      // Do not update state if signal has been aborted (if fetch has been canceled).
      // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
      if (error.message === "AbortError: Aborted") return;

      const err = new General_ERROR({
        function_NAME: error?.function_NAME || "r_FETCH_vocabs",
        message: error?.message,
        errorToSpread: error,
      });

      set({ loading_STATE: "error", error: err });
      SEND_internalError(err);
    }
  },
  r_MARK_vocab: async (vocab_ID: string, val: boolean) => {
    const function_NAME = "r_MARK_vocab";
    if (IS_vocabMarkedBeingUpdated(vocab_ID, get().currentVocab_ACTIONS))
      return;
    try {
      set({
        currentVocab_ACTIONS: [
          ...get().currentVocab_ACTIONS,
          { action: "updating_marked", vocab_ID },
        ],
      });
      // ----------------------------------------
      const { data } = await UPDATE_vocabMarked(vocab_ID, val);
      // ----------------------------------------

      if (!data)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_vocabMarked' returned undefined data, although no error was thrown",
        });

      set((state) => ({
        vocabs: state.vocabs.map((v) => {
          if (v.id === vocab_ID) return data;
          return v;
        }),
        currentVocab_ACTIONS: get().currentVocab_ACTIONS.filter(
          (action) =>
            action.action !== "updating_marked" && action.vocab_ID !== vocab_ID
        ),
      }));
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      // set({ loading_STATE: "error", error: err });
      SEND_internalError(err);
    }
  },
  r_UPDATE_vocabDifficulty: async (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3
  ) => {
    const function_NAME = "r_UPDATE_vocabDifficulty";
    if (IS_vocabDifficultyBeingUpdated(vocab_ID, get().currentVocab_ACTIONS))
      return;

    if (current_DIFFICULTY === new_DIFFICULTY) return;

    try {
      set({
        currentVocab_ACTIONS: [
          ...get().currentVocab_ACTIONS,
          { action: "updating_difficulty", vocab_ID, new_DIFFICULTY },
        ],
      });

      // ----------------------------------------
      const { data } = await UPDATE_vocabDifficulty(vocab_ID, new_DIFFICULTY);

      // ----------------------------------------

      if (!data)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_vocabDifficulty' returned undefined data, although no error was thrown",
        });

      set((state) => ({
        vocabs: state.vocabs.map((v) => {
          if (v.id === vocab_ID) return data;
          return v;
        }),
        currentVocab_ACTIONS: get().currentVocab_ACTIONS.filter(
          (action) =>
            action.action !== "updating_difficulty" &&
            action.vocab_ID !== vocab_ID
        ),
      }));
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      // set({ loading_STATE: "error", error: err });
      SEND_internalError(err);
    }
  },
  r_SOFTDELETE_vocab: async (vocab_ID: string) => {
    const function_NAME = "r_SOFTDELETE_vocab";
    if (IS_vocabMarkedBeingDeleted(vocab_ID, get().currentVocab_ACTIONS))
      return;

    try {
      set({
        currentVocab_ACTIONS: [
          ...get().currentVocab_ACTIONS,
          { action: "deleting", vocab_ID: vocab_ID },
        ],
      });

      // ----------------------------------------
      const { success } = await SOFTDELETE_vocab(vocab_ID);

      // ----------------------------------------

      if (!success)
        throw new General_ERROR({
          function_NAME,
          message:
            "'DELETE_vocab' returned undefined data, although no error was thrown",
        });

      set((state) => ({
        vocabs: state.vocabs.filter((v) => v.id !== vocab_ID),
        currentVocab_ACTIONS: get().currentVocab_ACTIONS.filter(
          (action) =>
            action.action !== "deleting" && action.vocab_ID !== vocab_ID
        ),
      }));
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      // set({ loading_STATE: "error", error: err });
      SEND_internalError(err);
    }
  },
}));
