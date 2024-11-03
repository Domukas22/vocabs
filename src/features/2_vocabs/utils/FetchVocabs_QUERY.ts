import { Q, Query } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string;
  user_id?: string;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  fetchAll?: boolean;
  fetchOnlyForCount?: boolean;
  excludeIds?: Set<string>; // New param for IDs to exclude
  amount?: number;
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
}: VocabFilter_PROPS): Query<Vocab_MODEL> => {
  let query = Vocabs_DB?.query();

  const conditions = [];

  conditions.push(Q.where("deleted_at", null));

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

export default FetchVocabs_QUERY;
