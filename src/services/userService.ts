//
//
//

import { supabase } from "../lib/supabase";
import { User_MODEL } from "../db/watermelon_MODELS";
import db, { Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";

export const FETCH_userData = async (userId: string) => {
  try {
    // Step 1: Attempt to fetch user data from the local WatermelonDB

    // const localUser = await Users_DB.query(Q.where("id", userId)).fetch();

    // if (localUser.length > 0) {
    //   // Return the local user data if found
    //   return { success: true, data: localUser[0] };
    // }

    // Step 2: Fetch user data from Supabase if not found locally
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }

    // Step 3: Save the fetched data to WatermelonDB for offline access
    // const newUser = await db.write(async () => {
    //   return await Users_DB.create((user) => {
    //     user._raw.id = data.id;
    //     user.username = data.username;
    //     user.email = data.email;
    //     user.is_admin = data.is_admin;
    //     user.is_premium = data.is_premium;
    //     user.payment_date = data.payment_date;
    //     user.payment_amount = data.payment_amount;
    //     user.payment_type = data.payment_type;
    //     user.preferred_lang_id = data.preferred_lang_id;
    //   });
    // });

    return { success: true, data };
  } catch (error) {
    console.error("🔴 Error fetching user data 🔴", error);
    return { success: false, msg: error?.message };
  }
};
