//
//
//

import { supabase } from "@/src/lib/supabase";

export interface PrivateListFilter_PROPS {
  user_id: string;
}

export default async function FETCH_myLists({
  user_id,
}: PrivateListFilter_PROPS) {
  try {
    // Prepare the query
    let query = supabase
      .from("lists")
      .select("*, vocabs(*, translations(*))")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("🔴 Error fetching lists: 🔴", error);

      return;
    }
  } catch (error) {
    console.error("🔴 Unexpected error fetching lists: 🔴", error);
  } finally {
  }
}
