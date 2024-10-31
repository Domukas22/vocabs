import { Q, Query } from "@nozbe/watermelondb";
import { Lists_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";

interface ListFilter_PROPS {
  search?: string;
  user_id?: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;

  fetchOnlyForCount?: boolean;
  excludeIds?: Set<string>;
  amount?: number;
}

const FetchLists_QUERY = ({
  search,
  user_id,
  z_listDisplay_SETTINGS,

  excludeIds = new Set(),
  amount,
  fetchOnlyForCount = false,
}: ListFilter_PROPS): Query<List_MODEL> => {
  let query = Lists_DB?.query(
    Q.or(Q.where("type", "private"), Q.where("type", "shared"))
  );
  const conditions = [];

  if (user_id) {
    conditions.push(Q.where("user_id", user_id));
  }

  if (z_listDisplay_SETTINGS?.langFilters?.length) {
    conditions.push(
      Q.or(
        z_listDisplay_SETTINGS.langFilters.map((lang) =>
          Q.where(
            "collected_lang_ids",
            Q.like(`%${Q.sanitizeLikeString(lang)}%`)
          )
        )
      )
    );
  }

  if (search) {
    conditions.push(
      Q.where("name", Q.like(`%${Q.sanitizeLikeString(search)}%`))
    );
  }

  if (fetchOnlyForCount) {
    query = query.extend(Q.and(...conditions));
    return query;
  }

  switch (z_listDisplay_SETTINGS?.sorting) {
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_listDisplay_SETTINGS.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
  }

  conditions.push(Q.where("id", Q.notIn([...excludeIds])));
  query = query.extend(Q.take(amount || 10));
  query = query.extend(Q.and(...conditions));

  return query;
};

export default FetchLists_QUERY;
