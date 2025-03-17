//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { HANDLE_formInputError } from "@/src/utils";
import { t } from "i18next";

export const function_NAME = "CREATE_list";

export async function CREATE_list(
  list_NAME: string,
  user_id: string
): Promise<{ new_LIST: List_TYPE }> {
  if (!list_NAME)
    throw new FormInput_ERROR({
      user_MSG: "Please correct the error above",
      falsyForm_INPUTS: [
        { input_NAME: "name", message: t("error.provideAListName") },
      ],
    });
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    // Check if the user already has a list with that name
    const { count, error: listwithSameName_ERROR } = await supabase
      .from("lists")
      .select("*", { count: "exact", head: true })
      .ilike("name", list_NAME)
      .eq("user_id", user_id)
      .eq("type", "private");

    if (listwithSameName_ERROR)
      throw new General_ERROR({
        function_NAME,
        message: listwithSameName_ERROR.message,
        errorToSpread: listwithSameName_ERROR,
      });

    // Is there altelast one list with this name?
    if (count)
      throw new FormInput_ERROR({
        user_MSG: "Please correct the error above",
        falsyForm_INPUTS: [
          {
            input_NAME: "name",
            message: `Your already have a list with named '${list_NAME}'`,
          },
        ],
      });

    const { data: new_LIST, error } = await supabase
      .from("lists")
      .insert({ user_id, name: list_NAME })
      .select(`*, vocabs(difficulty, is_marked), vocab_count: vocabs(count)`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { new_LIST };

    // Then delete the list
  } catch (error: any) {
    HANDLE_formInputError(error);

    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
