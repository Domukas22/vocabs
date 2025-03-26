//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { HANDLE_formInputError } from "@/src/utils";
import { t } from "i18next";

export const function_NAME = "CREATE_copiedList";

type CreateCopiedListContent_TYPE = {
  name: string;
  description: string;
  default_lang_ids: string[];
  collected_lang_ids: string[];
};

export async function CREATE_copiedList(
  list_CONTENT: CreateCopiedListContent_TYPE,
  user_id: string
): Promise<{ new_LIST: List_TYPE }> {
  const { collected_lang_ids, default_lang_ids, description, name } =
    list_CONTENT;

  if (!collected_lang_ids)
    throw new General_ERROR({
      function_NAME,
      message: "'collected_lang_ids' was undefined",
    });

  if (!default_lang_ids)
    throw new General_ERROR({
      function_NAME,
      message: "'default_lang_ids' was undefined",
    });

  if (!description)
    throw new General_ERROR({
      function_NAME,
      message: "'description' was undefined",
    });

  if (!name)
    throw new General_ERROR({
      function_NAME,
      message: "'name' was undefined",
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
      .ilike("name", name)
      .eq("user_id", user_id)
      .eq("type", "private");

    // name, dewscription, default_lang_ids, collected_lang_ids

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
            message: `Your already have a list with named '${name}'`,
          },
        ],
      });

    const { data: new_LIST, error } = await supabase
      .from("lists")
      .insert({
        user_id,
        name,
        default_lang_ids,
        collected_lang_ids,
        description,
      })
      .select(`*`)
      // .select(`*, vocabs(difficulty, is_marked), vocab_count: vocabs(count)`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { new_LIST };
  } catch (error: any) {
    HANDLE_formInputError(error);

    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
