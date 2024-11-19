import { useCallback, useState } from "react";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { App_ERROR, Error_PROPS } from "@/src/props";
import SEND_internalError from "@/src/utils/SEND_internalError";
import { CREATE_defaultErrorMsg } from "@/src/constants/globalVars";

export interface RenameList_PROPS {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
}

const input_NAMES = ["name"] as const;
type InputName = (typeof input_NAMES)[number];
const GET_inputName = (name: InputName) => name;

type RenameListError_PROPS = Error_PROPS & {
  formInput_ERRORS?: {
    input_NAME: InputName;
    message: string;
  }[];
};

/////////

// 🔴 TODO ==> CREATE_manualFormErrorFromDbResponse on RenameList_MODAL doesn't work 🔴

/////////

export default function USE_renameList() {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<RenameListError_PROPS | null>(null);

  const RESET_error = useCallback(() => SET_error(null), []);

  async function RENAME_list(data: RenameList_PROPS) {
    const { new_NAME, list, user } = data;

    try {
      if (new_NAME === list?.name) return { success: true };

      SET_error(null);
      SET_loading(true);

      if (!list || !list?.id) {
        throw new App_ERROR({
          message: "List object undefined when renaming list",
          type: "internal",
        });
      }

      // if (!user || !user?.id) {
      //   throw new App_ERROR({
      //     message: "User object undefined when renaming list",
      //     type: "internal",
      //   });
      // }

      if (!new_NAME) {
        throw new App_ERROR({
          message: "Please correct the errors above",
          type: "user",
          formInput_ERRORS: [
            {
              input_NAME: GET_inputName("name"),
              message: "Please provide a new name for the list",
            },
          ],
        });
      }

      const IS_listNameTaken = await user.DOES_userHaveListWithThisName(
        new_NAME
      );
      if (IS_listNameTaken) {
        throw new App_ERROR({
          message: "Please correct the errors above",
          type: "user",
          formInput_ERRORS: [
            {
              input_NAME: GET_inputName("name"),
              message: "You already have a list with this name",
            },
          ],
        });
      }

      const renamed_LIST = await list.rename(new_NAME);
      if (!renamed_LIST) {
        throw new App_ERROR({
          message:
            "renamed_LIST object returned undefined from WatermelonDB when renaming list",
          type: "internal",
        });
      }

      return { success: true };
      // -------------------------------------------------
    } catch (error: any) {
      const IS_appError = error instanceof App_ERROR;

      const userError_MESSAGE =
        IS_appError && error?.type === "internal"
          ? CREATE_defaultErrorMsg("trying to rename the list")
          : IS_appError && error?.type === "user"
          ? error.message
          : IS_appError && error?.type === "user_internet"
          ? "There seems to be a problem with your internet connection"
          : CREATE_defaultErrorMsg();

      // handle internal errors
      if (!IS_appError || (IS_appError && error?.type === "internal")) {
        await SEND_internalError({
          message: error.message,
          function_NAME: "RENAME_list",
          details: error,
        });
      }

      // handle user errors
      SET_error({
        message: userError_MESSAGE,
        type: IS_appError ? error.type : "internal",
        formInput_ERRORS: IS_appError ? error?.formInput_ERRORS : undefined,
      });

      return {
        success: false,
        message: userError_MESSAGE,
        type: IS_appError ? error.type : "internal",
        formInput_ERRORS: IS_appError ? error?.formInput_ERRORS : undefined,
      };
    } finally {
      SET_loading(false);
    }
  }

  return { RENAME_list, loading, error, RESET_error };
}
