//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_supabaseUser(user_id: string) {
  try {
    if (!user_id) {
      throw new Error(
        "🔴 User ID not defined for fetching supabase user data 🔴"
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", user_id)
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("🔴 Error fetching supabase user data 🔴", error);

    return { success: false, error };
  }
}
