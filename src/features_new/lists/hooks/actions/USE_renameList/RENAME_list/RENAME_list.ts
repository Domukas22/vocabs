//
//
//

import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { List_TYPE } from "@/src/features_new/lists/types";
import { t } from "i18next";
import { IS_aFormInputError } from "@/src/utils";

export const function_NAME = "RENAME_list";

export async function RENAME_list(
  list_id: string,
  user_id: string,
  new_NAME: string
): Promise<{ updated_LIST: List_TYPE }> {
  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });
  if (!new_NAME)
    throw new FormInput_ERROR({
      user_MSG: "Please correct the error above",
      falsyForm_INPUTS: [
        { input_NAME: "name", message: t("error.provideAListName") },
      ],
    });

  try {
    // Check if a list with the new name already exists for the user
    const { count, error: checkError } = await supabase
      .from("lists_extended")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .ilike("name", new_NAME);

    if (checkError)
      throw new General_ERROR({
        function_NAME,
        message: checkError.message,
        errorToSpread: checkError,
      });

    if (count)
      throw new FormInput_ERROR({
        user_MSG: t("error.correctErrorsAbove"),
        falsyForm_INPUTS: [
          {
            input_NAME: "name",
            message: `${t("error.listNameExists")} '${new_NAME}'`,
          },
        ],
      });
    const { data: list, error } = await supabase
      .from("lists_extended")
      .update({ name: new_NAME, updated_at: new Date().toISOString() })
      .eq("id", list_id)
      .eq("user_id", user_id)
      .select(`*`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { updated_LIST: list };
  } catch (error: any) {
    if (IS_aFormInputError(error)) throw error;
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
