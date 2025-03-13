//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "COLLECT_allPublicVocabLangIds";

export async function COLLECT_allPublicVocabLangIds() {
  try {
    const { data, error } = await supabase
      .from("public_vocab_lang_ids") // Treat it like a table
      .select("lang_id");

    // Transform results into more digestable format
    // const { lang_IDs } = FORMAT_rawColelctedLangIds(rawCollectedLang_IDs);

    // Return valid data if fetch was successful
    // return { lang_IDs };

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
