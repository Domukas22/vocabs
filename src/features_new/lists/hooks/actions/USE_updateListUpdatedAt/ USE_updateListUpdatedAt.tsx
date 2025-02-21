//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { t } from "i18next";
import { UPDATE_listUpdatedAt } from "./UPDATE_listUpdatedAt/UPDATE_listUpdatedAt";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";

const function_NAME = "USE_updateListUpdatedAt";

export function USE_updateListUpdatedAt() {
  const { z_user } = USE_zustand();
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
