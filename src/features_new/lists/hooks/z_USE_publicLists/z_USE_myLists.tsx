//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import {
  currentListAction_TYPE,
  z_FETCH_listsArgument_TYPES,
} from "@/src/zustand/types";
import { create } from "zustand";
import { FETCH_lists } from "../../functions/FETCH_lists/FETCH_lists";
import { List_TYPE } from "../../types";

type z_USE_publicLists_PROPS = {
  z_publicLists: List_TYPE[];
  z_myTarget_LIST: List_TYPE | undefined;

  z_publicListsPrinted_IDS: Set<string>;
  z_publicListsUnpaginated_COUNT: number;

  z_HAVE_publicListsReachedEnd: boolean;
  z_publicListsLoading_STATE: loadingState_TYPES;

  z_publicLists_ERROR?: General_ERROR;
  z_publicListsCurrent_ACTIONS: currentListAction_TYPE[];

  z_publicListsHighlighted_ID: string;
  z_publicListsHighlightTimeoutID: any;

  z_FETCH_publicLists: (args: z_FETCH_listsArgument_TYPES) => Promise<void>;

  // Remove one list from already printed lists

  // Create list + add list to printed lists
  // Add list to printed lists

  // Update a list inside the already printed lists

  z_HIGHLIGHT_publicList: (list_id: string) => void;
  z_SET_myTargetList: (list: List_TYPE | undefined) => void;
};

// z = Zustand
// oL == One List
export const z_USE_publicLists = create<z_USE_publicLists_PROPS>(
  (set, get) => ({
    z_publicLists: [],
    z_myTarget_LIST: undefined,

    z_publicListsPrinted_IDS: new Set<string>(),
    z_HAVE_publicListsReachedEnd: false,

    z_publicListsUnpaginated_COUNT: 0,
    z_publicListsLoading_STATE: "none",

    z_publicLists_ERROR: undefined,
    z_publicListsCurrent_ACTIONS: [],

    z_publicListsHighlighted_ID: "",
    z_publicListsHighlightTimeoutID: "", // This will hold the reference to the timeout

    z_FETCH_publicLists: async (args) => {
      const function_NAME = "z_FETCH_publicLists";
      const { search, langFilters, loadMore } = args;

      try {
        // ----------------------------------------
        // Handle initial

        const loading_STATE: loadingState_TYPES = DETERMINE_loadingState({
          search,
          loadMore,
          langFilters,
        });

        set({
          z_publicLists_ERROR: undefined,
          z_publicListsLoading_STATE: loading_STATE,
        });
        if (!loadMore)
          set({ z_publicLists: [], z_publicListsPrinted_IDS: new Set() });

        // ----------------------------------------
        // Handle the lists
        const { lists, unpaginated_COUNT } = await FETCH_lists({
          ...args,
          excludeIds: get().z_publicListsPrinted_IDS,
        });

        if (!lists)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_lists' returned an undefined 'data' object, although it didn't throw an error",
          });

        // ----------------------------------------
        // Handle the state
        if (loadMore) {
          set((state) => ({
            z_publicLists: [...state.z_publicLists, ...lists],
            z_publicListsUnpaginated_COUNT: unpaginated_COUNT,
            z_publicListsPrinted_IDS: new Set([
              ...state.z_publicListsPrinted_IDS,
              ...lists.map((x) => x.id),
            ]),
            z_HAVE_publicListsReachedEnd:
              [...state.z_publicLists, ...lists].length >= unpaginated_COUNT,
            z_publicListsLoading_STATE: "none",
          }));
        } else {
          set({
            z_publicLists: lists,
            z_publicListsUnpaginated_COUNT: unpaginated_COUNT,
            z_publicListsPrinted_IDS: new Set(lists.map((v) => v.id)),
            z_HAVE_publicListsReachedEnd: lists.length >= unpaginated_COUNT,
            z_publicListsLoading_STATE: "none",
          });
        }

        // ----------------------------------------
      } catch (error: any) {
        // Do not update state if signal has been aborted (if fetch has been canceled).
        // Also, don't throw any errors, because the only reason this will abort is if a new fetch request has started.
        if (error.message === "AbortError: Aborted") return;

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        set({
          z_publicListsLoading_STATE: "error",
          z_publicLists_ERROR: err,
        });
        SEND_internalError(err);
      }
    },

    z_HIGHLIGHT_publicList: (vocab_ID: string) => {
      const currentTimeoutID = get().z_publicListsHighlightTimeoutID;
      // If there is a previous timeout, clear it
      if (currentTimeoutID) {
        clearTimeout(currentTimeoutID);
      }

      // Set the new highlighted vocab ID
      set({ z_publicListsHighlighted_ID: vocab_ID });

      // Set a new timeout to reset the highlighted vocab ID after 5 seconds
      const timeoutID = setTimeout(() => {
        set({ z_publicListsHighlighted_ID: "" });
      }, 5000);

      // Save the timeout reference in the state to clear it if needed
      set({ z_publicListsHighlightTimeoutID: timeoutID });
    },

    z_SET_myTargetList: (target_VOCAB) => {
      set({ z_myTarget_LIST: target_VOCAB });
    },
  })
);
