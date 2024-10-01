//
//
//

import { supabase } from "@/src/lib/supabase";

export default async function FETCH_publicVocabs({ z }) {
  const {
    z_SET_publicVocabs,
    z_SET_publicVocabsLoading,
    z_SET_publicVocabsError,
  } = z;
  try {
    z_SET_publicVocabsLoading(true);
    z_SET_publicVocabsError(null);

    // Prepare the query
    let query = supabase
      .from("vocabs")
      .select("*, translations(*)")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("🔴 Error fetching public vocabs: 🔴", error);
      z_SET_publicVocabsError("🔴 Error fetching user lists. 🔴");
      return;
    }

    console.log("🟢 Fetched public vocabs 🟢");
    z_SET_publicVocabs(data);
  } catch (error) {
    console.error("🔴 Unexpected error fetching public vocabs: 🔴", error);
    z_SET_publicVocabsError("🔴 Unexpected error occurred. 🔴");
  } finally {
    z_SET_publicVocabsLoading(false);
  }
}
