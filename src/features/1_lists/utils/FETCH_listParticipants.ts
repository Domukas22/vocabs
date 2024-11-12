//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_listParticipants({
  list_id,
  owner_id,
}: {
  list_id: string;
  owner_id: string;
}) {
  const { data, error } = await supabase
    .from("list_accesses")
    .select("user:participant_id(id, username)")
    .eq("list_id", list_id)
    .eq("owner_id", owner_id);

  return { participants: data?.map((x) => x.user) || [], error };
}
