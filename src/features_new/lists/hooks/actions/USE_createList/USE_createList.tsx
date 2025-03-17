//
//
//

import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import {
  HANDLE_formInputError,
  SEND_internalError,
  VIBRATE,
} from "@/src/utils";
import { useCallback, useState } from "react";
import { CREATE_list } from "./CREATE_list/CREATE_list";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { t } from "i18next";
import { TOAST_FN_TYPE, USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { List_TYPE } from "../../../types";
import { useToast } from "react-native-toast-notifications";

const function_NAME = "USE_createList";

export function USE_createList() {
  const { z_user } = z_USE_user();

  const { z_PREPEND_listToMyLists, z_HIGHLIGHT_myList } = z_USE_myLists();
  const { REFETCH_myStarterContent = () => {} } = USE_refetchStarterContent();

  const [IS_creatingList, SET_isCreatingList] = useState(false);
  const [createList_ERROR, SET_createListError] = useState<
    General_ERROR | FormInput_ERROR | undefined
  >();

  const { TOAST } = USE_toast();

  const RESET_hookError = useCallback(
    () => SET_createListError(undefined),
    [SET_createListError]
  );

  const _CREATE_list = useCallback(
    async (list_NAME: string, onSuccess: () => void) => {
      try {
        if (!list_NAME)
          throw new FormInput_ERROR({
            user_MSG: "Please correct the errors above",
            falsyForm_INPUTS: [
              { input_NAME: "name", message: "Please provide a list name" },
            ],
          });
        SET_isCreatingList(true);
        SET_createListError(undefined);

        // --------------------------------------------------
        // Create thelist
        const { new_LIST } = await CREATE_list(list_NAME, z_user?.id || "");

        if (!new_LIST)
          throw new General_ERROR({
            function_NAME,
            message:
              "'CREATE_list' returned undefined 'new_LIST', although no error was thrown",
          });

        // --------------------------------------------------
        // Insert new list into the UI
        z_PREPEND_listToMyLists(new_LIST);

        // Refetch starter page content
        await REFETCH_myStarterContent();

        // Provide sensory user feedback
        TOAST("success", t("notification.listCreated"));
        VIBRATE("soft");
        z_HIGHLIGHT_myList(new_LIST.id);

        onSuccess();
        // -----------------------------
      } catch (error: any) {
        if (HANDLE_formInputError(error)) {
          SET_createListError(error);
          return;
        }

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_createListError(err);
        SEND_internalError(err);
      } finally {
        SET_isCreatingList(false);
      }
    },
    []
  );

  return {
    CREATE_list: _CREATE_list,
    IS_creatingList,
    createList_ERROR,
    RESET_hookError,
  };
}
