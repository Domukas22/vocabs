//
//
//

import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";

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

export type TinyList_TYPE = {
  id: string;
  name: string;
};
