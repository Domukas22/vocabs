//
//
//

import { Vocab_TYPE, VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";

export type SaveVocabDefault_PROPS = {
  user_id: string | undefined;
};

export type SaveVocabUserContent_PROPS = {
  list_id: string | undefined;
  vocab: Vocab_TYPE;
};

export type SaveVocab_PROPS = SaveVocabDefault_PROPS &
  SaveVocabUserContent_PROPS;

export const function_NAME = "SAVE_vocab";

export async function SAVE_vocab(
  props: SaveVocab_PROPS
): Promise<{ saved_VOCAB: Vocab_TYPE }> {
  const { list_id, user_id, vocab } = props;

  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  if (!vocab)
    throw new General_ERROR({
      function_NAME,
      message: "'vocab' was undefined",
    });

  // if list is not selected, throw input error
  if (!list_id)
    throw new FormInput_ERROR({
      user_MSG: "Please correct the errors above",
      falsyForm_INPUTS: [
        { input_NAME: "list_id", message: "Please select a list" },
      ],
    });

  const { description, trs, searchable, lang_ids } = vocab;

  try {
    const { data: saved_VOCAB, error } = await supabase
      .from("vocabs")
      .insert({
        description,
        trs,
        searchable,
        lang_ids,

        list_id,
        user_id,

        difficulty: 3,
        is_marked: false,
        saved_count: 0,
        type: "private",
      })
      .select(`*, list:lists (id,name)`)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    return { saved_VOCAB };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
