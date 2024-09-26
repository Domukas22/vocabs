//
//
//

import { supabase } from "@/src/lib/supabase";

export interface PrivateListFilter_PROPS {
  user_id: string;
}

export default async function FETCH_myLists({
  user_id,
  z,
}: PrivateListFilter_PROPS) {
  const { z_SET_lists, z_SET_listsLoading, z_SET_listsError } = z;
  try {
    z_SET_listsLoading(true);
    z_SET_listsError(null);

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
      z_SET_listsError("🔴 Error fetching user lists. 🔴");
      return;
    }

    console.log("🟢 Fetched my lists 🟢");
    z_SET_lists(data);
  } catch (error) {
    console.error("🔴 Unexpected error fetching lists: 🔴", error);
    z_SET_listsError("🔴 Unexpected error occurred. 🔴");
  } finally {
    z_SET_listsLoading(false);
  }
}
