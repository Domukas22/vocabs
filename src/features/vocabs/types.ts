//
//
//

export interface Vocab_MODEL {
  id: string;
  user_id: string;

  is_marked: boolean;
  difficulty: number;
  lang_ids: string;

  trs: JSON;
  description: string;
  searchable: string;

  updated_at: string;
  created_at: string;
  deleted_at: string;
}
