//
//
//

import { supabase } from "@/src/lib/supabase";
import { General_ERROR } from "@/src/types/error_TYPES";

const function_NAME = "COPY_vocabsOfAPublicList";

// -----------------------------------
export async function COPY_vocabsOfAPublicList({
  oldList_id,
  newList_id,
  user_id,
}: {
  oldList_id: string;
  newList_id: string;
  user_id: string;
}) {
  if (!newList_id)
    throw new General_ERROR({
      function_NAME,
      message: "'newList_id' was undefined",
    });
  if (!oldList_id)
    throw new General_ERROR({
      function_NAME,
      message: "'oldList_id' was undefined",
    });
  if (!user_id)
    throw new General_ERROR({
      function_NAME,
      message: "'user_id' was undefined",
    });

  try {
    // fetch the public vocabs
    const { data: public_VOCABS, error } = await supabase
      .from("vocabs")
      .select(`description,trs,searchable,lang_ids`)
      .eq("type", "public")
      .eq("list_id", oldList_id)
      .filter("deleted_at", "is", null);

    if (error)
      throw new General_ERROR({
        function_NAME,
        message: error.message,
        errorToSpread: error,
      });

    if (!public_VOCABS) {
      throw new General_ERROR({
        function_NAME,
        message: "'public_VOCABS' was not a number",
      });
    }

    const new_VOCABS = public_VOCABS.map((v) => ({
      ...v,
      type: "private",
      user_id,
      difficulty: 3,
      list_id: newList_id,
      is_marked: false,
      saved_count: 0,
    }));

    // insert new vocabs
    const { data, error: createNewVocabs_ERROR } = await supabase
      .from("vocabs")
      .insert(new_VOCABS)
      .select();

    console.log("Old vocabs: ", public_VOCABS);
    console.log("New vocabs: ", data);

    if (createNewVocabs_ERROR) {
      throw new General_ERROR({
        function_NAME,
        message: "Creating new vocabs didin't work",
      });
    }
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME,
      message: error.message,
      errorToSpread: error,
    });
  }
}
