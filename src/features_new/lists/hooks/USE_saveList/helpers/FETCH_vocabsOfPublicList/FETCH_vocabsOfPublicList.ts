//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "FETCH_totalVocabsOfPublicList";

export async function FETCH_vocabsOfPublicList(
  list_id: string
): Promise<{ vocabs: Vocab_TYPE[] }> {
  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });

  try {
    const {
      data: vocabs,
      count,
      error,
    } = await supabase
      .from("vocabs")
      .select(`description,trs,searchable, lang_ids`)
      .eq("type", "public")
      .eq("list_id", list_id)
      .filter("deleted_at", "is", null);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (typeof count !== "number") {
      throw new General_ERROR({
        function_NAME,
        message: "'count' was not a number",
      });
    }
    if (!vocabs) {
      throw new General_ERROR({
        function_NAME,
        message: "'vocabs' was not a number",
      });
    }

    return { vocabs };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
