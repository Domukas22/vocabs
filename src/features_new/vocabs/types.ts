//
//
//

export type VocabTr_TYPE = {
  lang_id: string;
  text: string;
  highlights: number[];
};

export type raw_Vocab_TYPE = {
  id: string;
  user_id: string;
  list_id: string;
  is_public: boolean;

  is_marked: boolean;
  difficulty: number;
  lang_ids: string; // Example: "en, de, lt"

  trs: VocabTr_TYPE[];

  description: string;
  searchable: string;

  updated_at: string;
  created_at: string;
  deleted_at: string;

  list: {
    id: string;
    name: string;
  };
};

export type Vocab_TYPE = {
  id: string;
  user_id: string;
  list_id: string;
  is_public: boolean;

  is_marked: boolean;
  difficulty: number;
  lang_ids: string[]; // Example: ["en", "de", "lt"]

  trs: VocabTr_TYPE[];

  description: string;
  searchable: string;

  updated_at: string;
  created_at: string;
  deleted_at: string;
};
