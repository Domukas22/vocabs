//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { IS_aFormInputError, SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback, useState } from "react";
import { t } from "i18next";
import { RENAME_list } from "./RENAME_list/RENAME_list";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { USE_updateListUpdatedAt } from "../USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";

const function_NAME = "USE_renameList";

export function USE_renameList() {
  const { z_user } = z_USE_user();

  const { TOAST } = USE_toast();

  const { z_SET_myOneList, z_HIGHLIGHT_myOneListName } = z_USE_myOneList();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();
  const { REFETCH_myStarterContent } = USE_refetchStarterContent();

  const [IS_renamingList, SET_isRenamingList] = useState(false);
  const [renameList_ERROR, SET_renameListError] = useState<
    General_ERROR | FormInput_ERROR | undefined
  >();

  const RESET_hookError = useCallback(
    () => SET_renameListError(undefined),
    [SET_renameListError]
  );

  const _RENAME_list = useCallback(
    async (
      list_ID: string,
      new_NAME: string,
      sideEffects: {
        onSuccess?: () => void;
      }
    ) => {
      const { onSuccess = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_renamingList) return;

        // --------------------------------------------------
        // Don't allow empty name
        if (!new_NAME) {
          throw new FormInput_ERROR({
            user_MSG: t("error.correctErrorsAbove"),
            falsyForm_INPUTS: [
              { input_NAME: "name", message: t("error.provideAListName") },
            ],
          });
        }

        SET_isRenamingList(true);
        RESET_hookError();

        // --------------------------------------------------
        // Proceed to update
        const { updated_LIST } = await RENAME_list(
          list_ID,
          z_user?.id || "",
          new_NAME
        );

        if (!updated_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_listName' returned undefined 'updated_LIST', although no error was thrown",
          });

        z_SET_myOneList(updated_LIST);
        z_HIGHLIGHT_myOneListName();
        z_UPDATE_listInMyLists(updated_LIST);

        // refetch starter page state

        onSuccess();
        TOAST("success", t("notification.listRenamed"));
        VIBRATE("soft");

        // Update starter page
        await REFETCH_myStarterContent();
        // -----------------------------
      } catch (error: any) {
        if (IS_aFormInputError(error)) {
          SET_renameListError(error);
          return;
        }

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_renameListError(err);
        SEND_internalError(err);
      } finally {
        SET_isRenamingList(false);
      }
    },
    []
  );

  return {
    RENAME_list: _RENAME_list,
    IS_renamingList,
    renameList_ERROR,
    RESET_hookError,
  };
}
