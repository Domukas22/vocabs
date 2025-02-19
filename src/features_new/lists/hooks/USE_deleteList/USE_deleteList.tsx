//
//
//

import { currentActionItem_TYPE } from "@/src/hooks/z_USE_currentActions/types";
import { z_USE_currentActions } from "@/src/hooks/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { DELETE_list } from "./DELETE_list/DELETE_list";
import { USE_zustand } from "@/src/hooks";

const function_NAME = "USE_deleteList";

export function USE_deleteList() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const _DELETE_list = useCallback(
    async (
      item_ID: string,
      sideEffects: {
        onSuccess?: () => void;
        onFailure?: (error: General_ERROR) => void;
      }
    ) => {
      const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", item_ID)) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("list", item_ID, "deleting");

        // --------------------------------------------------
        // Proceed to delete
        await DELETE_list(item_ID, z_user?.id || "");

        // refetch starter page state
        // update one list
        // update user vocab count
        // update list inside private lists page

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
