//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_userLists() {
  try {
    const { data, error } = await supabase.from("lists").select("*").select(`
      *,
      vocabs(*)
    `);

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
