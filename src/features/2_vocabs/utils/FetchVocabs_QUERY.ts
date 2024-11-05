import { Q, Query } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";
import { eq, notEq } from "@nozbe/watermelondb/QueryDescription";

export interface VocabFilter_PROPS {
  type: "byTargetList" | "allVocabs" | "deletedVocabs";
  start: number;
  search: string;
  amount?: number;
  user_id: string | undefined;
  excludeIds?: Set<string>;
  targetList_ID?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
}

const FetchVocabs_QUERY = ({
  search,
  list_id,
  user_id,
  z_vocabDisplay_SETTINGS,
  fetchAll = false,
  excludeIds = new Set(),
  amount,
  fetchOnlyForCount = false,
  fetchDeleted = false,
}: VocabFilter_PROPS): Query<Vocab_MODEL> => {
  let query = Vocabs_DB?.query();

  const conditions = [];

  if (fetchDeleted && user_id) {
    conditions.push(
      Q.where("deleted_at", notEq(null)),
      Q.where("user_id", user_id)
    );
  } else {
    conditions.push(Q.where("deleted_at", null));
  }

  if (list_id && !fetchAll) {
    conditions.push(Q.where("list_id", list_id));
  } else if (user_id && fetchAll) {
    conditions.push(Q.where("user_id", user_id));
  }

  if (
    z_vocabDisplay_SETTINGS?.difficultyFilters &&
    z_vocabDisplay_SETTINGS.difficultyFilters.length > 0
  ) {
    conditions.push(
      Q.where("difficulty", Q.oneOf(z_vocabDisplay_SETTINGS.difficultyFilters))
    );
  }

  if (
    z_vocabDisplay_SETTINGS?.langFilters &&
    z_vocabDisplay_SETTINGS.langFilters.length > 0
  ) {
    conditions.push(
      Q.or(
        z_vocabDisplay_SETTINGS.langFilters.map((lang) =>
          Q.where("lang_ids", Q.like(`%${Q.sanitizeLikeString(lang)}%`))
        )
      )
    );
  }

  if (search) {
    conditions.push(
      Q.or([
        Q.where("description", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
        Q.where("searchable", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
      ])
    );
  }

  if (fetchOnlyForCount) {
    // if only fetched to find out totla count, return here
    // ther eis no need for sorting
    query = query.extend(Q.and(...conditions));
    return query;
  }

  // Apply sorting based on user settings
  switch (z_vocabDisplay_SETTINGS?.sorting) {
    case "difficulty":
      query = query.extend(
        Q.sortBy(
          "difficulty",
          z_vocabDisplay_SETTINGS.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_vocabDisplay_SETTINGS.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
  }

  conditions.push(Q.where("id", Q.notIn([...excludeIds])));
  query = query.extend(Q.take(amount || 10));

  query = query.extend(Q.and(...conditions));

  return query;
};
export async function FETCH_vocabs({
  type,
  start,
  search,
  amount,
  user_id,
  excludeIds = new Set(),
  targetList_ID,
  z_vocabDisplay_SETTINGS,
}: VocabFilter_PROPS) {
  let query = Vocabs_DB?.query();

  const conditions = [];
  let count = 0;

  // if user_id not defined....

  if (!user_id) {
    return {
      vocabs: [],
      count: 0,
      error: {
        value: true,
        msg: "🔴 User ID not defined when fetching vocabs 🔴",
      },
    };
  }

  conditions.push(Q.where("user_id", user_id));

  switch (type) {
    case "allVocabs":
      conditions.push(Q.where("deleted_at", eq(null)));
      break;
    // --------------------------------------------
    case "byTargetList":
      if (!targetList_ID) {
        return {
          vocabs: [],
          count: 0,
          error: {
            value: true,
            msg: "🔴 Tried fetching vocabs by target list, by targetList_ID was undefined 🔴",
          },
        };
      }
      conditions.push(
        Q.where("deleted_at", eq(null)),
        Q.where("list_id", targetList_ID)
      );
      break;
    // --------------------------------------------
    case "deletedVocabs":
      conditions.push(Q.where("deleted_at", notEq(null)));
      break;
  }

  if (
    z_vocabDisplay_SETTINGS?.difficultyFilters &&
    z_vocabDisplay_SETTINGS.difficultyFilters.length > 0
  ) {
    conditions.push(
      Q.where("difficulty", Q.oneOf(z_vocabDisplay_SETTINGS.difficultyFilters))
    );
  }

  if (
    z_vocabDisplay_SETTINGS?.langFilters &&
    z_vocabDisplay_SETTINGS.langFilters.length > 0
  ) {
    conditions.push(
      Q.or(
        z_vocabDisplay_SETTINGS.langFilters.map((lang) =>
          Q.where("lang_ids", Q.like(`%${Q.sanitizeLikeString(lang)}%`))
        )
      )
    );
  }

  if (search) {
    conditions.push(
      Q.or([
        Q.where("description", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
        Q.where("searchable", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
      ])
    );
  }

  count = (await query.extend(Q.and(...conditions)).fetchCount()) || 0;

  // Apply sorting based on user settings
  switch (z_vocabDisplay_SETTINGS?.sorting) {
    case "difficulty":
      query = query.extend(
        Q.sortBy(
          "difficulty",
          z_vocabDisplay_SETTINGS.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_vocabDisplay_SETTINGS.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
  }

  conditions.push(Q.where("id", Q.notIn([...excludeIds])));
  query = query.extend(Q.skip(start || 0), Q.take(amount || 10));

  const vocabs = (await query.extend(Q.and(...conditions))) || [];

  return {
    vocabs,
    count,
    error: {
      value: false,
      msg: "",
    },
  };
}

export default FetchVocabs_QUERY;
