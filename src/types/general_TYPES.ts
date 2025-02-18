//
//
//

export type loadingState_TYPES =
  | "loading"
  | "searching"
  | "filtering"
  | "searching_and_filtering"
  | "loading_more"
  | "error"
  | "none";

export type Toast_TYPE = "success" | "error" | "warning";

export type raw_List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: "public" | "private";

  default_lang_ids: string; // Example: "en, de, lt"
  collected_lang_ids: string; // Example: "en, de, lt"
  description: string;
  saved_count: number;

  updated_at: string;
  created_at: string;
  deleted_at: string;

  // only for private lists
  vocabs?: { difficulty: number; is_marked: boolean }[];
};
export type List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: "public" | "private";

  default_lang_ids: string[]; // Example: ["en", "de", "lt"]
  collected_lang_ids: string[]; // Example: ["en", "de", "lt"]
  description: string;
  saved_count: number;

  updated_at: string;
  created_at: string;
  deleted_at: string;

  // only for private lists
  vocab_INFOS?: {
    diff_1: number;
    diff_2: number;
    diff_3: number;
    marked: number;
  }; // transform the vocabs property
};
