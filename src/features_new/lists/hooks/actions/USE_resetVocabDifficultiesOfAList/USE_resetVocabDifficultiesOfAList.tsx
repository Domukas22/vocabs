//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { t } from "i18next";
import { RESET_allDifficultiesOfAList } from "./RESET_allDifficultiesOfAList/RESET_allDifficultiesOfAList";
import { z_USE_myOneList } from "../../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";

const function_NAME = "USE_resetVocabDifficultiesOfAList";

export function USE_resetVocabDifficultiesOfAList() {
  const { z_user } = USE_zustand();

  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { z_SET_myOneList } = z_USE_myOneList();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();

  const _RESET_allDifficultiesOfAList = useCallback(
    async (
      list_ID: string,
      new_NAME: string,
      sideEffects: {
        onSuccess?: () => void;
        onFailure?: (error: General_ERROR) => void;
      }
    ) => {
      const { onSuccess = () => {}, onFailure = () => {} } = sideEffects;

      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", list_ID)) return;

        // --------------------------------------------------
        // Insert action
        ADD_currentAction("list", list_ID, "resetting_difficulties");

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
        z_UPDATE_listInMyLists(updated_LIST);
        // refetch starter page state
        // refetch current private vocabs

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
        REMOVE_currentAction(list_ID);
      }
    },
    []
  );

  return { RESET_allDifficultiesOfAList: _RESET_allDifficultiesOfAList };
}
