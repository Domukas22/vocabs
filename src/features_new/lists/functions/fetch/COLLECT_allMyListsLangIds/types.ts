//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export interface COLLECT_allMyListsLangIds_ARGS {
  user_id: string;
  signal: AbortSignal;
}

export type COLLECT_allMyListsLangIds_RAW_RESPONSE_TYPE =
  | {
      collected_lang_ids: string[];
    }[]
  | null;

export type COLLECT_allMyListsLangIds_RESPONSE_TYPE = {
  allMyListsCollectedLang_IDs: string[];
};

export type CollectAllMyListLangIdsQuery_TYPE = PostgrestFilterBuilder<
  any,
  any,
  any[],
  "lists",
  unknown
>;
