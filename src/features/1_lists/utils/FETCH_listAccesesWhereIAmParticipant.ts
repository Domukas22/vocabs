//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_listAccesesWhereIAmParticipant(
  user_id: string
) {
  const { data, error } = await supabase
    .from("list_accesses")
    .select("list_id")
    .eq("participant_id", user_id);

  return { list_ids: data || [], error };
}
