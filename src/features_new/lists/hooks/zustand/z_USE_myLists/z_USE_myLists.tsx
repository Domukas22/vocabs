//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { currentListAction_TYPE } from "@/src/zustand/types";
import { create } from "zustand";
import { List_TYPE } from "../../../types";
import { listFetch_TYPES } from "../../../functions/fetch/FETCH_lists/types";

export type z_PREPARE_myListsForFetch_TYPE = ({
  loadMore,
  loading_STATE,
  fetch_TYPE,
}: {
  loadMore: boolean;
  loading_STATE: loadingState_TYPES;
  fetch_TYPE: listFetch_TYPES;
}) => void;

export type z_INSERT_fetchedLists_TYPE = ({
  lists,
  unpaginated_COUNT,
  loadMore,
}: {
  lists: List_TYPE[];
  unpaginated_COUNT: number;
  loadMore: boolean;
}) => void;
export type z_INSERT_collectedLangIds_TYPE = ({
  lang_IDs,
}: {
  lang_IDs: string[];
}) => void;

export type z_INSERT_myListsError_TYPE = (error: General_ERROR) => void;

//////////////////////////////////////////////////////////////

type z_USE_myLists_PROPS = {
  z_myLists: List_TYPE[];
  z_myListsCollectedLangIds: string[];

  z_myListsPrinted_IDS: Set<string>;
  z_myListsUnpaginated_COUNT: number;

  z_myListsFetch_TYPE: listFetch_TYPES;

  z_HAVE_myListsReachedEnd: boolean;
  z_myListsLoading_STATE: loadingState_TYPES;

  z_myLists_ERROR?: General_ERROR;
  z_myListsCurrent_ACTIONS: currentListAction_TYPE[];

  z_myListsHighlighted_ID: string;
  z_myListsHighlightTimeoutID: any;

  z_REMOVE_listFromMyLists: (list_ID: string) => void;
  z_PREPEND_listToMyLists: (list: List_TYPE) => void;
  z_UPDATE_listInMyLists: (list: List_TYPE) => void;

  z_HIGHLIGHT_myList: (list_id: string) => void;

  z_PREPARE_myListsForFetch: z_PREPARE_myListsForFetch_TYPE;
  z_INSERT_fetchedLists: z_INSERT_fetchedLists_TYPE;
  z_INSERT_collectedLangIds: z_INSERT_collectedLangIds_TYPE;
  z_INSERT_myListsError: z_INSERT_myListsError_TYPE;
};

export const z_USE_myLists = create<z_USE_myLists_PROPS>((set, get) => ({
  z_myLists: [],
  z_myListsCollectedLangIds: [],

  z_myListsPrinted_IDS: new Set<string>(),
  z_HAVE_myListsReachedEnd: false,

  z_myListsFetch_TYPE: "all",

  z_myListsUnpaginated_COUNT: 0,
  z_myListsLoading_STATE: "none",

  z_myLists_ERROR: undefined,
  z_myListsCurrent_ACTIONS: [],

  z_myListsHighlighted_ID: "",
  z_myListsHighlightTimeoutID: "", // This will hold the reference to the timeout

  z_REMOVE_listFromMyLists: (list_ID) => {
    const new_LISTS = [...get().z_myLists].filter(
      (list) => list.id !== list_ID
    );

    set({
      z_myLists: new_LISTS,
      z_myListsPrinted_IDS: new Set(new_LISTS.map((x) => x.id)),
      z_myListsUnpaginated_COUNT: get().z_myListsUnpaginated_COUNT - 1,
    });
  },
  z_PREPEND_listToMyLists: (list) => {
    const new_LISTS = [list, ...get().z_myLists];

    set({
      z_myLists: new_LISTS,
      z_myListsPrinted_IDS: new Set(new_LISTS.map((x) => x.id)),
      z_myListsUnpaginated_COUNT: get().z_myListsUnpaginated_COUNT + 1,
    });
  },
  z_UPDATE_listInMyLists: (new_LIST) => {
    set((state) => ({
      z_myLists: [...state.z_myLists].map((list) =>
        list.id === new_LIST.id ? new_LIST : list
      ),
    }));
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

  z_PREPARE_myListsForFetch: ({ loadMore, loading_STATE, fetch_TYPE }) => {
    set({
      z_myLists_ERROR: undefined,
      z_myListsLoading_STATE: loading_STATE,
      z_myListsFetch_TYPE: fetch_TYPE,
    });
    if (!loadMore) set({ z_myLists: [] });
  },
  z_INSERT_fetchedLists: ({ lists, unpaginated_COUNT, loadMore }) => {
    if (loadMore) {
      const withNewlyAppendedList_ARR = [...get().z_myLists, ...lists];
      set({
        z_myLists: withNewlyAppendedList_ARR,
        z_myListsUnpaginated_COUNT: unpaginated_COUNT,
        z_myListsPrinted_IDS: new Set(
          withNewlyAppendedList_ARR.map((x) => x.id)
        ),
        z_HAVE_myListsReachedEnd:
          withNewlyAppendedList_ARR.length >= unpaginated_COUNT,
        z_myListsLoading_STATE: "none",
      });
    } else {
      set({
        z_myLists: lists,
        z_myListsUnpaginated_COUNT: unpaginated_COUNT,
        z_myListsPrinted_IDS: new Set(lists.map((v) => v.id)),
        z_HAVE_myListsReachedEnd: lists.length >= unpaginated_COUNT,
        z_myListsLoading_STATE: "none",
      });
    }
  },
  z_INSERT_collectedLangIds: ({ lang_IDs }) =>
    set({ z_myListsCollectedLangIds: lang_IDs }),
  z_INSERT_myListsError: (error) =>
    set({
      z_myLists: [],
      z_myListsLoading_STATE: "error",
      z_myLists_ERROR: error,
    }),
}));
