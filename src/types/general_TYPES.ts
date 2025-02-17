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

export type List_TYPE = {
  id: string;
  user_id: string;

  name: string;
  type: "public" | "private";

  default_lang_ids: string;
  collected_lang_ids: string;
  description: string;
  saved_count: number;

  updated_at: string;
  created_at: string;
  deleted_at: string;
};
