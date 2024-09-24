//
//
//

import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export async function FETCH_lists() {
  try {
    const { data, error } = await supabase.from("lists").select("*");

    if (error) {
      console.log("🔴 Error fetching user lists 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching user lists 🔴" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error fetching user lists 🔴 : ", error);
    return { success: false, msg: "🔴 Error fetching user lists 🔴" };
  }
}

export interface PrivateListFilter_PROPS {
  user_id: string;
  search?: string;
}

export default function USE_fetchUserLists() {
  const [ARE_userListsLoading, SET_userListsLoading] = useState(false);
  const [userLists_ERROR, SET_userListsError] = useState<string | null>(null);

  const FETCH_userLists = async ({
    user_id,
    search,
  }: PrivateListFilter_PROPS): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    try {
      SET_userListsLoading(true);
      SET_userListsError(null); // Reset error state before fetching

      // Prepare the query
      let query = supabase
        .from("lists")
        .select("*, vocabs(*)") // Select lists with populated vocabs
        .eq("user_id", user_id) // Filter by user_id
        .order("created_at", { ascending: false });
      // If a search term is provided, apply it
      if (search) {
        query = query.or(`name.ilike.%${search}%`);
      }

      // Execute the query
      const { data, error } = await query;

      // Handle potential errors
      if (error) {
        console.error("🔴 Error fetching lists: 🔴", error);
        SET_userListsError("🔴 Error fetching user lists. 🔴");
        return { success: false, msg: "🔴 Error fetching user lists. 🔴" };
      }

      return { success: true, data };
    } catch (error) {
      console.error("🔴 Unexpected error fetching lists: 🔴", error);
      SET_userListsError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_userListsLoading(false); // Always set loading to false after the request
    }
  };

  return { FETCH_userLists, ARE_userListsLoading, userLists_ERROR };
}
