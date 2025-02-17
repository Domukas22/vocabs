//
//
//

export type Vocab_TYPE = {
  id: string;
  user_id: string;
  list_id: string;
  is_public: boolean;

  is_marked: boolean;
  difficulty: number;
  lang_ids: string;

  trs: JSON;
  description: string;
  searchable: string;

  updated_at: string;
  created_at: string;
  deleted_at: string;
};

export type VocabTr_TYPE = {
  lang_id: string;
  text: string;
  highlights: number[];
};

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
