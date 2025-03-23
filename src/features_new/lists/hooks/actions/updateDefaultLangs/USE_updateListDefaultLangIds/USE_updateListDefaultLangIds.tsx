//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { UPDATE_listDefaultLangIds } from "../_UPDATE_listDefaultLangIds/UPDATE_listDefaultLangIds";
import { z_USE_myOneList } from "../../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_error, USE_loading, USE_celebrate } from "@/src/hooks";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { t } from "i18next";
import { List_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "USE_updateListDefaultLangIds";

export function USE_updateListDefaultLangIds() {
  const { z_user } = z_USE_user();
  const { loading, SET_loading } = USE_loading();
  const { error, SET_error, RESET_error } = USE_error<General_ERROR>();

  const { celebrate } = USE_celebrate();

  const _UPDATE_listDefaultLangIds = useCallback(
    async (
      list_ID: string,
      newLang_IDs: string[],
      sideEffects: { onSuccess?: () => void }
    ) => {
      const { onSuccess = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        if (loading) return;
        SET_loading(true);
        RESET_error();

        // --------------------------------------------------
        // Proceed to update
        const { updated_LIST } = await UPDATE_listDefaultLangIds(
          list_ID,
          z_user?.id || "",
          newLang_IDs
        );

        if (!updated_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_listDefaultLangIds' returned undefined 'updated_LIST', although no error was thrown",
          });

        List_EVENTS.emit("updated", updated_LIST);

        onSuccess();
        celebrate(t("notification.listDefaultLangIdsUpdated"));

        // -----------------------------
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_error(err);
        SEND_internalError(err);
      } finally {
        SET_loading(false);
      }
    },
    []
  );

  return {
    UPDATE_listDefaultLangIds: _UPDATE_listDefaultLangIds,
    error,
    loading,
    RESET_error,
  };
}
