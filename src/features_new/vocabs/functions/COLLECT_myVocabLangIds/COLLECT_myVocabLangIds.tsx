//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import { vocabFetch_TYPES } from "../FETCH_vocabs/types";

export type COLLECT_myVocabLangIds_RAW_RESPONSE_TYPE =
  | {
      collected_lang_ids: string[];
    }[]
  | null;

export type COLLECT_myVocabLangIds_RESPONSE_TYPE = {
  collectedLang_IDs: string[];
};

type props = {
  user_ID: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID: string;
};

export const function_NAME = "COLLECT_myVocabLangIds";

export async function COLLECT_myVocabLangIds(args: props) {
  const { user_ID = "", fetch_TYPE = "all", targetList_ID = "" } = args;

  try {
    // Validate arguments before building query
    if (!fetch_TYPE)
      throw new General_ERROR({
        message: "'fetch_TYPE' was undefined",
        function_NAME,
      });

    if (!user_ID)
      throw new General_ERROR({
        message: "'user_id' was undefined",
        function_NAME,
      });

    if (fetch_TYPE === "byTargetList" && !targetList_ID)
      throw new General_ERROR({
        message: "'targetList_ID' was undefined when fetching by target list",
        function_NAME,
      });

    let query = supabase
      .from("vocabs")
      .select(`lang_ids`)
      .eq("type", "private")
      .eq("user_id", user_ID);

    // fetch by target list
    if (fetch_TYPE === "byTargetList") {
      query = query.eq("list_id", targetList_ID);
    }

    // fetch by marked
    if (fetch_TYPE === "marked") {
      query = query.eq("is_marked", true);
    }

    // handle deleted property
    if (fetch_TYPE === "deleted") {
      query = query.filter("deleted_at", "not.is", null);
    } else {
      query = query.filter("deleted_at", "is", null);
    }

    // // Fetch the collected lang ids
    const { data: rawCollectedLang_IDs, error } = await query;

    if (error)
      throw new General_ERROR({
        message: error?.message,
        function_NAME,
        errorToSpread: error,
      });

    // Transform results into more digestable format
    const { lang_IDs } = FORMAT_rawColelctedLangIds(rawCollectedLang_IDs);

    // Return valid data if fetch was successful
    return { lang_IDs };

    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}

export function FORMAT_rawColelctedLangIds(
  rawLang_IDs:
    | {
        lang_ids: string[];
      }[]
    | null
): {
  lang_IDs: string[];
} {
  if (!rawLang_IDs) return { lang_IDs: [] };

  const lang_IDs = Array.from(
    new Set(rawLang_IDs.flatMap((item) => item.lang_ids))
  );

  return { lang_IDs };
}
