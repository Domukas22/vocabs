//
//
//

import { supabase } from "@/src/lib/supabase";

export interface VocabFilter_PROPS {
  filter?: {
    list_id: string;
    id?: string;
    has_image?: boolean; // TODO => Filter vocabs by the ones tha thave an image
    difficulties?: (1 | 2 | 3)[];
    is_public?: boolean;
    is_publicly_visible?: boolean;
    search?: string;
  };
  sort?: {
    type: "shuffle" | "difficulty" | "date";
    direction?: "ascending" | "descending";
  };
}

export default async function FETCH_userVocabs({
  filter,
  sort,
}: VocabFilter_PROPS) {
  try {
    let query = supabase.from("vocabs").select(
      `*,
         translations(*)
        `
    );

    // Apply filters
    if (filter?.list_id && filter.list_id !== "all") {
      query = query.eq("list_id", filter.list_id);
    }

    if (filter?.id) {
      query = query.eq("id", filter.id);
    }

    if (filter?.has_image !== undefined) {
      if (filter.has_image) {
        query = query.neq("image", null); // Images that exist
      } else {
        query = query.is("image", null); // Only vocabs with no image
      }
    }

    if (filter?.difficulties && filter.difficulties.length > 0) {
      query = query.in("difficulty", filter.difficulties);
    }

    if (filter?.is_public !== undefined) {
      query = query.eq("is_public", filter.is_public);
    }

    if (filter?.is_publicly_visible !== undefined) {
      query = query.eq("is_publicly_visible", filter.is_publicly_visible);
    }

    if (filter?.search) {
      query = query.or(`description.ilike.%${filter.search}%`);
    }

    // Apply sorting
    if (sort) {
      switch (sort.type) {
        case "difficulty":
          query = query.order("difficulty", {
            ascending: sort.direction === "ascending",
          });
          break;
        case "date":
          query = query.order("created_at", {
            ascending: sort.direction === "ascending",
          });
          break;
        case "shuffle":
          query = query.order("difficulty", { ascending: true }); // Add more randomization logic as needed
          break;
        default:
          break;
      }
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.log("🔴 Error fetching list vocabs 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching list vocabs 🔴" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error fetching list vocabs 🔴 : ", error);
    return { success: false, msg: "🔴 Error fetching list vocabs 🔴" };
  }
}
