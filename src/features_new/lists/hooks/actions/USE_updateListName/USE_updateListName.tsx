//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { t } from "i18next";
import { UPDATE_listName } from "./UPDATE_listName/UPDATE_listName";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const function_NAME = "USE_updateListName";

export function USE_updateListName() {
  const { z_user } = z_USE_user();
  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { z_SET_myOneList, z_HIGHLIGHT_myOneListName } = z_USE_myOneList();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();

  const _UPDATE_listName = useCallback(
    async (
      list_ID: string,
      new_NAME: string,
      sideEffects: {
        onSuccess?: () => void;
        onFailure?: (error: General_ERROR | FormInput_ERROR) => void;
      }
    ) => {
      const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", list_ID, "updating_name")) return;

        // --------------------------------------------------
        // Don't allow empty name
        if (!new_NAME) {
          const error = new FormInput_ERROR({
            user_MSG: t("error.correctErrorsAbove"),
            falsyForm_INPUTS: [
              { input_NAME: "name", message: t("error.provideAListName") },
            ],
          });

          onFailure(error);
          return;
        }

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("list", list_ID, "updating_name");

        // --------------------------------------------------
        // Proceed to update
        const { updated_LIST } = await UPDATE_listName(
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
        REMOVE_currentAction(list_ID, "updating_name");
      }
    },
    []
  );

  return { UPDATE_list: _UPDATE_listName };
}
