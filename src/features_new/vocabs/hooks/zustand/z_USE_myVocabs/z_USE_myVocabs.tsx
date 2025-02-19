//
//
//

import { raw_Vocab_TYPE, Vocab_TYPE } from "@/src/features_new/vocabs/types";
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
} from "../../../functions/fetch/FETCH_vocabs/types";

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
  z_myVocabs: Vocab_TYPE[];
  z_myVocabPrinted_IDS: Set<string>;

  z_myVocabsUnpaginated_COUNT: number;
  z_HAVE_myVocabsReachedEnd: boolean;

  z_myVocabsLoading_STATE: loadingState_TYPES;
  z_myVocabs_ERROR?: General_ERROR;
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];

  z_myVocabsHighlighted_ID: string;
  z_myVocabsHighlightTimeoutID: any;

  z_FETCH_myVocabs: (args: z_FETCH_vocabsArgument_TYPES) => Promise<void>;
  z_HIGHLIGHT_myVocab: (vocab_ID: string) => void;
  z_UPDATE_vocabInMyVocabsList: (target_VOCAB: Vocab_TYPE) => void;
  z_REMOVE_vocabFromMyVocabsList: (vocab_ID: string) => void;
};

// z = Zustand
// oL == One List
export const z_USE_myVocabs = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_myVocabs: [],
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
  z_UPDATE_vocabInMyVocabsList: (target_VOCAB) =>
    set((state) => ({
      z_myVocabs: [...state.z_myVocabs].map((x) =>
        x.id === target_VOCAB.id ? target_VOCAB : x
      ),
    })),
  z_REMOVE_vocabFromMyVocabsList: (vocab_ID) =>
    set((state) => ({
      z_myVocabs: [...state.z_myVocabs].filter((x) => x.id !== vocab_ID),
    })),
}));
