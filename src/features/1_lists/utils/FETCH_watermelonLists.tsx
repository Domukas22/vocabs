import { Q } from "@nozbe/watermelondb";
import { Lists_DB } from "@/src/db";

import { z_listDisplaySettings_PROPS } from "@/src/zustand";

interface ListFilter_PROPS {
  search?: string;
  user_id?: string;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;

  excludeIds?: Set<string>;
  amount?: number;
}

export default async function FETCH_watermelonLists({
  search,
  user_id,
  z_listDisplay_SETTINGS,
  excludeIds = new Set(),
  amount,
}: ListFilter_PROPS) {
  let query = Lists_DB?.query(
    Q.or(Q.where("type", "private"), Q.where("type", "shared")),
    Q.where("deleted_at", null)
  );
  const conditions = [];
  let count = 0;

  if (!user_id) {
    return {
      lists: [],
      count: 0,
      error: {
        value: true,
        msg: "🔴 User ID not defined when fetching vocabs 🔴",
      },
    };
  }

  conditions.push(Q.where("user_id", user_id));

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

  count = (await query.extend(Q.and(...conditions)).fetchCount()) || 0;

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
  const lists = (await query.extend(Q.and(...conditions))) || [];

  return {
    lists,
    count,
    error: {
      value: false,
      msg: "",
    },
  };
}
