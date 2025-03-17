//
//
//

import { Vocab_TYPE, VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";

export type CreateVocabDefault_PROPS = {
  user_id: string | undefined;
};

export type CreateVocabUserContent_PROPS = {
  list_id: string | undefined;
  trs: VocabTr_TYPE[];
  description: string;
  is_marked: boolean;
  difficulty: 1 | 2 | 3;
};

export type CreateVocab_PROPS = CreateVocabDefault_PROPS &
  CreateVocabUserContent_PROPS;

export const function_NAME = "CREATE_oneVocab";

export async function CREATE_oneVocab(
  props: CreateVocab_PROPS
): Promise<{ new_VOCAB: Vocab_TYPE }> {
  const {
    description = "",
    is_marked,
    list_id,
    trs,
    user_id,
    difficulty,
  } = props;

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

  if (!difficulty)
    throw new General_ERROR({
      function_NAME,
      message: "'difficulty' was undefined",
    });

  if (typeof is_marked !== "boolean")
    throw new General_ERROR({
      function_NAME,
      message: "'is_marked' was not a boolean",
    });

  // if list is not selected, throw input error
  if (!list_id)
    throw new FormInput_ERROR({
      user_MSG: "Please correct the errors above",
      falsyForm_INPUTS: [
        { input_NAME: "list_id", message: "Please select a list" },
      ],
    });

  // In any translation is empty, throw input error
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
    const { data: new_VOCAB, error } = await supabase
      .from("vocabs")
      .insert({
        saved_count: 0,
        type: "private",
        lang_ids: trs.map((tr) => tr.lang_id),
        list_id,
        description,
        difficulty,
        trs,
        searchable,
        user_id,
        is_marked,
      })
      .select(`*, list:lists (id,name)`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { new_VOCAB };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
