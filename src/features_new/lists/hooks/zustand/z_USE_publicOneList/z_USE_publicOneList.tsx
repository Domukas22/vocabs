//
//
//

import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { FETCH_oneList } from "../../../functions/fetch/FETCH_oneList/FETCH_oneList";
import { listFetch_TYPES } from "../../fetchLists/FETCH_lists/types";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";

type z_USE_publicOneList_PROPS = {
  z_publicOneList: List_TYPE | undefined;
  z_SET_publicOneList: (list: List_TYPE) => void;
  z_RESET_publicOneList: () => void;

  z_IS_publicOneListFetching: boolean;
  z_FETCH_publicOneListById: (
    list_id: string,
    user_id: string,
    list_TYPE: itemVisibility_TYPE,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;

  z_IS_publicOneListNameHighlighted: boolean;
  highlightTimeout_ID: any;
  z_HIGHLIGHT_publicOneListName: () => void;
};

export const z_USE_publicOneList = create<z_USE_publicOneList_PROPS>(
  (set, get) => ({
    z_publicOneList: undefined,
    z_IS_publicOneListFetching: false,

    z_FETCH_publicOneListById: async (
      list_id,
      user_id,
      list_TYPE,
      sideEffects
    ) => {
      const function_NAME = "z_FETCH_publicOneListById";
      const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

      if (get().z_IS_publicOneListFetching) return;

      // ----------------------------------------
      try {
        set({ z_IS_publicOneListFetching: true });

        const { list } = await FETCH_oneList(list_id, user_id, list_TYPE);

        if (!list)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_oneList' returned undefined 'list', although no error was thrown",
          });

        // ----------------------------------------
        // First, naviate back, then remove the one list state
        onSuccess();
        set({ z_publicOneList: list });

        // ----------------------------------------
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        onFailure(err);
        SEND_internalError(err);
      } finally {
        set({ z_IS_publicOneListFetching: false });
      }
    },

    z_SET_publicOneList: (list: List_TYPE) => set({ z_publicOneList: list }),
    z_RESET_publicOneList: () => set({ z_publicOneList: undefined }),

    z_IS_publicOneListNameHighlighted: false,
    highlightTimeout_ID: "",
    z_HIGHLIGHT_publicOneListName: () => {
      const currentTimeoutID = get().highlightTimeout_ID;
      // If there is a previous timeout, clear it
      if (currentTimeoutID) {
        clearTimeout(currentTimeoutID);
      }

      // Set the new highlighted vocab ID
      set({ z_IS_publicOneListNameHighlighted: true });

      // Set a new timeout to reset the highlighted vocab ID after 5 seconds
      const timeoutID = setTimeout(() => {
        set({ z_IS_publicOneListNameHighlighted: false });
      }, 5000);

      // Save the timeout reference in the state to clear it if needed
      set({ highlightTimeout_ID: timeoutID });
    },
  })
);
