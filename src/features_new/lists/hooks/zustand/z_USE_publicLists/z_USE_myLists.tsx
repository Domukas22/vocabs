//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { currentListAction_TYPE } from "@/src/zustand/types";
import { create } from "zustand";
import { List_TYPE } from "../../../types";
import { listFetch_TYPES } from "../../../functions/fetch/FETCH_lists/types";

export type z_PREPARE_publicListsForFetch_TYPE = ({
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

export type z_INSERT_publicListsError_TYPE = (error: General_ERROR) => void;

//////////////////////////////////////////////////////////////
type z_USE_publicLists_PROPS = {
  z_publicLists: List_TYPE[];

  z_publicListsPrinted_IDS: Set<string>;
  z_publicListsUnpaginated_COUNT: number;

  z_publicListsFetch_TYPE: listFetch_TYPES;

  z_HAVE_publicListsReachedEnd: boolean;
  z_publicListsLoading_STATE: loadingState_TYPES;

  z_publicLists_ERROR?: General_ERROR;
  z_publicListsCurrent_ACTIONS: currentListAction_TYPE[];

  z_publicListsHighlighted_ID: string;
  z_publicListsHighlightTimeoutID: any;

  z_REMOVE_listFromPublicLists: (list_ID: string) => void;
  z_PREPEND_listToPublicLists: (list: List_TYPE) => void;
  z_UPDATE_listInPublicLists: (list: List_TYPE) => void;

  z_HIGHLIGHT_publicList: (list_id: string) => void;

  z_PREPARE_publicListsForFetch: z_PREPARE_publicListsForFetch_TYPE;
  z_INSERT_fetchedLists: z_INSERT_fetchedLists_TYPE;
  z_INSERT_publicListsError: z_INSERT_publicListsError_TYPE;
};

export const z_USE_publicLists = create<z_USE_publicLists_PROPS>(
  (set, get) => ({
    z_publicLists: [],

    z_publicListsPrinted_IDS: new Set<string>(),
    z_HAVE_publicListsReachedEnd: false,

    z_publicListsFetch_TYPE: "all",

    z_publicListsUnpaginated_COUNT: 0,
    z_publicListsLoading_STATE: "none",

    z_publicLists_ERROR: undefined,
    z_publicListsCurrent_ACTIONS: [],

    z_publicListsHighlighted_ID: "",
    z_publicListsHighlightTimeoutID: "", // This will hold the reference to the timeout

    z_REMOVE_listFromPublicLists: (list_ID) => {
      const new_LISTS = [...get().z_publicLists].filter(
        (list) => list.id !== list_ID
      );

      set({
        z_publicLists: new_LISTS,
        z_publicListsPrinted_IDS: new Set(new_LISTS.map((x) => x.id)),
      });
    },
    z_PREPEND_listToPublicLists: (list) => {
      const new_LISTS = [list, ...get().z_publicLists];

      set({
        z_publicLists: new_LISTS,
        z_publicListsPrinted_IDS: new Set(new_LISTS.map((x) => x.id)),
      });
    },
    z_UPDATE_listInPublicLists: (new_LIST) => {
      set((state) => ({
        z_publicLists: [...state.z_publicLists].map((list) =>
          list.id === new_LIST.id ? new_LIST : list
        ),
      }));
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

    z_PREPARE_publicListsForFetch: ({
      loadMore,
      loading_STATE,
      fetch_TYPE,
    }) => {
      set({
        z_publicLists_ERROR: undefined,
        z_publicListsLoading_STATE: loading_STATE,
        z_publicListsFetch_TYPE: fetch_TYPE,
      });
      if (!loadMore) set({ z_publicLists: [] });
    },
    z_INSERT_fetchedLists: ({ lists, unpaginated_COUNT, loadMore }) => {
      if (loadMore) {
        const withNewlyAppendedList_ARR = [...get().z_publicLists, ...lists];
        set({
          z_publicLists: withNewlyAppendedList_ARR,
          z_publicListsUnpaginated_COUNT: unpaginated_COUNT,
          z_publicListsPrinted_IDS: new Set(
            withNewlyAppendedList_ARR.map((x) => x.id)
          ),
          z_HAVE_publicListsReachedEnd:
            withNewlyAppendedList_ARR.length >= unpaginated_COUNT,
          z_publicListsLoading_STATE: "none",
        });
      } else {
        set({
          z_publicLists: lists,
          z_publicListsUnpaginated_COUNT: unpaginated_COUNT,
          z_publicListsPrinted_IDS: new Set(lists.map((v) => v.id)),
          z_HAVE_publicListsReachedEnd: lists.length >= unpaginated_COUNT,
          z_publicListsLoading_STATE: "none",
        });
      }
    },
    z_INSERT_publicListsError: (error) =>
      set({
        z_publicLists: [],
        z_publicListsLoading_STATE: "error",
        z_publicLists_ERROR: error,
      }),
  })
);
