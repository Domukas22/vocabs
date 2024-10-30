import { Q, Query } from "@nozbe/watermelondb";
import { Lists_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { eq } from "@nozbe/watermelondb/QueryDescription";

interface ListFilter_PROPS {
  search?: string;
  user_id?: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
}

const FetchLists_QUERY = ({
  search,
  user_id,
  z_listDisplay_SETTINGS,
}: ListFilter_PROPS): Query<List_MODEL> => {
  // Start with the base query

  if (!user_id) {
    throw new Error("🔴 User id not defined when building list fetch query 🔴");
  }

  let query = Lists_DB?.query(
    Q.where("user_id", user_id),
    Q.where("deleted_at", eq(null))
  );

  // Add optional filters using Q.and
  const conditions = [];

  // Filter by languages
  if (
    z_listDisplay_SETTINGS?.langFilters &&
    z_listDisplay_SETTINGS?.langFilters.length > 0
  ) {
    conditions.push(
      Q.or(
        z_listDisplay_SETTINGS?.langFilters.map((lang) =>
          Q.where(
            "collected_lang_ids",
            Q.like(`%${Q.sanitizeLikeString(lang)}%`)
          )
        )
      )
    );
  }

  // Filter by search
  if (search) {
    conditions.push(
      Q.or([Q.where("name", Q.like(`%${Q.sanitizeLikeString(search)}%`))])
    );
  }

  // Handle sorting
  switch (z_listDisplay_SETTINGS?.sorting) {
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_listDisplay_SETTINGS?.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
  }

  // Combine all conditions with Q.and
  query = conditions.length > 0 ? query.extend(Q.and(...conditions)) : query;

  return query;
};

export default FetchLists_QUERY;
