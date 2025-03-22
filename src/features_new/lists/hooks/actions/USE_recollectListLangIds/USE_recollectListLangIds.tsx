//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { useCallback } from "react";
import { RECOLLECT_listLangIds } from "./RECOLLECT_listLangIds/RECOLLECT_listLangIds";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const function_NAME = "USE_recollectListCollectedLangIds";

export function USE_recollectListLangIds() {
  const { z_user } = z_USE_user();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const _RECOLLECT_listCollectedLangIds = useCallback(
    async (list_ID: string) => {
      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", list_ID, "recollecting_lang_ids")) return {};

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

        // -----------------------------
      } catch (error: any) {
        throw new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });
      } finally {
        REMOVE_currentAction(list_ID, "recollecting_lang_ids");
      }
    },
    []
  );

  return { RECOLLECT_listCollectedLangIds: _RECOLLECT_listCollectedLangIds };
}
