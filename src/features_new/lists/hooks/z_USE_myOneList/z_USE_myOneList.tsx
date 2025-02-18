//
//
//

import {
  currentVocabAction_TYPE,
  raw_Vocab_TYPE,
} from "@/src/features/vocabs/types";
import { IS_vocabMarkedBeingUpdated } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers";
import { UPDATE_vocabMarked } from "@/src/features_new/vocabs/functions/update/marked/UPDATE_vocabMarked/UPDATE_vocabMarked";
import { FETCH_vocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import {
  IS_vocabMarkedBeingDeleted,
  SOFTDELETE_vocab,
} from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/helpers";
import {
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
} from "@/src/features/vocabs/vocabList/USE_updateVocabDifficulty/helpers";
import { FETCH_oneList } from "@/src/features_new/vocabs/Vocabs_FLASHLIST/helpers/functions/FETCH_oneList/FETCH_oneList";
import { General_ERROR } from "@/src/types/error_TYPES";
import {
  raw_List_TYPE,
  loadingState_TYPES,
  List_TYPE,
} from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { create } from "zustand";

import { HARDDELETE_vocab } from "../../../vocabs/functions/delete/HARDDELETE_vocab/HARDDELETE_vocab";
import { t } from "i18next";

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
  z_myOneList: List_TYPE | undefined;
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];

  z_myVocabsHighlighted_ID: string;
  z_myVocabsHighlightTimeoutID: any;

  z_FETCH_myVocabs: (args: z_FETCH_vocabsArgument_TYPES) => Promise<void>;

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => void;
  z_SET_myTargetVocab: (vocab: raw_Vocab_TYPE | undefined) => void;
};

// z = Zustand
// oL == One List
export const z_USE_myOneList = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_myOneList: undefined,
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
      if (list_id !== get().z_myOneList?.id) {
        set({ z_myOneList: undefined });

        if (list_TYPE === "public" && fetch_TYPE === "all") {
          set({
            z_myOneList: {
              id: "all-public-vocabs",
              name: t("listName.allPublicVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "all") {
          set({
            z_myOneList: {
              id: "all-my-vocabs",
              name: t("listName.allMyVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "deleted") {
          set({
            z_myOneList: {
              id: "all-my-deleted-vocabs",
              name: t("listName.deletedVocabs"),
            } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "marked") {
          set({
            z_myOneList: {
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

          set({ z_myOneList: list });
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
