import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchUsersById() {
  const [ARE_usersByIdFetching, SET_usersFetching] = useState(false);
  const [usersById_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_usersById = useCallback(async (user_ids: string[]) => {
    SET_usersFetching(true);
    SET_error(null);

    try {
      // Create a query to fetch users by the provided user_ids
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, username")
        .in("id", user_ids); // Using the .in() method to filter by user_ids

      // Check for errors in fetching users
      if (usersError) {
        console.error("Error fetching users by ID:", usersError);
        SET_error("🔴 Error fetching users by ID. 🔴");
        return {
          success: false,
          data: null,
          msg: "🔴 Error fetching users by ID. 🔴",
          error: usersError.message,
        };
      }

      return {
        success: true,
        data: usersData, // returning the fetched users
        msg: "🟢 Fetched users by ID successfully. 🟢",
        error: null,
      };
    } catch (error) {
      console.error("🔴 Unexpected error fetching users by ID: 🔴", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
      return {
        success: false,
        data: null,
        msg: "🔴 Unexpected error occurred. 🔴",
        error: error?.message,
      };
    } finally {
      SET_usersFetching(false);
    }
  }, []); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_usersById, ARE_usersByIdFetching, usersById_ERROR };
}
