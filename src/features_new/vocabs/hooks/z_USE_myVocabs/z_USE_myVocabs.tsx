//
//
//

import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { IS_vocabMarkedBeingDeleted } from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/helpers";
import { FETCH_oneList } from "@/src/features_new/lists/functions/fetch/FETCH_oneList/FETCH_oneList";
import { General_ERROR } from "@/src/types/error_TYPES";
import { raw_List_TYPE, loadingState_TYPES } from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { currentVocabAction_TYPE } from "@/src/zustand/types";
import { t } from "i18next";
import { create } from "zustand";

import {
  FETCH_vocabs,
  IS_vocabMarkedBeingUpdated,
  UPDATE_vocabMarked,
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
  SOFTDELETE_vocab,
  HARDDELETE_vocab,
} from "@/src/features_new/vocabs/functions";

import {
  list_TYPES,
  myVocabFetch_TYPES,
} from "../../functions/fetch/FETCH_vocabs/types";

export type z_FETCH_vocabsArgument_TYPES = {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: list_TYPES;

  fetch_TYPE: myVocabFetch_TYPES;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";

  loadMore: boolean;
};

type z_USE_myVocabs_PROPS = {
  z_myList: raw_List_TYPE | undefined;
  z_myVocabs: raw_Vocab_TYPE[];
  z_target_VOCAB: raw_Vocab_TYPE | undefined;
  z_myVocabPrinted_IDS: Set<string>;
  z_myVocabsUnpaginated_COUNT: number;
  z_HAVE_myVocabsReachedEnd: boolean;
  z_myVocabsLoading_STATE: loadingState_TYPES;
  z_myVocabs_ERROR?: General_ERROR;
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];

  z_myVocabsHighlighted_ID: string;
  z_myVocabsHighlightTimeoutID: any;

  z_FETCH_myVocabs: (args: z_FETCH_vocabsArgument_TYPES) => Promise<void>;
  z_MARK_myVocab: (
    vocab_ID: string,
    val: boolean,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_UPDATE_myVocabDifficulty: (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_SOFTDELETE_myVocab: (
    vocab_ID: string,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_HARDDELETE_myVocab: (
    vocab_ID: string,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;
  z_HIGHLIGHT_myVocab: (vocab_ID: string) => void;
  z_SET_myTargetVocab: (vocab: raw_Vocab_TYPE | undefined) => void;
};

// z = Zustand
// oL == One List
export const z_USE_myVocabs = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_myList: undefined,

  z_myVocabs: [],
  z_target_VOCAB: undefined,
  z_myVocabPrinted_IDS: new Set<string>(),
  z_HAVE_myVocabsReachedEnd: false,
  z_myVocabsUnpaginated_COUNT: 0,
  z_myVocabsLoading_STATE: "none",
  z_myVocabs_ERROR: undefined,
  z_myVocabsCurrent_ACTIONS: [],

  z_myVocabsHighlighted_ID: "",
  z_myVocabsHighlightTimeoutID: "", // This will hold the reference to the timeout

  z_FETCH_myVocabs: async (args) => {
    const function_NAME = "z_FETCH_myVocabs";
    const {
      search,
      difficultyFilters,
      langFilters,
      loadMore,
      list_id,
      user_id,
      fetch_TYPE,
      list_TYPE,
    } = args;

    try {
      // ----------------------------------------
      // Handle initial
      if (!list_id) return;

      const _z_myVocabsLoading_STATE: loadingState_TYPES =
        DETERMINE_loadingState({
          search,
          loadMore,
          difficultyFilters,
          langFilters,
        });

      set({
        z_myVocabs_ERROR: undefined,
        z_myVocabsLoading_STATE: _z_myVocabsLoading_STATE,
      });
      if (!loadMore) set({ z_myVocabs: [] });

      // ----------------------------------------

      // If a new list is provided as an arg, fetch and inser teh list
      if (list_id !== get().z_myList?.id) {
        set({ z_myList: undefined });

        if (list_TYPE === "public" && fetch_TYPE === "all") {
          set({
            z_myList: {
              id: "all-public-vocabs",
              name: t("listName.allPublicVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "all") {
          set({
            z_myList: {
              id: "all-my-vocabs",
              name: t("listName.allMyVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "deleted") {
          set({
            z_myList: {
              id: "all-my-deleted-vocabs",
              name: t("listName.deletedVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "marked") {
          set({
            z_myList: {
              id: "all-my-marked-vocabs",
              name: t("listName.savedVocabs"),
            } as raw_List_TYPE,
          });
        } else {
          const { list } = await FETCH_oneList(user_id, list_id);
          if (!list)
            throw new General_ERROR({
              function_NAME,
              message:
                "'FETCH_oneList' returned an undefined 'list' object, although it didn't throw an error",
            });

          set({ z_myList: list });
        }
      }
      // ----------------------------------------
      // Handle the vocabs
      const data = await FETCH_vocabs({
        ...args,
        excludeIds: loadMore ? get().z_myVocabPrinted_IDS : new Set(),
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
          z_myVocabs: [...state.z_myVocabs, ...data.vocabs],
          z_myVocabsUnpaginated_COUNT: data.unpaginated_COUNT,
          z_myVocabPrinted_IDS: new Set([
            ...state.z_myVocabPrinted_IDS,
            ...data.vocabs.map((v) => v.id),
          ]),
          z_HAVE_myVocabsReachedEnd:
            [...state.z_myVocabs, ...data.vocabs].length >=
            data.unpaginated_COUNT,
          z_myVocabsLoading_STATE: "none",
        }));
      } else {
        set({
          z_myVocabs: data.vocabs,
          z_myVocabsUnpaginated_COUNT: data.unpaginated_COUNT,
          z_myVocabPrinted_IDS: new Set(data.vocabs.map((v) => v.id)),
          z_HAVE_myVocabsReachedEnd:
            data.vocabs.length >= data.unpaginated_COUNT,
          z_myVocabsLoading_STATE: "none",
        });
      }

      // ----------------------------------------
    } catch (error: any) {
      // Do not update state if signal has been aborted (if fetch has been canceled).
      // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
      if (error.message === "AbortError: Aborted") return;

      const err = new General_ERROR({
        function_NAME: error?.function_NAME || "z_FETCH_myVocabs",
        message: error?.message,
        errorToSpread: error,
      });

      set({
        z_myVocabsLoading_STATE: "error",
        z_myVocabs_ERROR: err,
      });
      SEND_internalError(err);
    }
  },
  z_MARK_myVocab: async (vocab_ID: string, val: boolean, sideEffects) => {
    const function_NAME = "z_MARK_myVocab";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (IS_vocabMarkedBeingUpdated(vocab_ID, get().z_myVocabsCurrent_ACTIONS))
      return;
    try {
      set({
        z_myVocabsCurrent_ACTIONS: [
          ...get().z_myVocabsCurrent_ACTIONS,
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
        z_myVocabs: state.z_myVocabs.map((v) => {
          if (v.id === vocab_ID) return data;
          return v;
        }),
        z_myVocabsCurrent_ACTIONS: get().z_myVocabsCurrent_ACTIONS.filter(
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
  z_UPDATE_myVocabDifficulty: async (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    sideEffects
  ) => {
    const function_NAME = "z_UPDATE_myVocabDifficulty";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (
      IS_vocabDifficultyBeingUpdated(vocab_ID, get().z_myVocabsCurrent_ACTIONS)
    )
      return;

    if (current_DIFFICULTY === new_DIFFICULTY) return;

    try {
      set({
        z_myVocabsCurrent_ACTIONS: [
          ...get().z_myVocabsCurrent_ACTIONS,
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
        z_myVocabs: state.z_myVocabs.map((v) => {
          if (v.id === vocab_ID) return data;
          return v;
        }),
        z_myVocabsCurrent_ACTIONS: get().z_myVocabsCurrent_ACTIONS.filter(
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
  z_SOFTDELETE_myVocab: async (vocab_ID: string, sideEffects) => {
    const function_NAME = "z_SOFTDELETE_myVocab";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (IS_vocabMarkedBeingDeleted(vocab_ID, get().z_myVocabsCurrent_ACTIONS))
      return;

    try {
      set({
        z_myVocabsCurrent_ACTIONS: [
          ...get().z_myVocabsCurrent_ACTIONS,
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
            "'SOFTDELETE_vocab' returned undefined data, although no error was thrown",
        });

      set((state) => ({
        z_myVocabs: state.z_myVocabs.filter((v) => v.id !== vocab_ID),
        z_myVocabsCurrent_ACTIONS: get().z_myVocabsCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "deleting" && action.vocab_ID !== vocab_ID
        ),
        z_myVocabsUnpaginated_COUNT: state.z_myVocabsUnpaginated_COUNT - 1,
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
  z_HARDDELETE_myVocab: async (vocab_ID: string, sideEffects) => {
    const function_NAME = "z_SOFTDELETE_myVocab";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (IS_vocabMarkedBeingDeleted(vocab_ID, get().z_myVocabsCurrent_ACTIONS))
      return;

    try {
      set({
        z_myVocabsCurrent_ACTIONS: [
          ...get().z_myVocabsCurrent_ACTIONS,
          { action: "deleting", vocab_ID: vocab_ID },
        ],
      });

      // ----------------------------------------
      const { success } = await HARDDELETE_vocab(vocab_ID);

      // ----------------------------------------

      if (!success)
        throw new General_ERROR({
          function_NAME,
          message:
            "'HARDDELETE_vocab' returned undefined data, although no error was thrown",
        });

      set((state) => ({
        z_myVocabs: state.z_myVocabs.filter((v) => v.id !== vocab_ID),
        z_myVocabsCurrent_ACTIONS: get().z_myVocabsCurrent_ACTIONS.filter(
          (action) =>
            action.action !== "deleting" && action.vocab_ID !== vocab_ID
        ),
        z_myVocabsUnpaginated_COUNT: state.z_myVocabsUnpaginated_COUNT - 1,
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

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => {
    const currentTimeoutID = get().z_myVocabsHighlightTimeoutID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_myVocabsHighlighted_ID: vocab_ID });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_myVocabsHighlighted_ID: "" });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ z_myVocabsHighlightTimeoutID: timeoutID });
  },

  z_SET_myTargetVocab: (target_VOCAB) => {
    set({ z_target_VOCAB: target_VOCAB });
  },
}));
