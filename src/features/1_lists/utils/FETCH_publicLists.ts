//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_publicLists() {
  const { data, error } = await supabase
    .from("lists")
    .select("id")
    .eq("type", "public");

  return { public_LISTS: data || [], error };
}
