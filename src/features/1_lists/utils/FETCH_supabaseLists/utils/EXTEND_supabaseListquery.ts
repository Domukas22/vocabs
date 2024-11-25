//
//
//

import APPLY_supabasePagination from "@/src/lib/supabase/utils/APPLY_supabasePagination/APPLY_supabasePagination";

export default function EXTEND_supabaseListquery({
  query,
  list_ids,
  type,
  search,
  z_listDisplay_SETTINGS,
  start,
  end,
}: {
  query: any;
  list_ids: string[] | null | undefined;
  type: string;
  search?: string;
  z_listDisplay_SETTINGS?: any;
  start: number;
  end: number;
}) {
  // query = APPLY_supabaseListType(query, type, list_ids);
  // query = APPLY_supabaseListSearch(query, search);
  // query = APPLY_supabaseListLanguageFilters(
  //   query,
  //   z_listDisplay_SETTINGS?.langFilters
  // );
  // query = APPLY_supabaseListSorting(
  //   query,
  //   z_listDisplay_SETTINGS?.sorting,
  //   z_listDisplay_SETTINGS?.sortDirection
  // );
  query = APPLY_supabasePagination(query, start, end);

  return query;
}
