//
//
//

import { itemVisibility_TYPE } from "@/src/types/general_TYPES";

export type raw_List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: itemVisibility_TYPE;

  default_lang_ids: string; // Example: "en, de, lt"
  collected_lang_ids: string; // Example: "en, de, lt"
  description: string;
  saved_count: number;

  created_at: string;
  updated_at: string;

  // only for private lists
  vocabs?: { difficulty: number; is_marked: boolean }[];

  vocab_count: { count: number }[];
};

export type List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: itemVisibility_TYPE;

  default_lang_ids: string[]; // Example: ["en", "de", "lt"]
  collected_lang_ids: string[]; // Example: ["en", "de", "lt"]
  description: string;
  saved_count: number;

  created_at: string;
  updated_at: string;

  // only for private lists
  vocab_INFOS?: {
    diff_1: number;
    diff_2: number;
    diff_3: number;
    marked: number;
  }; // transform the vocabs property

  vocab_count: number;
};
