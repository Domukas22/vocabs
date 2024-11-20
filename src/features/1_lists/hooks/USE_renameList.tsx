//
//
//
import { useState, useCallback } from "react";
import RENAME_list, { RenameList_ARGS, RenameList_ERROR } from "./RENAME_list";
import { UseFormSetError } from "react-hook-form";
import { Keyboard } from "react-native";
import { CREATE_manualFormErrorFromDbResponse } from "@/src/utils/CREATE_manualFormErrorFromDbResponse";

type UseRenameList_PROPS = {
  SET_formError: UseFormSetError<{
    name: string;
  }>;
  onSuccess: () => void;
};

// Custom Hook for renaming list
export function USE_renameList({
  SET_formError,
  onSuccess = () => {},
}: UseRenameList_PROPS) {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<RenameList_ERROR | undefined>(undefined);

  const RESET_backendErrors = useCallback(() => {
    SET_error(undefined);
  }, []);

  const memoizedOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const memoizedOnError = useCallback((error?: RenameList_ERROR) => {
    SET_error(error);
    if (error?.type !== "form_input") {
      Keyboard.dismiss();
    } else {
      CREATE_manualFormErrorFromDbResponse({
        formInput_ERRORS: error?.formInput_ERRORS,
        SET_formError,
      });
    }
  }, []);

  const execute = useCallback(
    async ({ list, user, new_NAME }: RenameList_ARGS) => {
      if (loading) return;

      SET_loading(true);
      SET_error(undefined);

      const { success, error } = await RENAME_list({
        list,
        user,
        new_NAME,
      });

      if (success) memoizedOnSuccess();
      if (error) memoizedOnError(error);

      SET_loading(false);
    },
    []
  );

  return { loading, error, execute, RESET_backendErrors };
}
