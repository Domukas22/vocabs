//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { IS_vocabMarkedBeingUpdated } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers";
import { UPDATE_vocabMarked } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers/UPDATE_vocabMarked/UPDATE_vocabMarked";
import { FETCH_vocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers";
import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import {
  IS_vocabMarkedBeingDeleted,
  SOFTDELETE_vocab,
} from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/helpers";
import {
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
} from "@/src/features/vocabs/vocabList/USE_updateVocabDifficulty/helpers";
import { FETCH_oneList } from "@/src/features/vocabs/Vocabs_FLASHLIST/helpers/FETCH_oneList/FETCH_oneList";
import { General_ERROR } from "@/src/types/error_TYPES";
import { List_TYPE, loadingState_TYPES } from "@/src/types/general_TYPES";
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

export interface currentVocabAction_TYPE {
  vocab_ID: string;
  action:
    | "deleting"
    | "updating"
    | "updating_difficulty"
    | "updating_marked"
    | "moving"
    | "copying";
  new_DIFFICULTY?: number;
}

//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////

export type r_FETCH_vocabs_ARG_TYPE = {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: vocabList_TYPES;

  fetch_TYPE: vocabFetch_TYPES;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";

  loadMore: boolean;
  loading_STATE: loadingState_TYPES | undefined;
};

type z_USE_oneList_PROPS = {
  list: List_TYPE | undefined;
  list_NAME: string; // When we click on a list, we can instantly provide a list name and not wait for the full list fetch to complete
  vocabs: Vocab_TYPE[];
  target_VOCAB: Vocab_TYPE | undefined;
  printed_IDS: Set<string>;
  unpaginated_COUNT: number;
  HAS_reachedEnd: boolean;
  loading_STATE: loadingState_TYPES;
  error?: General_ERROR;
  currentVocab_ACTIONS: currentVocabAction_TYPE[];

  highlightedVocab_ID: string;
  timeoutID: any;

  oL_FETCH: (args: r_FETCH_vocabs_ARG_TYPE) => Promise<void>;
  r_MARK_vocab: (
    vocab_ID: string,
    val: boolean,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  r_UPDATE_vocabDifficulty: (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  r_SOFTDELETE_vocab: (
    vocab_ID: string,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  r_HIGHLIGHT_vocab: (vocab_ID: string) => void;
  r_SET_targetVocab: (vocab: Vocab_TYPE | undefined) => void;
};

// z = Zustand
// oL == One List
export const z_USE_oneList = create<z_USE_oneList_PROPS>((set, get) => ({
  list: undefined,
  list_NAME: "",
  vocabs: [],
  target_VOCAB: undefined,
  printed_IDS: new Set<string>(),
  HAS_reachedEnd: false,
  unpaginated_COUNT: 0,
  loading_STATE: "none",
  error: undefined,
  currentVocab_ACTIONS: [],

  highlightedVocab_ID: "",
  timeoutID: "", // This will hold the reference to the timeout

  oL_FETCH: async (args) => {
    const function_NAME = "oL_FETCH";
    const {
      search,
      difficultyFilters,
      langFilters,
      loadMore,
      loading_STATE,
      list_id,
      user_id,
      fetch_TYPE,
      list_TYPE,
    } = args;

    try {
      if (!list_id) return;

      const _loading_STATE =
        loading_STATE ||
        DETERMINE_loadingState({
          search,
          targetList_ID: list_id,
          difficultyFilters,
          langFilters,
        });

      set({ list: undefined, error: undefined, loading_STATE: _loading_STATE });
      if (!loadMore) set({ vocabs: [] });

      await Delay(10000);
      // ----------------------------------------
      // Handle initial

      // ----------------------------------------
      // Handle the list

      if (list_TYPE === "public" && fetch_TYPE === "all") {
        set({ list: { id: "all-public-vocabs" } as List_TYPE });
      } else if (list_TYPE === "private" && fetch_TYPE === "all") {
        set({ list: { id: "all-my-vocabs" } as List_TYPE });
      } else if (list_TYPE === "private" && fetch_TYPE === "deleted") {
        set({ list: { id: "all-my-deleted-vocabs" } as List_TYPE });
      } else if (list_TYPE === "private" && fetch_TYPE === "marked") {
        set({ list: { id: "all-my-marked-vocabs" } as List_TYPE });
      } else {
        const { list } = await FETCH_oneList(user_id, list_id);
        if (!list)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_oneList' returned an undefined 'list' object, although it didn't throw an error",
          });

        set({ list });
      }

      // ----------------------------------------
      // Handle the vocabs
      const data = await FETCH_vocabs({
        ...args,
        excludeIds: loadMore ? get().printed_IDS : new Set(),
      });

      if (!data)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_vocabs' returned an undefined 'data' object, although it didn't throw an error",
        });

      // ----------------------------------------
      // Handle the state
      if (loadMore) {
        set((state) => ({
          vocabs: [...state.vocabs, ...data.vocabs],
          unpaginated_COUNT: data.unpaginated_COUNT,
          printed_IDS: new Set([
            ...state.printed_IDS,
            ...data.vocabs.map((v) => v.id),
          ]),
          HAS_reachedEnd:
            [...state.vocabs, ...data.vocabs].length >= data.unpaginated_COUNT,
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

      // ----------------------------------------
    } catch (error: any) {
      // Do not update state if signal has been aborted (if fetch has been canceled).
      // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
      if (error.message === "AbortError: Aborted") return;

      const err = new General_ERROR({
        function_NAME: error?.function_NAME || "oL_FETCH",
        message: error?.message,
        errorToSpread: error,
      });

      set({ loading_STATE: "error", error: err });
      SEND_internalError(err);
    }
  },
  r_MARK_vocab: async (vocab_ID: string, val: boolean, sideEffects) => {
    const function_NAME = "r_MARK_vocab";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

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
      onSuccess();

      //--
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },
  r_UPDATE_vocabDifficulty: async (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    sideEffects
  ) => {
    const function_NAME = "r_UPDATE_vocabDifficulty";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

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

      onSuccess();
      // --
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },
  r_SOFTDELETE_vocab: async (vocab_ID: string, sideEffects) => {
    const function_NAME = "r_SOFTDELETE_vocab";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

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
      onSuccess();
      // --
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      onFailure(err);
      SEND_internalError(err);
    }
  },

  r_HIGHLIGHT_vocab: (vocab_ID: string) => {
    const currentTimeoutID = get().timeoutID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ highlightedVocab_ID: vocab_ID });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ highlightedVocab_ID: "" });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ timeoutID });
  },

  r_SET_targetVocab: (target_VOCAB) => {
    set({ target_VOCAB });
  },
}));
