//
//
//

import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { supabase } from "@/src/lib/supabase";

export function BUILD_listQuery(list_TYPE: itemVisibility_TYPE) {
  return list_TYPE === "private"
    ? supabase
        .from("lists")
        .select(
          `*, vocabs(difficulty, is_marked), vocab_count: vocabs(count)`,
          { count: "exact" }
        )
        .is("vocabs.deleted_at", null) // only aggregate non-deleted vocab children
    : supabase
        .from("lists")
        .select(`*, vocab_count: vocabs(count))`, { count: "exact" })
        .is("vocabs.deleted_at", null); // only aggregate non-deleted vocab children
}
