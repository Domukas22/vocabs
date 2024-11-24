//
//
//

import { Q } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string | undefined;
  difficultyFilters?: (1 | 2 | 3)[];
  langFilters?: string[];
  sorting?: "shuffle" | "difficulty" | "date";
  sortDirection?: "ascending" | "descending";
}

const FETCH_vocabs = ({
  search,
  list_id,
  difficultyFilters,
  langFilters,
  sorting,
  sortDirection,
}: VocabFilter_PROPS) => {
  // Start with the base query
  let query = Vocabs_DB?.query();

  // Add optional filters using Q.and
  const conditions = [];

  if (list_id) {
    conditions.push(Q.where("list_id", list_id));
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
