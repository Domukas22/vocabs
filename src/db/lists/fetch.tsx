//
//
//

import { supabase } from "@/src/lib/supabase";

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

export async function FETCH_privateLists({
  user_id,
  search,
}: {
  user_id: string;
  search?: string;
}) {
  try {
    // Build the query for filtering by user_id and optionally searching by name
    let query = supabase
      .from("lists")
      .select("*, vocabs(*)") // Select lists with populated vocabs
      .eq("user_id", user_id); // Filter lists by user_id

    // Apply search filter if search term is provided
    if (search) {
      query = query.or(`name.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.log("🔴 Error fetching populated user lists 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error fetching populated user lists 🔴",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error fetching populated user lists 🔴 : ", error);
    return { success: false, msg: "🔴 Error fetching  populateduser lists 🔴" };
  }
}
