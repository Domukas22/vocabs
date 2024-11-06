//
//
//
import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { User_MODEL } from "@/src/db/watermelon_MODELS";

export default function USE_supabaseUsers({
  search = "",
  paginateBy = 10,
  onlySelected = false,
  selected_IDS = [],
  view = "all",
}: {
  search: string;
  paginateBy?: number;
  onlySelected?: boolean;
  selected_IDS?: string[];
  view: "all" | "selected";
}) {
  const [ARE_usersFetching, SET_usersFetching] = useState(false);
  const [fetchUsers_ERROR, SET_error] = useState<string | null>(null);
  const [users, SET_users] = useState<User_MODEL[]>([]);

  const [total_COUNT, SET_totalUserCount] = useState<number>(0);
  const [start, SET_start] = useState(0); // Start index for pagination
  const [end, SET_end] = useState(paginateBy); // End index for pagination
  const [IS_loadingMore, SET_loadingMore] = useState(false);

  useEffect(() => {
    if (
      (view === "all" && !onlySelected) ||
      (view === "selected" && onlySelected)
    ) {
      SET_users([]);
      SET_start(0);
      SET_end(paginateBy);
      fetchUsers({ start: 0, end: paginateBy });
      fetchTotalCount();
    }
  }, [search, view]);

  const fetchTotalCount = async () => {
    try {
      // Query total count with filters

      let query = !onlySelected
        ? supabase
            .from("users")
            .select("username")
            .ilike("username", `%${search}%`)
        : supabase
            .from("users")
            .select("id, username")
            .ilike("username", `%${search}%`)
            .in("id", selected_IDS);

      const { data, error } = await query;

      if (error) {
        console.error("🔴 Error fetching user count: 🔴", error);
        SET_error("🔴 Error fetching user count. 🔴");
        return;
      }

      SET_totalUserCount(data?.length || 0);
    } catch (error) {
      console.error("🔴 Unexpected error fetching user count: 🔴", error);
      SET_error("🔴 Unexpected error occurred while fetching count. 🔴");
    }
  };

  const fetchUsers = async ({ start, end }: { start: number; end: number }) => {
    SET_usersFetching(true);
    SET_error(null);

    try {
      // Base query for fetching users with optional search filter and pagination
      let query = !onlySelected
        ? supabase
            .from("users")
            .select("id, username")
            .ilike("username", `%${search}%`)
        : supabase
            .from("users")
            .select("id, username")
            .ilike("username", `%${search}%`)
            .in("id", selected_IDS);

      // if (onlySelected && selected_IDS?.length > 0) {
      //   query = query.in("id", selected_IDS);
      // }

      const { data: usersData, error: usersError } = await query.range(
        start,
        end - 1
      );

      if (usersError) {
        console.error("🔴 Error fetching users: 🔴", usersError);
        SET_error("🔴 Error fetching users. 🔴");
        return;
      }

      // Append new data to the existing users list for pagination
      SET_users((prev) => [...prev, ...(usersData || [])]);
    } catch (error) {
      console.error("🔴 Unexpected error fetching users: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_usersFetching(false);
    }
  };

  const LOAD_more = async () => {
    const newStart = start + paginateBy;
    const newEnd = end + paginateBy;

    SET_loadingMore(true);
    SET_start(newStart);
    SET_end(newEnd);

    await fetchUsers({ start: newStart, end: newEnd });
    SET_loadingMore(false);
  };

  // useEffect(() => {
  //   fetchUsers({ start: 0, end: paginateBy });
  // }, [selected_IDS]);

  return {
    users,
    IS_fetching: ARE_usersFetching,
    error: fetchUsers_ERROR,
    LOAD_more,
    IS_loadingMore,
    total_COUNT,
  };
}
