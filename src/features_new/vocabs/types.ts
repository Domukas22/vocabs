//
//
//

import {
  itemVisibility_TYPE,
  sortDirection_TYPE,
} from "@/src/types/general_TYPES";

export type VocabTr_TYPE = {
  lang_id: string;
  text: string;
  highlights: number[];
};

export type VocabDiff_TYPE = 1 | 2 | 3;

export type Vocab_TYPE = {
  id: string;
  user_id: string;
  list_id: string;
  type: itemVisibility_TYPE;

  is_marked: boolean;
  difficulty: VocabDiff_TYPE;
  lang_ids: string[];
  trs: VocabTr_TYPE[];

  description: string;
  searchable: string;
  saved_count: number;

  updated_at: string;
  created_at: string;
  deleted_at: string;

  list: {
    id: string;
    name: string;
  };
};

export type VocabFilter_PROPS = {
  langs: string[];
  difficulties: (1 | 2 | 3)[];
  byMarked: boolean;
};

export type vocabSorting_TYPES =
  | "date"
  | "difficulty"
  | "saved-count"
  | "marked";

export type VocabSorting_PROPS = {
  type: vocabSorting_TYPES;
  direction: sortDirection_TYPE;
};
