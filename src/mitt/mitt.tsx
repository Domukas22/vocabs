//
//
//

import mitt from "mitt";
import { Vocab_TYPE } from "../features_new/vocabs/types";
import { List_TYPE } from "../features_new/lists/types";

export type vocabUpdate_TYPES = "full" | "marked" | "difficulty";

type VocabEvents_PROPS = {
  created: Vocab_TYPE;
  updated: { vocab: Vocab_TYPE; type: vocabUpdate_TYPES };
  deleted: { vocab_ID: string; list_ID: string };
  copied: { vocabs: Vocab_TYPE[]; targetList_ID: string };
};

type ListEvents_PROPS = {
  created: List_TYPE;
  updated: List_TYPE;
  deleted: string;
  copied: { list: List_TYPE; vocabs: Vocab_TYPE[] };
};

export const Vocab_EVENTS = mitt<VocabEvents_PROPS>();
export const List_EVENTS = mitt<ListEvents_PROPS>();
