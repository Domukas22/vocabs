//
//
//

import { list_TYPES } from "../features_new/vocabs/hooks/USE_fetchVocabs/FETCH_vocabs/types";

export interface currentVocabAction_TYPE {
  vocab_ID: string;
  action:
    | "deleting"
    | "updating"
    | "updating_difficulty"
    | "updating_marked"
    | "moving"
    | "copying";
  new_DIFFICULTY?: number;
}

export interface currentListAction_TYPE {
  list_id: string;
  action: "deleting" | "updating" | "copying";
}

////////////////////////////////////////////////////////

export type z_FETCH_listsArgument_TYPES = {
  search: string;
  user_id: string;
  list_TYPE: list_TYPES;

  langFilters: string[];
  sortDirection: "ascending" | "descending";

  amount: number;
  signal: AbortSignal;

  loadMore: boolean;
};
