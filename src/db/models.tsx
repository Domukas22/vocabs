//
//
//

export interface User_MODEL {
  id: string;
  email: string;
  is_premum: boolean;
  is_admin: boolean;
  payment_date: string;
  payment_amount: number;
  payment_type: string;
  app_lang_id: "en" | "de";

  created_at: string;
}
export interface Language_MODEL {
  id: string;
  image_url: string;
  created_at: string;
  lang_in_en: string;
  lang_in_de: string;
  country_in_en: string;
  country_in_de: string;
  translation_example: string;
  translation_example_highlights: number[];
}
export interface List_MODEL {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  default_TRs: string[];

  vocabs?: Vocab_MODEL[];
}

// --------------------------------------------------------------------------------------------
export interface Vocab_MODEL {
  id: string;
  list_id: string | undefined;
  user_id: string | undefined;
  difficulty: 1 | 2 | 3 | undefined;
  description: string | undefined;
  image: string | undefined;
  is_public: boolean;
  created_at: string;

  translations?: Translation_MODEL[];
}
// --------------------------------------------------------------------------------------------
export interface Translation_MODEL {
  id: string;
  user_id: string | undefined;
  vocab_id: string;
  lang_id: string;
  text: string;
  highlights: number[] | null;
  is_public: boolean;

  created_at: string;
}
// --------------------------------------------------------------------------------------------

export interface TranslationCreation_PROPS {
  lang_id: string;
  text: string;
  highlights: number[];
}
// ------------------------------------------------------------
export interface VocabDisplaySettings_PROPS {
  SHOW_image: boolean;
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "shuffle" | "difficulty" | "date";
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
}
