//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_participantListAccesses(user_id: string) {
  const { data, error } = await supabase
    .from("list_access")
    .select("list_id")
    .eq("participant_id", user_id);

  if (error) {
    console.error(`🔴 Error fetching participant list accesses🔴`, error);
  }

  return data || [];
}
