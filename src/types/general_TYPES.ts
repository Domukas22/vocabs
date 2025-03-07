//
//
//

export type itemVisibility_TYPE = "private" | "public";

export type loadingState_TYPES =
  | "loading"
  | "searching"
  | "filtering"
  | "searching_and_filtering"
  | "loading_more"
  | "error"
  | "none";

export type Toast_TYPE = "success" | "error" | "warning";

export type sortDirection_TYPE = "ascending" | "descending";
export type The4Fetch_TYPES =
  | "my-lists"
  | "my-vocabs"
  | "public-lists"
  | "public-vocabs"
  | undefined;

////////////////////////////////////////
export type DiffFilter_TYPE = {
  type: "diff";
  val: 1 | 2 | 3;
};
export type LangFilter_TYPE = {
  type: "lang";
  val: string;
};
export type MarkedFilter_TYPE = {
  type: "marked";
};

export type OneFilter_TYPE =
  | DiffFilter_TYPE
  | LangFilter_TYPE
  | MarkedFilter_TYPE;

export type Filters_TYPE = OneFilter_TYPE[];

export type delete_TYPE = "soft" | "hard";
