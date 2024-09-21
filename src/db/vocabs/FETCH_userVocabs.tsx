//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_userVocabs({
  list_id,
}: {
  list_id: string;
}) {
  try {
    const { data, error } = await supabase
      .from("vocabs")
      .select("*")
      .eq("list_id", list_id).select(`
      *,
      translations(*)
    `);

    if (error) {
      console.log("🔴 Error fetching list vocabs 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching list vocabs 🔴" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error fetching list vocabs 🔴 : ", error);
    return { success: false, msg: "🔴 Error fetching list vocabs 🔴" };
  }
}
