//
//
//

import { Q, Query } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string | undefined;
  user_id?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  fetchAll?: boolean;
  start: number | undefined;
  amount: number | undefined;
}

const FetchVocabs_QUERY = ({
  search,
  list_id,
  user_id,
  z_vocabDisplay_SETTINGS,
  fetchAll = false,
  start = 0,
  amount = 2,
}: VocabFilter_PROPS): Query<Vocab_MODEL> => {
  // Start with the base query
  let query = Vocabs_DB?.query();

  console.log("start: ", start, " amount: ", amount);

  // Add optional filters using Q.and
  const conditions = [];

  if (list_id && !fetchAll) {
    conditions.push(Q.where("list_id", list_id));
  } else if (user_id && fetchAll) {
    conditions.push(Q.where("user_id", user_id));
  }

  if (
    z_vocabDisplay_SETTINGS?.difficultyFilters &&
    z_vocabDisplay_SETTINGS?.difficultyFilters.length > 0
  ) {
    conditions.push(
      Q.where("difficulty", Q.oneOf(z_vocabDisplay_SETTINGS?.difficultyFilters))
    );
  }

  if (
    z_vocabDisplay_SETTINGS?.langFilters &&
    z_vocabDisplay_SETTINGS?.langFilters.length > 0
  ) {
    conditions.push(
      Q.or(
        z_vocabDisplay_SETTINGS?.langFilters.map((lang) =>
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
  // Handle sorting
  switch (z_vocabDisplay_SETTINGS?.sorting) {
    case "shuffle":
      // query = query.extend(
      //   Q.sortBy("difficulty", sort.direction === "ascending" ? Q.asc : Q.desc)
      // );
      break;
    case "difficulty":
      query = query.extend(
        Q.sortBy(
          "difficulty",
          z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
            ? Q.asc
            : Q.desc
        )
      );
      break;
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
            ? Q.asc
            : Q.desc
        )
      );

      break;
  }

  // Combine all conditions with Q.and
  query = query.extend(Q.and(...conditions), Q.skip(start), Q.take(amount));

  return query;
};

export default FetchVocabs_QUERY;
