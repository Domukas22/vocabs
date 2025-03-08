//
//
//

import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { FETCH_oneList } from "../../../functions/fetch/FETCH_oneList/FETCH_oneList";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";

type z_USE_myOneList_PROPS = {
  z_myOneList: List_TYPE | undefined;
  z_SET_myOneList: (list: List_TYPE) => void;
  z_RESET_myOneList: () => void;

  z_IS_myOneListFetching: boolean;
  z_FETCH_myOneListById: (
    list_id: string,
    user_id: string,
    list_TYPE: privateOrPublic_TYPE,
    sideEffects: {
      onSuccess?: () => void;
      onFailure?: (error: General_ERROR) => void;
    }
  ) => Promise<void>;

  z_IS_myOneListNameHighlighted: boolean;
  highlightTimeout_ID: any;
  z_HIGHLIGHT_myOneListName: () => void;
};

export const z_USE_myOneList = create<z_USE_myOneList_PROPS>((set, get) => ({
  z_myOneList: undefined,
  z_IS_myOneListFetching: false,

  z_FETCH_myOneListById: async (list_id, user_id, list_TYPE, sideEffects) => {
    const function_NAME = "z_DELETE_myOneList";
    const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

    if (get().z_IS_myOneListFetching) return;

    // if (get().z_myOneList !== undefined && get().z_myOneList?.id === list_id)
    //   return;

    // ----------------------------------------
    try {
      set({ z_IS_myOneListFetching: true });

      const { list } = await FETCH_oneList(list_id, user_id, list_TYPE);

      if (!list)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_oneList' returned undefined 'list', although no error was thrown",
        });

      // ----------------------------------------
      // First, naviGate back, then remove the one list state
      onSuccess();
      set({ z_myOneList: list });

      //TODO ==> What if it fails? hwo do we display error?

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
      set({ z_IS_myOneListFetching: false });
    }
  },

  z_SET_myOneList: (list: List_TYPE) => set({ z_myOneList: list }),
  z_RESET_myOneList: () => set({ z_myOneList: undefined }),

  z_IS_myOneListNameHighlighted: false,
  highlightTimeout_ID: "",
  z_HIGHLIGHT_myOneListName: () => {
    const currentTimeoutID = get().highlightTimeout_ID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_IS_myOneListNameHighlighted: true });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_IS_myOneListNameHighlighted: false });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ highlightTimeout_ID: timeoutID });
  },
}));
