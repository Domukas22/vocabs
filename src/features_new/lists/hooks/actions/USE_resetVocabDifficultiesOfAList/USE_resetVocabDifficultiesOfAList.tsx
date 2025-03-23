//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback, useState } from "react";
import { RESET_allDifficultiesOfAList } from "./RESET_allDifficultiesOfAList/RESET_allDifficultiesOfAList";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { t } from "i18next";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { List_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "USE_resetVocabDifficultiesOfAList";

export function USE_resetVocabDifficultiesOfAList() {
  const { z_user } = z_USE_user();

  const [loading, SET_isResettingAllListDifficulties] = useState(false);
  const [error, SET_resetAllListDifficulties] = useState<
    General_ERROR | undefined
  >();

  const RESET_hookError = useCallback(
    () => SET_resetAllListDifficulties(undefined),
    [SET_resetAllListDifficulties]
  );

  const { z_SET_myOneList } = z_USE_myOneList();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();

  const { TOAST } = USE_toast();

  const { REFETCH_myStarterContent } = USE_refetchStarterContent();

  const _RESET_allDifficultiesOfAList = useCallback(
    async (
      list_ID: string,
      sideEffects: {
        onSuccess?: () => void;
      }
    ) => {
      const { onSuccess = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action

        if (loading) return;

        SET_isResettingAllListDifficulties(true);
        RESET_hookError();

        // --------------------------------------------------
        // Proceed to reset vocab difficulties
        const { updated_LIST } = await RESET_allDifficultiesOfAList(
          list_ID,
          z_user?.id || ""
        );

        if (!updated_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'RESET_allDifficultiesOfAList' returned undefined 'updated_LIST', although no error was thrown",
          });

        z_SET_myOneList(updated_LIST);
        // z_UPDATE_listInMyLists(updated_LIST);
        List_EVENTS.emit("updated", updated_LIST);
        onSuccess();

        TOAST("success", t("notification.vocabDifficultiesOfAListReset"));
        VIBRATE("soft");

        // -----------------------------
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_resetAllListDifficulties(err);
        SEND_internalError(err);
      } finally {
        SET_isResettingAllListDifficulties(false);
      }
    },
    []
  );

  return {
    RESET_allDifficultiesOfAList: _RESET_allDifficultiesOfAList,
    loading: loading,
    db_ERROR: error,
  };
}
