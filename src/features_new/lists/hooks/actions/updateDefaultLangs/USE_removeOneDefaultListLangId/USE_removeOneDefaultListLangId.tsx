//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback, useState } from "react";
import { z_USE_myOneList } from "../../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_error, USE_loading, USE_celebrate } from "@/src/hooks";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { t } from "i18next";
import { UPDATE_listDefaultLangIds } from "../_UPDATE_listDefaultLangIds/UPDATE_listDefaultLangIds";
import { List_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "USE_removeOneDefaultListLangId";

// 🔴🔴 TODO --> removing one language doesnt work for some reason. Find the bug, inspect the removal function itself.

export function USE_removeOneDefaultListLangId() {
  const { loading, SET_loading } = USE_loading();
  const { error, SET_error, RESET_error } = USE_error<General_ERROR>();
  const [currentlyBeingRemovedLang_ID, SET_currentlyBeingRemovedLangId] =
    useState("");

  const { z_user } = z_USE_user();
  const { z_SET_myOneList, z_myOneList } = z_USE_myOneList();
  const { REFETCH_myStarterContent } = USE_refetchStarterContent();
  const { celebrate } = USE_celebrate();

  const _REMOVE_oneDefaultListLangId = useCallback(
    async (
      list_ID: string,
      lang_ID: string,
      sideEffects: { onSuccess?: () => void }
    ) => {
      const { onSuccess = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        if (loading) return;
        SET_loading(true);
        RESET_error();
        SET_currentlyBeingRemovedLangId(lang_ID);

        const newLangs =
          z_myOneList?.default_lang_ids?.filter(
            (lang_id) => lang_id !== lang_ID
          ) || [];

        // --------------------------------------------------
        // Proceed to update
        const { updated_LIST } = await UPDATE_listDefaultLangIds(
          list_ID,
          z_user?.id || "",
          newLangs
        );

        if (!updated_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_listDefaultLangIds' returned undefined 'updated_LIST', although no error was thrown",
          });

        List_EVENTS.emit("updated", updated_LIST);

        onSuccess();

        celebrate(t("notification.oneDefaultListLangRemoved"));

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
        SET_currentlyBeingRemovedLangId("");
      }
    },
    [z_myOneList, loading]
  );

  return {
    error,
    loading,
    currentlyBeingRemovedLang_ID,

    REMOVE_oneDefaultListLangId: _REMOVE_oneDefaultListLangId,
  };
}
