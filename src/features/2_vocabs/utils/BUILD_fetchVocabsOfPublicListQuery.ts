import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  start?: number; // New parameter for start index
  end?: number; // New parameter for end index
  fetchedIds?: Set<string>; // New parameter to track fetched IDs
}

export const BUILD_fetchVocabsOfPublicListQuery = ({
  search,
  list_id,
  z_vocabDisplay_SETTINGS,
  start = 0, // Default start index
  end = 10, // Default end index (can be overridden)
  fetchedIds = new Set(), // Initialize with a new Set if not provided
}: VocabFilter_PROPS) => {
  // Start with a base query
  let query = supabase.from("vocabs").select("*");

  // Add filtering for list_id
  if (list_id) {
    query = query.eq("list_id", list_id);
  }

  // Apply language filters if present
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

  // Apply search filters if present
  if (search) {
    query = query.or(
      `description.ilike.%${search}%,searchable.ilike.%${search}%`
    );
  }

  // Handle fetching random vocabs that have not been fetched before
  // if (z_vocabDisplay_SETTINGS?.sorting === "shuffle") {
  //   const excludeIds = Array.from(fetchedIds).join(","); // Convert Set to a comma-separated string
  //   query = query.not("id", "in", `(${excludeIds})`); // Exclude already fetched IDs
  //   query = query.order("RANDOM"); // Shuffle vocabs
  // }

  // Handle sorting based on the provided display settings
  switch (z_vocabDisplay_SETTINGS?.sorting) {
    case "date":
      query = query.order("created_at", {
        ascending: z_vocabDisplay_SETTINGS.sortDirection === "ascending",
      });
      break;
    // case "shuffle":
    //   // This will already be handled above
    //   break;
  }

  // Limit the results based on start and end values
  query = query.range(start, end - 1); // Supabase uses zero-based indexing for range

  return query;
};
