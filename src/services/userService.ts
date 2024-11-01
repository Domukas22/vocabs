//
//
//

import { supabase } from "../lib/supabase";
import { User_MODEL } from "../db/watermelon_MODELS";
import db, { Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";

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
