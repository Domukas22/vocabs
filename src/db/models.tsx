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
  available_as_in_app_lang: boolean;
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
  list_id: string | null;
  user_id: string | null;
  difficulty: 1 | 2 | 3 | null;
  description: string | null;
  image: string | null;
  is_public: boolean;
  created_at: string;

  translations?: Translation_MODEL[];
}
export interface PublicVocab_MODEL {
  id: string;
  description: string | "";
  image: string | "";
  created_at: string;

  public_translations?: Translation_MODEL[];
}
// --------------------------------------------------------------------------------------------
export interface Translation_MODEL {
  id: string;
  user_id: string | null;
  vocab_id: string;
  lang_id: string;
  text: string;
  highlights: number[] | null;
  created_at: string;
}
export interface PublicTranslation_MODEL {
  id: string;
  public_vocab_id: string;
  lang_id: string;
  text: string;
  highlights: number[];
  created_at: string;
}
// --------------------------------------------------------------------------------------------

export interface TranslationCreation_PROPS {
  lang_id: string;
  text: string;
  highlights: number[];
}
// ------------------------------------------------------------
export interface MyVocabDisplaySettings_PROPS {
  SHOW_image: boolean;
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "shuffle" | "difficulty" | "date";
  sortDirection: "ascending" | "descending";
  search: string;
  difficultyFilters: (1 | 2 | 3)[];
}
export interface PublicVocabDisplaySettings_PROPS {
  SHOW_image: boolean;
  SHOW_description: boolean;
  SHOW_flags: boolean;
  frontTrLang_ID: string;
  search: string;
}
