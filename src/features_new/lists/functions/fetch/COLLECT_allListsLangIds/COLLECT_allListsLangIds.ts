//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import {
  COLLECT_allMyListsLangIds_ARGS,
  COLLECT_allMyListsLangIds_RESPONSE_TYPE,
} from "./types";
import { FORMAT_rawColelctedLangIds } from "./helpers";

export const function_NAME = "COLLECT_allMyListsLangIds";

export async function COLLECT_allListsLangIds(
  args: COLLECT_allMyListsLangIds_ARGS
): Promise<COLLECT_allMyListsLangIds_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    if (!args?.type)
      throw new General_ERROR({
        message: "'type' was undefined",
        function_NAME,
      });
    if (args?.type === "private" && !args?.user_id)
      throw new General_ERROR({
        message: "'user_id' was undefined",
        function_NAME,
      });

    // Fetch the collected lang ids
    let { data: rawCollectedLang_IDs, error } =
      args?.type === "private"
        ? await supabase
            .from("lists")
            .select(`collected_lang_ids`)
            .eq("type", "private")
            .eq("user_id", args?.user_id)
            .abortSignal(args?.signal)
        : await supabase
            .from("lists")
            .select(`collected_lang_ids`)
            .eq("type", "public")
            .abortSignal(args?.signal);

    if (error)
      throw new General_ERROR({
        message: error?.message,
        function_NAME,
        errorToSpread: error,
      });

    // ---------------------------------------------------
    // Transform results into more digestable format
    const { lang_IDs } = FORMAT_rawColelctedLangIds(rawCollectedLang_IDs);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { collectedLang_IDs: lang_IDs };

    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
