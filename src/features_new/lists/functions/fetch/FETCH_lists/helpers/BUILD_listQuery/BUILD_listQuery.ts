//
//
//

import { list_TYPES } from "@/src/features_new/lists/types";
import { supabase } from "@/src/lib/supabase";

export function BUILD_listQuery(list_TYPE: list_TYPES) {
  // No need ot fetch vocab difficulties for public lists
  return list_TYPE === "private"
    ? supabase
        .from("lists")
        .select(`*, vocabs(difficulty, is_marked)`, { count: "exact" })
        .is("vocabs.deleted_at", null) // make sure we only fetch non-deleted vocab info
    : supabase.from("lists").select(`*`);
}
