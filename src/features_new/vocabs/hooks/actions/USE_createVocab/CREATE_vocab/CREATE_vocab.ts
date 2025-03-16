//
//
//

import { VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";

// 🔴🔴 TODO --> Finish vocab creation function

export type CreateVocab_PROPS = {
  list_id: string;
  user_id: string;
  trs: VocabTr_TYPE[];
  description: string;
  is_marked: boolean;
};

export const function_NAME = "CREATE_vocab";

export async function CREATE_vocab(props: CreateVocab_PROPS): Promise<void> {
  const { description = "", is_marked, list_id, trs, user_id } = props;

  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  if (!trs)
    throw new General_ERROR({
      function_NAME,
      message: "'trs' was undefined",
    });

  if (typeof is_marked !== "boolean")
    throw new General_ERROR({
      function_NAME,
      message: "'is_marked' was not a boolean",
    });

  if (!list_id)
    throw new FormInput_ERROR({
      user_MSG: "Please correct the errors above",
      falsyForm_INPUTS: [
        { input_NAME: "list_id", message: "Please select a list" },
      ],
    });

  trs.forEach((tr) => {
    if (!tr.text)
      throw new FormInput_ERROR({
        user_MSG: "Please correct the errors above",
        falsyForm_INPUTS: [
          { input_NAME: tr.lang_id, message: "Please provide a translation" },
        ],
      });
  });

  const searchable = trs.map((tr) => tr.text).join(",") + description;

  try {
    const { error } = await supabase
      .from("vocabs")
      .insert({
        saved_count: 0,
        type: "private",
        lang_ids: trs.map((tr) => tr.lang_id),
        list_id,
        description,
        difficulty: 3,
        trs,
        searchable,
        user_id,
        is_marked,
      });
    // 🔴 left off here 🔴

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
