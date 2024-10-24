import { supabase } from "@/src/lib/supabase";
import { DisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string | undefined;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
}

export const BUILD_fetchVocabsOfPublicListQuery = ({
  search,
  list_id,
  z_display_SETTINGS,
}: VocabFilter_PROPS) => {
  // Start with a base query
  let query = supabase.from("vocabs").select("*");

  // Add filtering for list_id
  if (list_id) {
    query = query.eq("list_id", list_id);
  }

  // Apply language filters if present
  if (
    z_display_SETTINGS?.langFilters &&
    z_display_SETTINGS?.langFilters.length > 0
  ) {
    query = query.or(
      z_display_SETTINGS.langFilters
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

  // Handle sorting based on the provided display settings
  switch (z_display_SETTINGS?.sorting) {
    case "date":
      query = query.order("created_at", {
        ascending: z_display_SETTINGS.sortDirection === "ascending",
      });
      break;
    case "shuffle":
      // Shuffling is not natively supported, should be handled on the frontend if needed
      break;
  }

  return query;
};
