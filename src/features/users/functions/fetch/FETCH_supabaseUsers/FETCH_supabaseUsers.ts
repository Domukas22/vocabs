//
//
//

import { supabase } from "@/src/lib/supabase";

export interface FetchUsers_PROPS {
  search?: string;
  start?: number;
  end?: number;
  signal: AbortSignal;
}

export async function FETCH_supabaseUsers({
  search,
  start = 0,
  end = 10,
  signal,
}: FetchUsers_PROPS) {
  let query = supabase
    .from("users")
    .select(
      `
        id,
        username
      `,
      { count: "exact" }
    )
    .is("deleted_at", null);

  if (search) {
    query = query.or(`username.ilike.%${search}%`);
  }

  query = query.range(start, end - 1);

  const { data, error, count } = await query.abortSignal(signal);

  return {
    users: data || [],
    count: count || 0,
    error: {
      value: error ? true : false,
      msg: error ? error.message : "",
    },
  };
}
