//
//
//

import { currentVocabAction_TYPE } from "@/src/features/vocabs/types";
import { FETCH_oneList } from "@/src/features_new/lists/functions/fetch/FETCH_oneList/FETCH_oneList";
import { raw_List_TYPE } from "@/src/features_new/lists/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { create } from "zustand";
import { raw_Vocab_TYPE } from "../../../types";
import { z_FETCH_vocabsArgument_TYPES } from "../z_USE_myVocabs/z_USE_myVocabs";
import { FETCH_vocabs } from "../../USE_fetchVocabs/FETCH_vocabs/FETCH_vocabs";

type z_USE_publicVocabs_PROPS = {
  z_publicList: raw_List_TYPE | undefined;
  z_publicVocabs: raw_Vocab_TYPE[];
  z_publicPrinted_IDS: Set<string>;
  z_publicVocabsUnpaginated_COUNT: number;
  z_HAVE_publicVocabsReachedEnd: boolean;
  z_publicVocabsLoading_STATE: loadingState_TYPES;
  z_publicVocabs_ERROR?: General_ERROR;
  z_publicVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];

  z_FETCH_publicVocabs: (args: z_FETCH_vocabsArgument_TYPES) => Promise<void>;

  z_publicTarget_VOCAB: raw_Vocab_TYPE | undefined;
  z_SET_publicTargetVocab: (vocab: raw_Vocab_TYPE | undefined) => void;
};

export const z_USE_publicVocabs = create<z_USE_publicVocabs_PROPS>(
  (set, get) => ({
    z_publicList: undefined,

    z_publicVocabs: [],
    z_publicTarget_VOCAB: undefined,
    z_publicPrinted_IDS: new Set<string>(),
    z_HAVE_publicVocabsReachedEnd: false,
    z_publicVocabsUnpaginated_COUNT: 0,
    z_publicVocabsLoading_STATE: "none",
    z_publicVocabs_ERROR: undefined,
    z_publicVocabsCurrent_ACTIONS: [],

    z_publicVocabsHighlighted_ID: "",
    z_publicVocabsHighlightTimeoutID: "", // This will hold the reference to the timeout

    z_FETCH_publicVocabs: async (args) => {
      const function_NAME = "z_FETCH_publicVocabs";
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
        // ----------------------------------------
        // Handle initial
        if (!list_id) return;

        const _loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
          search,
          loadMore,
          difficultyFilters,
          langFilters,
        });

        set({
          z_publicList: undefined,
          z_publicVocabs_ERROR: undefined,
          z_publicVocabsLoading_STATE: _loading_STATE,
        });
        if (!loadMore) set({ z_publicVocabs: [] });

        // ----------------------------------------
        // Handle the list

        if (list_TYPE === "public" && fetch_TYPE === "all") {
          set({ z_publicList: { id: "all-public-vocabs" } as raw_List_TYPE });
        } else if (list_TYPE === "private" && fetch_TYPE === "all") {
          set({ z_publicList: { id: "all-my-vocabs" } as raw_List_TYPE });
        } else if (list_TYPE === "private" && fetch_TYPE === "deleted") {
          set({
            z_publicList: { id: "all-my-deleted-vocabs" } as raw_List_TYPE,
          });
        } else if (list_TYPE === "private" && fetch_TYPE === "marked") {
          set({
            z_publicList: { id: "all-my-marked-vocabs" } as raw_List_TYPE,
          });
        } else {
          const { list } = await FETCH_oneList(list_id, user_id);
          if (!list)
            throw new General_ERROR({
              function_NAME,
              message:
                "'FETCH_oneList' returned an undefined 'list' object, although it didn't throw an error",
            });

          set({ z_publicList: list });
        }
        // ----------------------------------------
        // Handle the vocabs
        const data = await FETCH_vocabs({
          ...args,
          excludeIds: loadMore ? get().z_publicPrinted_IDS : new Set(),
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
            z_publicVocabs: [...state.z_publicVocabs, ...data.vocabs],
            z_publicVocabsUnpaginated_COUNT: data.unpaginated_COUNT,
            z_publicPrinted_IDS: new Set([
              ...state.z_publicPrinted_IDS,
              ...data.vocabs.map((v) => v.id),
            ]),
            z_HAVE_publicVocabsReachedEnd:
              [...state.z_publicVocabs, ...data.vocabs].length >=
              data.unpaginated_COUNT,
            z_publicVocabsLoading_STATE: "none",
          }));
        } else {
          set({
            z_publicVocabs: data.vocabs,
            z_publicVocabsUnpaginated_COUNT: data.unpaginated_COUNT,
            z_publicPrinted_IDS: new Set(data.vocabs.map((v) => v.id)),
            z_HAVE_publicVocabsReachedEnd:
              data.vocabs.length >= data.unpaginated_COUNT,
            z_publicVocabsLoading_STATE: "none",
          });
        }

        // ----------------------------------------
      } catch (error: any) {
        // Do not update state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (error.message === "AbortError: Aborted") return;

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || "z_FETCH_publicVocabs",
          message: error?.message,
          errorToSpread: error,
        });

        set({
          z_publicVocabsLoading_STATE: "error",
          z_publicVocabs_ERROR: err,
        });
        SEND_internalError(err);
      }
    },

    z_SET_publicTargetVocab: (target_VOCAB) => {
      set({ z_publicTarget_VOCAB: target_VOCAB });
    },
  })
);
