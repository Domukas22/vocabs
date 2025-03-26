//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "CAN_userCreateThisAmountOfVocabs";

export async function CAN_userCreateThisAmountOfVocabs(
  user_id: string,
  toAddVocab_COUNT: number
): Promise<{ allow: boolean; max_vocabs: number }> {
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });
  if (typeof toAddVocab_COUNT !== "number")
    throw new General_ERROR({
      function_NAME,
      message: "'toAddVocab_COUNT' was not a number",
    });

  try {
    // get user total vocab count
    const { count: currentUserVocab_COUNT, error: vocabCount_ERR } =
      await supabase
        .from("vocabs")
        .select(`*`, { count: "exact", head: true })
        .filter("deleted_at", "is", null)
        .filter("user_id", "eq", user_id);

    if (vocabCount_ERR)
      throw new General_ERROR({
        function_NAME,
        message: vocabCount_ERR.message,
        errorToSpread: vocabCount_ERR,
      });

    if (typeof currentUserVocab_COUNT !== "number") {
      throw new General_ERROR({
        function_NAME,
        message: "'currentUserVocab_COUNT' was not a number",
      });
    }

    // ----------------------------------------------

    // get max vocabs allowed for the user
    const { data, error } = await supabase
      .from("users")
      .select(`max_vocabs`)
      .filter("id", "eq", user_id)
      .single();

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (!data || typeof data?.max_vocabs !== "number") {
      throw new General_ERROR({
        function_NAME,
        message: "'data.max_vocabs' was not a number",
      });
    }

    const maxVocab_COUNT = data?.max_vocabs;
    const futureVocab_COUNT = currentUserVocab_COUNT + toAddVocab_COUNT;

    const CAN_userSaveOneMoreVocab = maxVocab_COUNT >= futureVocab_COUNT;

    return { allow: CAN_userSaveOneMoreVocab, max_vocabs: maxVocab_COUNT };
    // ------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
