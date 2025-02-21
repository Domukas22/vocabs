//
//
//

import { currentActionItem_TYPE } from "@/src/hooks/zustand/z_USE_currentActions/types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { DELETE_list } from "./DELETE_list/DELETE_list";
import { USE_zustand } from "@/src/hooks";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";

const function_NAME = "USE_deleteList";

export function USE_deleteList() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { z_RESET_myOneList } = z_USE_myOneList();
  const { z_REMOVE_listFromMyLists } = z_USE_myLists();

  const _DELETE_list = useCallback(
    async (
      list_ID: string,
      SHOULD_updateListUpdatedAt: boolean = true,
      sideEffects: {
        onSuccess?: () => void;
        onFailure?: (error: General_ERROR) => void;
      }
    ) => {
      const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", list_ID, "deleting")) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("list", list_ID, "deleting");

        // --------------------------------------------------
        // Proceed to delete
        await DELETE_list(list_ID, z_user?.id || "");

        z_RESET_myOneList();
        z_REMOVE_listFromMyLists(list_ID);
        // refetch starter page state
        // update user vocab count

        onSuccess();
        // -----------------------------
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        onFailure(err);
        SEND_internalError(err);
      } finally {
        REMOVE_currentAction(item_ID);
      }
    },
    []
  );

  return { DELETE_list: _DELETE_list };
}
