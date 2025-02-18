//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES, List_TYPE } from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { create } from "zustand";
import {
  currentListAction_TYPE,
  z_FETCH_listsArgument_TYPES,
} from "../../../../features/lists/Lists_FLASHLIST/helpers/types";
import { FETCH_lists } from "../../functions/FETCH_lists/FETCH_lists";

type z_USE_myLists_PROPS = {
  z_myLists: List_TYPE[];
  z_myTarget_LIST: List_TYPE | undefined;

  z_myListsPrinted_IDS: Set<string>;
  z_myListsUnpaginated_COUNT: number;

  z_HAVE_myListsReachedEnd: boolean;
  z_myListsLoading_STATE: loadingState_TYPES;

  z_myLists_ERROR?: General_ERROR;
  z_myListsCurrent_ACTIONS: currentListAction_TYPE[];

  z_myListsHighlighted_ID: string;
  z_myListsHighlightTimeoutID: any;

  z_FETCH_myLists: (args: z_FETCH_listsArgument_TYPES) => Promise<void>;

  // z_HARDDELETE_myVocab: (
  //   vocab_ID: string,
  //   sideEffects: {
  //     onSuccess?: () => void;
  //     onFailure?: (error: General_ERROR) => void;
  //   }
  // ) => Promise<void>;
  z_HIGHLIGHT_myList: (list_id: string) => void;
  z_SET_myTargetList: (list: List_TYPE | undefined) => void;
};

// z = Zustand
// oL == One List
export const z_USE_myLists = create<z_USE_myLists_PROPS>((set, get) => ({
  z_myLists: [],
  z_myTarget_LIST: undefined,

  z_myListsPrinted_IDS: new Set<string>(),
  z_HAVE_myListsReachedEnd: false,

  z_myListsUnpaginated_COUNT: 0,
  z_myListsLoading_STATE: "none",

  z_myLists_ERROR: undefined,
  z_myListsCurrent_ACTIONS: [],

  z_myListsHighlighted_ID: "",
  z_myListsHighlightTimeoutID: "", // This will hold the reference to the timeout

  z_FETCH_myLists: async (args) => {
    const function_NAME = "z_FETCH_myLists";
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
        z_myLists_ERROR: undefined,
        z_myListsLoading_STATE: loading_STATE,
      });
      if (!loadMore) set({ z_myLists: [], z_myListsPrinted_IDS: new Set() });

      // ----------------------------------------
      // Handle the lists
      const { lists, unpaginated_COUNT } = await FETCH_lists({
        ...args,
        excludeIds: get().z_myListsPrinted_IDS,
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
          z_myLists: [...state.z_myLists, ...lists],
          z_myListsUnpaginated_COUNT: unpaginated_COUNT,
          z_myListsPrinted_IDS: new Set([
            ...state.z_myListsPrinted_IDS,
            ...lists.map((x) => x.id),
          ]),
          z_HAVE_myListsReachedEnd:
            [...state.z_myLists, ...lists].length >= unpaginated_COUNT,
          z_myListsLoading_STATE: "none",
        }));
      } else {
        set({
          z_myLists: lists,
          z_myListsUnpaginated_COUNT: unpaginated_COUNT,
          z_myListsPrinted_IDS: new Set(lists.map((v) => v.id)),
          z_HAVE_myListsReachedEnd: lists.length >= unpaginated_COUNT,
          z_myListsLoading_STATE: "none",
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
        z_myListsLoading_STATE: "error",
        z_myLists_ERROR: err,
      });
      SEND_internalError(err);
    }
  },

  z_HIGHLIGHT_myList: (vocab_ID: string) => {
    const currentTimeoutID = get().z_myListsHighlightTimeoutID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_myListsHighlighted_ID: vocab_ID });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_myListsHighlighted_ID: "" });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ z_myListsHighlightTimeoutID: timeoutID });
  },

  z_SET_myTargetList: (target_VOCAB) => {
    set({ z_myTarget_LIST: target_VOCAB });
  },
}));
