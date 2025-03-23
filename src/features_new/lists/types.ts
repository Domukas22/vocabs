//
//
//

import {
  privateOrPublic_TYPE,
  sortDirection_TYPE,
} from "@/src/types/general_TYPES";
import { MyListsSorting_TYPE } from "./hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";

export type List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: privateOrPublic_TYPE;

  default_lang_ids: string[];
  collected_lang_ids: string[];
  description: string;
  saved_count: number;

  created_at: string;
  updated_at: string;

  vocab_infos: {
    total: number;
    diff_1: number;
    diff_2: number;
    diff_3: number;
    marked: number;
  };
};

export type ListFilter_PROPS = {
  langs: string[];
  difficulties: (1 | 2 | 3)[];
  byMarked: boolean;
};

export type ListSorting_PROPS = {
  type: MyListsSorting_TYPE;
  direction: sortDirection_TYPE;
};

export type TinyList_TYPE = {
  id: string;
  name: string;
};
