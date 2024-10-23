//
//
//

import { Q, Query } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { DisplaySettings_PROPS } from "@/src/zustand";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string | undefined;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
}

const FetchVocabs_QUERY = ({
  search,
  list_id,
  z_display_SETTINGS,
}: VocabFilter_PROPS): Query<Vocab_MODEL> => {
  // Start with the base query
  let query = Vocabs_DB?.query();

  // Add optional filters using Q.and
  const conditions = [];

  if (list_id) {
    conditions.push(Q.where("list_id", list_id));
  }

  if (
    z_display_SETTINGS?.difficultyFilters &&
    z_display_SETTINGS?.difficultyFilters.length > 0
  ) {
    conditions.push(
      Q.where("difficulty", Q.oneOf(z_display_SETTINGS?.difficultyFilters))
    );
  }

  if (
    z_display_SETTINGS?.langFilters &&
    z_display_SETTINGS?.langFilters.length > 0
  ) {
    conditions.push(
      Q.or(
        z_display_SETTINGS?.langFilters.map((lang) =>
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
  switch (z_display_SETTINGS?.sorting) {
    case "shuffle":
      // query = query.extend(
      //   Q.sortBy("difficulty", sort.direction === "ascending" ? Q.asc : Q.desc)
      // );
      break;
    case "difficulty":
      query = query.extend(
        Q.sortBy(
          "difficulty",
          z_display_SETTINGS?.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );
      break;
    case "date":
      query = query.extend(
        Q.sortBy(
          "created_at",
          z_display_SETTINGS?.sortDirection === "ascending" ? Q.asc : Q.desc
        )
      );

      break;
  }

  // Combine all conditions with Q.and
  query = query.extend(Q.and(...conditions));

  return query;
};

export default FetchVocabs_QUERY;
