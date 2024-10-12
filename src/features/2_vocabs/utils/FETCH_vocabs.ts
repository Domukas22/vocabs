//
//
//

import { Q } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

export interface VocabFilter_PROPS {
  search?: string;
  list?: List_MODEL | undefined;
  is_public?: boolean;
  difficultyFilters?: (1 | 2 | 3)[];
  langFilters?: string[];
  sorting?: "shuffle" | "difficulty" | "date";
  sortDirection?: "ascending" | "descending";
}

const FETCH_vocabs = ({
  search,
  list,
  is_public,
  difficultyFilters,
  langFilters,
  sorting,
  sortDirection,
}: VocabFilter_PROPS) => {
  if (!list?.id && !is_public) {
    throw new Error("🔴 List ID is required. 🔴");
  }

  // Start with the base query
  let query = Vocabs_DB.query();

  // Add optional filters using Q.and
  const conditions = [];

  if (is_public) {
    conditions.push(Q.where("is_public", is_public));
  }

  if (list) {
    conditions.push(Q.where("list_id", list?.id));
  }

  if (difficultyFilters && difficultyFilters.length > 0) {
    conditions.push(Q.where("difficulty", Q.oneOf(difficultyFilters)));
  }

  if (langFilters && langFilters.length > 0) {
    conditions.push(
      Q.or(
        langFilters.map((lang) =>
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
  switch (sorting) {
    case "shuffle":
      // query = query.extend(
      //   Q.sortBy("difficulty", sort.direction === "ascending" ? Q.asc : Q.desc)
      // );
      break;
    case "difficulty":
      query = query.extend(
        Q.sortBy("difficulty", sortDirection === "ascending" ? Q.asc : Q.desc)
      );
      break;
    case "date":
      query = query.extend(
        Q.sortBy("created_at", sortDirection === "ascending" ? Q.asc : Q.desc)
      );

      break;
  }

  // Combine all conditions with Q.and
  query = query.extend(Q.and(...conditions));

  return query.observe();
};

export default FETCH_vocabs;
