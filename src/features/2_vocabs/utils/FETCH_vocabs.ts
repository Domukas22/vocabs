//
//
//

// filter.list_id - optional. if provided, fetch vocabs that point to that list_id.
// filter.id - optional. if provided, fetch a single vocab that contains that id. comes after list_id, in case we want to fethc one vocab form specific list.
// filter.has_image - optional, if provided false, fetch vocabs without an image (when image is undefined/null/""), if provided true, fetch vocabs with an image.
// filter.difficulties - if provided, fetch only those vocabs that has a difficulty set to one of the difficulty number provided. For example If diffculty is [1,3], only fetch vocabs that have a difficulty set to 1 or 3.
// filter.isPublic / filter.is_publicly_visible - simple boolean. if provided true, show vocabs with the properties se to ture or the opposite with false.
// sort: must always contain a value. will be set to "shuffle" by default. if "shuffle", then vocabs and displayed in random order, if "byDifficulty", then it sorts by difficulty asdendingly/descendingly according tot he sortDirection. same goes for date created. the sortDirection does not effect the "shuffle" sorting.

import { Q } from "@nozbe/watermelondb";
import { Vocabs_DB } from "@/src/db";

export interface VocabFilter_PROPS {
  search?: string;
  list_id?: string;
  is_public?: boolean;
  difficultyFilters?: (1 | 2 | 3)[];
  langFilters: string[];
  sorting: "shuffle" | "difficulty" | "date";
  sortDirection?: "ascending" | "descending";
}

const FETCH_vocabs = ({
  search,
  list_id,
  is_public,
  difficultyFilters,
  langFilters,
  sorting,
  sortDirection,
}: VocabFilter_PROPS) => {
  if (!list_id) {
    throw new Error("List ID is required.");
  }

  // Start with the base query
  let query = Vocabs_DB.query();

  // Add optional filters using Q.and
  const conditions = [];

  if (list_id) {
    if (list_id !== "all") conditions.push(Q.where("list_id", list_id));
  }

  if (search) {
    console.log("search now: ", search);

    conditions.push(
      Q.where("description", Q.like(`${Q.sanitizeLikeString(search)}%`))
    );
  }

  if (difficultyFilters && difficultyFilters.length > 0) {
    conditions.push(Q.where("difficulty", Q.oneOf(difficultyFilters)));
  }

  if (is_public) {
    conditions.push(Q.where("is_public", is_public));
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
