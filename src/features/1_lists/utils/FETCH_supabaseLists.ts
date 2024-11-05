import { supabase } from "@/src/lib/supabase";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";

export interface ListFilter_PROPS {
  search?: string;
  list_ids?: string[] | null;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  start?: number; // New parameter for start index
  end?: number; // New parameter for end index
  signal: AbortSignal;
  type: "public" | "shared";
}
export interface ListFilterCount_PROPS {
  search?: string;
  list_ids: string[];
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
}

export default async function FETCH_supabaseLists({
  search,
  list_ids,
  z_listDisplay_SETTINGS,
  start = 0,
  end = 10,
  signal,
  type,
}: ListFilter_PROPS) {
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

  switch (type) {
    case "public":
      query = query.eq("type", "public");
      break;
    case "shared":
      if (!list_ids) {
        console.error(
          "🔴 Tried to fetch shared lists, but the allowed list ids are null 🔴"
        );
        return {
          lists: [],
          count: 0,
          error: {
            value: true,
            msg: "An error as occured while loading the lists",
          },
        };
      }

      if (list_ids.length > 0) {
        query = query.in("id", list_ids);
      }

      query = query.eq("type", "shared");
      break;
    default:
      console.error(
        `🔴 Tried to fetch supabase lists, but the argument 'type' is '${type}' 🔴`
      );
      return {
        lists: [],
        count: 0,
        error: {
          value: true,
          msg: "An error as occured while loading the lists",
        },
      };
  }

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

  // -----------------------------------------------------------

  const { data, error, count } = await query.abortSignal(signal);

  return {
    lists: data || [],
    count: count || 0,
    // error: {
    //   value: true,
    //   msg: "An error as occured while loading shared lists",
    // },
    error: {
      value: error ? true : false,
      msg: error ? "An error as occured while loading shared lists" : "",
    },
  };
}
