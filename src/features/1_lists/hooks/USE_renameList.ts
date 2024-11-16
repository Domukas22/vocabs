import { useState } from "react";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import USE_error from "@/src/hooks/USE_error";
import { Error_PROPS } from "@/src/props";
import SEND_internalError from "@/src/utils/SEND_internalError";

export interface RenameList_PROPS {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
}

const defaultError_MSG =
  "Something went wrong when renaming the list. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

export default function USE_renameList() {
  const [IS_renaming, SET_renaming] = useState(false);

  const input_NAMES = ["name"] as const;
  // const input_NAMES = [...imported] as const;

  async function RENAME_list({
    new_NAME,
    list,
    user,
  }: RenameList_PROPS): Promise<{
    success: boolean;
    error?: Error_PROPS & {
      formInput_ERRORS?: {
        input_NAME: (typeof input_NAMES)[number];
        msg: string;
      }[];
    };
  }> {
    const function_NAME = "RENAME_list";

    if (!list || !list?.id) {
      await SEND_internalError({
        message: "🔴 List object undefined when renaming list 🔴",
        function_NAME,
        user_id: user?.id,
      });

      return {
        success: false,
        error: {
          msg: defaultError_MSG,
          type: "internal",
        },
      };
    }

    if (!user || !user?.id) {
      await SEND_internalError({
        message: "🔴 User object undefined when renaming list 🔴",
        function_NAME,
        user_id: user?.id,
      });

      return {
        success: false,
        error: {
          msg: defaultError_MSG,
          type: "internal",
        },
      };
    }

    if (!new_NAME) {
      return {
        success: false,
        error: {
          msg: "Please correct the errors above",
          type: "user",
          formInput_ERRORS: [
            {
              input_NAME: "name",
              msg: "Please provide a new name for the list",
            },
          ],
        },
      };
    }

    try {
      // in case it recevie sthe same name it already has
      if (new_NAME === list?.name) {
        return { success: true };
      }

      SET_renaming(true);

      // Check for duplicate list name
      const IS_listNameTaken = await user.DOES_userHaveListWithThisName(
        new_NAME
      );

      if (IS_listNameTaken) {
        return {
          success: false,
          error: {
            msg: "Please correct the errors above",
            type: "user",
            formInput_ERRORS: [
              {
                input_NAME: "name",
                msg: "You already have a list with this name",
              },
            ],
          },
        };
      }

      // Proceed with renaming
      const updated_LIST = await list.rename(new_NAME);
      if (!updated_LIST) {
        await SEND_internalError({
          message: "🔴 updated_LIST object undefined when renaming list 🔴",
          function_NAME,
          user_id: user?.id,
        });

        return {
          success: false,
          error: {
            msg: defaultError_MSG,
            type: "internal",
          },
        };
      }

      return { success: true };
    } catch (error: any) {
      await SEND_internalError({
        message: "🔴 Renaming list on WatermelonDB failed 🔴",
        function_NAME,
        details: error,
        user_id: user?.id,
      });

      return {
        success: false,
        error: {
          msg: defaultError_MSG,
          type: "internal",
        },
      };
    } finally {
      SET_renaming(false);
    }
  }

  return { RENAME_list, IS_renaming };
}
