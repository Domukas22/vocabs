//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { useCallback } from "react";
import { UPDATE_listUpdatedAt } from "./UPDATE_listUpdatedAt/UPDATE_listUpdatedAt";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const function_NAME = "USE_updateListUpdatedAt";

export function USE_updateListUpdatedAt() {
  const { z_user } = z_USE_user();
  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const _UPDATE_listUpdatedAt = useCallback(async (list_ID: string) => {
    try {
      // --------------------------------------------------
      // Check if item is already in action
      if (IS_inAction("list", list_ID, "updating_updated_at")) return;

      // --------------------------------------------------
      // Insert action
      ADD_currentAction("list", list_ID, "updating_updated_at");

      // --------------------------------------------------
      // Proceed to update
      const { updated_LIST } = await UPDATE_listUpdatedAt(
        list_ID,
        z_user?.id || ""
      );

      if (!updated_LIST)
        throw new General_ERROR({
          function_NAME,
          message:
            "'UPDATE_listUpdatedAt' returned undefined 'updated_LIST', although no error was thrown",
        });

      // -----------------------------
    } catch (error: any) {
      throw new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });
    } finally {
      REMOVE_currentAction(list_ID, "updating_updated_at");
    }
  }, []);

  return { UPDATE_listUpdatedAt: _UPDATE_listUpdatedAt };
}
