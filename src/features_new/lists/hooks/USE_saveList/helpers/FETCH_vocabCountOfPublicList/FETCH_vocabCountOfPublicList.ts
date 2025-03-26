//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "FETCH_vocabCountOfPublicList";

export async function FETCH_vocabCountOfPublicList(
  list_id: string
): Promise<{ count: number }> {
  if (!list_id)
    throw new General_ERROR({
      function_NAME,
      message: "'list_id' was undefined",
    });

  try {
    const { count, error } = await supabase
      .from("vocabs")
      .select(`*`, { count: "exact", head: true })
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

    return { count };
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
