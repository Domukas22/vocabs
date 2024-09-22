//
//
//

import { useState } from "react";

export interface List_MODEL {
  id: string;
  user_id: string;
  name: string;
  created_at: string;

  vocabs?: Vocab_MODEL[];
}
export interface Vocab_MODEL {
  id: string;
  list_id: string;
  user_id: string;
  difficulty: 1 | 2 | 3;
  description: string | "";
  image: string | "";
  is_public: boolean;
  is_publicly_visible: boolean;
  created_at: string;

  translations?: Translation_MODEL[];
}
export interface Translation_MODEL {
  id: string;
  user_id: string;
  vocab_id: string;
  lang_id: string;
  text: string;
  highlights: number[];
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

// ------------------------------------------------
export interface DisplaySettings_MODEL {
  search: string;
  sorting: string;
  sortDirection: string;
  SHOW_image: boolean;
  SHOW_listName: boolean;
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontLangId: string;
  difficultyFilters: [1 | 2 | 3] | [];
}
export interface TranslationCreation_PROPS {
  lang_id: string;
  text: string;
  highlights: number[];
}
