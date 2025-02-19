//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { RECOLLECT_listLangIds } from "./RECOLLECT_listLangIds/RECOLLECT_listLangIds";
import { z_USE_myOneList } from "../../z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../z_USE_myLists/z_USE_myLists";

const function_NAME = "USE_recollectListCollectedLangIds";

export function USE_recollectListLangIds() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { z_SET_myOneList } = z_USE_myOneList();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();

  const _UPDATE_listDefaultLangIds = useCallback(async (list_ID: string) => {
    try {
      // --------------------------------------------------
      // Check if item is already in action
      if (IS_inAction("list", list_ID, "recollecting_lang_ids")) return;

      // --------------------------------------------------
      // Insert action
      ADD_currentAction("list", list_ID, "recollecting_lang_ids");

      // --------------------------------------------------
      // Proceed to update
      const { updated_LIST } = await RECOLLECT_listLangIds(
        list_ID,
        z_user?.id || ""
      );

      if (!updated_LIST)
        throw new General_ERROR({
          function_NAME,
          message:
            "'RECOLLECT_listLangIds' returned undefined 'updated_LIST', although no error was thrown",
        });

      // z_SET_myOneList(updated_LIST);
      // z_UPDATE_listInMyLists(updated_LIST);
      // refetch starter page state

      // -----------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      SEND_internalError(err);
    } finally {
      REMOVE_currentAction(list_ID, "recollecting_lang_ids");
    }
  }, []);

  return { UPDATE_listDefaultLangIds: _UPDATE_listDefaultLangIds };
}
