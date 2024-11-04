import { supabase } from "@/src/lib/supabase";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";

export interface ListFilter_PROPS {
  search?: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  start?: number; // New parameter for start index
  end?: number; // New parameter for end index
}

export const BUILD_fetchPublicListsQuery = ({
  search,
  z_listDisplay_SETTINGS,
  start = 0, // Default start index
  end = 10, // Default end index (can be overridden)
}: ListFilter_PROPS) => {
  // Start with a base query for fetching public lists
  let query = supabase.from("lists").select(
    `
        id,
        name,
        description,
        collected_lang_ids,
        owner:users!lists_2_user_id_fkey(username),
        vocabs(count)
      `,
    { count: "exact" }
  );

  // Add filtering for public lists
  query = query.eq("type", "public");

  // Apply search filters if present
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

  // Handle sorting based on the provided display settings
  switch (z_listDisplay_SETTINGS?.sorting) {
    case "date":
      query = query.order("created_at", {
        ascending: z_listDisplay_SETTINGS.sortDirection === "ascending",
      });
      break;
    default:
      // If an unrecognized sorting option is provided, use a default column
      query = query.order("created_at", { ascending: false }); // Default to sorting by latest
      break;
  }

  // Limit the results based on start and end values
  query = query.range(start, end - 1); // Supabase uses zero-based indexing for range

  return query;
};
