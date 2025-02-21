//
//
//

import { itemVisibility_TYPE } from "../features_new/vocabs/functions/FETCH_vocabs/types";

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
  list_TYPE: itemVisibility_TYPE;

  langFilters: string[];
  sortDirection: "ascending" | "descending";

  amount: number;
  signal: AbortSignal;

  loadMore: boolean;
};
