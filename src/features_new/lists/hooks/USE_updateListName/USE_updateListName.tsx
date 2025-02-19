//
//
//

import { z_USE_currentActions } from "@/src/hooks/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { t } from "i18next";
import { UPDATE_listName } from "./UPDATE_listName/UPDATE_listName";

const function_NAME = "USE_updateListName";

export function USE_updateListName() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const _UPDATE_listName = useCallback(
    async (
      item_ID: string,
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
        if (IS_inAction("list", item_ID)) return;

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
        ADD_currentAction("list", item_ID, "updating_name");

        // --------------------------------------------------
        // Proceed to update
        const { updated_LIST } = await UPDATE_listName(
          item_ID,
          z_user?.id || "",
          new_NAME
        );

        if (!updated_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'UPDATE_listName' returned undefined 'updated_LIST', although no error was thrown",
          });

        // refetch starter page state
        // update one list
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

  return { UPDATE_list: _UPDATE_listName };
}
