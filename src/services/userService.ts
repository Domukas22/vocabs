//
//
//

import { supabase } from "../lib/supabase";

export const FETCH_userData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("🔴 Error fetching user data 🔴", error);
    return { success: false, msg: error?.message };
  }
};
