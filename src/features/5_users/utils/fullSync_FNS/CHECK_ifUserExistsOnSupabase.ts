//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function CHECK_ifUserExistsOnSupabase(user_id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single();

    if (error) {
      return { success: false, error };
    }

    // If data is returned, the user exists
    return { success: true, exists: Boolean(data) };
  } catch (error) {
    console.error("🔴 Error checking if user exists on Supabase 🔴", error);
    return { success: false, error };
  }
}
