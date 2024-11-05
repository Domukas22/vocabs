import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_ids: string[] | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  start?: number;
  end?: number;
  signal: AbortSignal;
}

export default async function FETCH_supabaseVocabs({
  search,
  list_ids = [],
  z_vocabDisplay_SETTINGS,
  start = 0,
  end = 10,
  signal,
}: VocabFilter_PROPS) {
  let query = supabase
    .from("vocabs")
    .select(
      `
    id, difficulty, description, trs, searchable, lang_ids, is_marked, user_id,
    list:lists (
      id,
      name
    )
  `,
      { count: "exact" }
    )
    .in("list_id", list_ids);

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

  switch (z_vocabDisplay_SETTINGS?.sorting) {
    case "date":
      query = query.order("created_at", {
        ascending: z_vocabDisplay_SETTINGS.sortDirection === "ascending",
      });
      break;
  }

  query = query.range(start, end - 1);

  const { data, error, count } = await query.abortSignal(signal);

  return {
    vocabs: data || [],
    count: count || 0,
    error: {
      value: error ? true : false,
      msg: error ? "An error as occured while loading the vocabs" : "",
    },
  };
}
