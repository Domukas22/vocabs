//
//
//

import { Vocabs_DB } from "@/src/db";
import { supabase } from "@/src/lib/supabase";
import {
  z_listDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";

export const BUILD_fetchSharedListsCount = async ({
  search,
  list_ids,
  z_listDisplay_SETTINGS,
}: {
  search: string;
  list_ids: string[] | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
}) => {
  let query = supabase.from("lists").select(
    `id,
        name,
        description,
        collected_lang_ids,
      `,
    { count: "exact" }
  );

  if (list_ids && list_ids.length > 0) {
    query = query.in("id", list_ids);
  }

  query = query.eq("type", "shared");

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (
    z_listDisplay_SETTINGS?.langFilters &&
    z_listDisplay_SETTINGS.langFilters.length > 0
  ) {
    // Assuming collected_lang_ids is a JSONB array of language strings (e.g., ["en", "de"]).
    query = query.or(
      z_listDisplay_SETTINGS.langFilters
        .map((lang) => `collected_lang_ids.ilike.%${lang}%`)
        .join(",")
    );
  }

  return query; // Return the total count of filtered vocabs
};
