//
//
//

import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";
import { supabase } from "@/src/lib/supabase";
import {
  FetchSupabaseLists_ARGS,
  ExtendSupabaseListQuery_ERRS,
  FetchSupabaseLists_RESPONSE,
  FetchSupabaseListsError_PROPS,
} from "./types";

export async function FETCH_supabaseLists(
  args: FetchSupabaseLists_ARGS
): Promise<FetchSupabaseLists_RESPONSE> {
  const { signal } = args;

  try {
    VALITATE_args(args);
    const query = supabase.from("lists").select(
      `
          id,
          name,
          description,
          collected_lang_ids,
          ...users!lists_2_user_id_fkey(username),
          vocabs(count)
        `,
      { count: "exact" }
    );
    VALIDATE_query(query);

    const extended_QUERY = APPLY_filters({ ...args, query });
    const { data, error, count } = await extended_QUERY.abortSignal(signal);

    if (error) throw GENERATE_internalError("failed_supabase_fetch", error);

    return {
      data: {
        lists: data || [],
        count: count || 0,
      },
    };
  } catch (error: any) {
    return {
      data: {
        lists: [],
        count: 0,
      },
      error: HANDLE_userErrorInsideFinalCatchBlock({
        error,
        function_NAME: "FETCH_supabaseLists",
        internalErrorUser_MSG:
          ExtendSupabaseListQuery_ERRS.user.defaultInternal_MSG,
      }),
    };
  }
}

function VALITATE_args(args: FetchSupabaseLists_ARGS) {
  const { list_ids, type, search, z_listDisplay_SETTINGS, start, end } = args;

  if (type !== "shared" && type !== "public")
    throw GENERATE_internalError("not_public_and_not_shared");

  if (type === "shared" && !list_ids)
    throw GENERATE_internalError("shared_but_listIds_undefined");

  if (search && typeof search !== "string")
    throw GENERATE_internalError("search_value_isnt_string");

  if (!z_listDisplay_SETTINGS) {
    throw GENERATE_internalError("z_display_settings_undefined");
  }

  if (z_listDisplay_SETTINGS?.langFilters) {
    if (!Array.isArray(z_listDisplay_SETTINGS?.langFilters))
      throw GENERATE_internalError("lang_filters_isnt_array");
    if (
      !z_listDisplay_SETTINGS?.langFilters.every(
        (lang) => typeof lang === "string"
      )
    )
      throw GENERATE_internalError("lang_filters_arent_strings");
  }

  if (z_listDisplay_SETTINGS?.sorting !== "date")
    throw GENERATE_internalError("invalid_sorting");

  const dir = z_listDisplay_SETTINGS?.sortDirection;
  if (dir !== "ascending" && dir !== "descending")
    throw GENERATE_internalError("invalid_sort_direction");

  if (typeof start !== "number")
    throw GENERATE_internalError("undefined_query_start");
  if (typeof end !== "number")
    throw GENERATE_internalError("undefined_query_end");
  if (end - 1 < start)
    throw GENERATE_internalError("query_end_is_smaller_than_start");
}
function VALIDATE_query(query: any) {
  if (!query) throw GENERATE_internalError("query_undefined");
  if (query && !query.eq)
    throw GENERATE_internalError("query_doesnt_have_method_eq");
  if (query && !query.in)
    throw GENERATE_internalError("query_doesnt_have_method_in");
  if (query && !query.or)
    throw GENERATE_internalError("query_doesnt_have_method_or");

  if (query && !query.order)
    throw GENERATE_internalError("query_doesnt_have_method_order");
  if (query && !query.range)
    throw GENERATE_internalError("query_doesnt_have_method_range");
  if (query && !query.abortSignal)
    throw GENERATE_internalError("query_doesnt_have_method_abortSignal");
}
function APPLY_filters(args: FetchSupabaseLists_ARGS & { query: any }) {
  const { query, list_ids, type, search, z_listDisplay_SETTINGS, start, end } =
    args;

  let new_QUERY = query;

  // apply type
  new_QUERY = query.eq("type", type);

  // filter by list ids if shared
  if (type === "shared" && list_ids?.length) {
    new_QUERY = new_QUERY.in("id", list_ids);
  }

  // filter by search
  if (search) {
    new_QUERY = new_QUERY.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }
  // filter by lang
  const langs = z_listDisplay_SETTINGS?.langFilters.filter(
    (lang) => lang !== ""
  );
  if (langs?.length) {
    new_QUERY = new_QUERY.or(
      langs.map((lang) => `collected_lang_ids.ilike.%${lang}%`).join(",")
    );
  }

  // apply sorting
  const sorting =
    z_listDisplay_SETTINGS?.sorting === "date" ? "created_at" : "created_at";
  const sort_direction = z_listDisplay_SETTINGS?.sortDirection;
  new_QUERY = new_QUERY.order(sorting, { sort_direction });

  // apply pagination
  // if end is same as start, this is the end
  new_QUERY =
    end - 1 === start ? new_QUERY.range(0, 0) : new_QUERY.range(start, end - 1);

  return new_QUERY;
}

function GENERATE_internalError(
  type:
    | "query_undefined"
    | "not_public_and_not_shared"
    | "shared_but_listIds_undefined"
    | "query_doesnt_have_method_eq"
    | "query_doesnt_have_method_in"
    | "query_doesnt_have_method_or"
    | "query_doesnt_have_method_order"
    | "query_doesnt_have_method_range"
    | "query_doesnt_have_method_abortSignal"
    | "search_value_isnt_string"
    | "lang_filters_isnt_array"
    | "lang_filters_arent_strings"
    | "invalid_sorting"
    | "invalid_sort_direction"
    | "undefined_query_start"
    | "undefined_query_end"
    | "query_end_is_smaller_than_start"
    | "z_display_settings_undefined"
    | "failed_supabase_fetch",
  details?: any
) {
  return {
    error_TYPE: "internal",
    internal_MSG: ExtendSupabaseListQuery_ERRS.internal[type],
    user_MSG: ExtendSupabaseListQuery_ERRS.user.defaultInternal_MSG,
    function_NAME: "BUILD_supabaseListQuery",
    error_DETAILS: details,
  } as FetchSupabaseListsError_PROPS;
}
