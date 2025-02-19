//
//
//

import { z_listDisplaySettings_PROPS } from "@/src/hooks/zustand/USE_zustand/USE_zustand";

export default function APPLY_supabaseListSorting(
  query: any,
  sorting?: Pick<
    z_listDisplaySettings_PROPS,
    "sorting"
  >["sorting"] /* here, make sure it only refferences the "sorting" prop*/,
  sortDirection: "ascending" | "descending" = "descending"
) {
  if (!query) return;
  const sortColumn = sorting === "date" ? "created_at" : "created_at";
  return query.order(sortColumn, { ascending: sortDirection === "ascending" });
}
