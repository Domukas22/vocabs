//
//
//

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export interface PublicVocabFilter_PROPS {
  filter?: {
    has_image?: boolean; // TODO => Filter vocabs by the ones tha thave an image
    search?: string;
  };
  sort?: {
    type: "shuffle" | "difficulty" | "date";
    direction?: "ascending" | "descending";
  };
}

export default function USE_fetchPublicVocabs() {
  const [IS_fetchingVocabs, SET_isFetchingVocabs] = useState(false);

  const FETCH_publicVocabs = async ({
    filter,
    sort,
  }: PublicVocabFilter_PROPS): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    try {
      SET_isFetchingVocabs(true);

      let query = supabase.from("public_vocabs").select(
        `*,
         public_translations(*)
        `
      );

      if (filter?.has_image !== undefined) {
        if (filter.has_image) {
          query = query.neq("image", null); // Images that exist
        } else {
          query = query.is("image", null); // Only vocabs with no image
        }
      }

      if (filter?.search) {
        query = query.or(`description.ilike.%${filter.search}%`);
      }

      // Apply sorting
      if (sort) {
        switch (sort.type) {
          case "date":
            query = query.order("created_at", {
              ascending: sort.direction === "ascending",
            });
            break;
          case "shuffle":
            query = query.order("date", { ascending: true }); // Add more randomization logic if needed
            break;
          default:
            break;
        }
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        console.log("🔴 Error fetching public list vocabs 🔴 : ", error);
        return {
          success: false,
          msg: "🔴 Error fetching public list vocabs 🔴",
        };
      }

      return { success: true, data };
    } catch (error) {
      console.log("🔴 Error fetching public list vocabs 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching public list vocabs 🔴" };
    } finally {
      SET_isFetchingVocabs(false);
    }
  };

  return { FETCH_publicVocabs, IS_fetchingVocabs };
}
