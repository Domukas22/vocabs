//
//
//

export interface tr_PROPS {
  lang_id: string;
  text: string;
  highlights: number[];
}
// ------------------------------------------------------------
export interface DisplaySettings_PROPS {
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "shuffle" | "difficulty" | "date";
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
}
