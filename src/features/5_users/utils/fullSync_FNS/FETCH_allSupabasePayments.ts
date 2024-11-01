//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_allSupabasePayments(user_id: string) {
  try {
    if (!user_id) {
      throw new Error(
        "🔴 User ID not defined for fetching all supabase payments 🔴"
      );
    }

    const { data, error } = await supabase
      .from("payments")
      .select()
      .eq("user_id", user_id);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("🔴 Error fetching all supabase payments 🔴", error);

    return { success: false, error };
  }
}
