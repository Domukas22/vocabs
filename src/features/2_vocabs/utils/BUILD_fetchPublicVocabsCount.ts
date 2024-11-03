//
//
//

import { Vocabs_DB } from "@/src/db";
import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export const BUILD_fetchPublicVocabsCount = async ({
  search,
  list_ids,
  z_vocabDisplay_SETTINGS,
}: {
  search: string;
  list_ids: string[] | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
}) => {
  // Create a similar query without pagination and sorting
  let query = supabase.from("vocabs").select(`*`, { count: "exact" });

  // Apply filters (same logic as the original function)
  if (list_ids && list_ids.length > 0) {
    query = query.in("list_id", list_ids);
  }

  if (
    z_vocabDisplay_SETTINGS?.langFilters &&
    z_vocabDisplay_SETTINGS.langFilters.length > 0
  ) {
    query = query.or(
      z_vocabDisplay_SETTINGS.langFilters
        .map((lang) => `lang_ids.ilike.%${lang}%`)
        .join(",")
    );
  }

  if (search) {
    query = query.or(
      `description.ilike.%${search}%,searchable.ilike.%${search}%`
    );
  }

  return query; // Return the total count of filtered vocabs
};
