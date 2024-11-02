import { supabase } from "@/src/lib/supabase";
import { useState, useCallback } from "react";

export default function USE_fetchUsers() {
  const [ARE_usersFetching, SET_usersFetching] = useState(false);
  const [users_ERROR, SET_error] = useState<string | null>(null);

  const FETCH_users = useCallback(
    async ({
      myUser_ID = "",
      search = "",
      start_INDEX = 0,
      end_INDEX = 10, // Default to fetch 10 users per page
    }: {
      myUser_ID: string | undefined;
      search?: string;
      start_INDEX?: number;
      end_INDEX?: number;
    }) => {
      SET_usersFetching(true);
      SET_error(null);

      try {
        // Create a base query for fetching users
        let query = supabase.from("users").select("id, username");

        if (myUser_ID) {
          query = query.neq("id", myUser_ID);
        }

        // Add search filter if search term is provided
        if (search) {
          query = query.ilike("username", `%${search}%`); // Using ilike for case-insensitive search
        }

        // Apply pagination
        const { data: usersData, error: usersError } = await query.range(
          start_INDEX,
          end_INDEX
        );

        // Check for errors in fetching users
        if (usersError) {
          console.error("Error fetching users:", usersError);
          SET_error("🔴 Error fetching users. 🔴");
          return {
            success: false,
            data: null,
            msg: "🔴 Error fetching users. 🔴",
            error: usersError.message,
          };
        }

        return {
          success: true,
          data: usersData, // returning the fetched users
          msg: "🟢 Fetched users successfully. 🟢",
          error: null,
        };
      } catch (error) {
        console.error("🔴 Unexpected error fetching users: 🔴", error);
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
    },
    []
  ); // Empty dependency array means this will not re-create the function unless the component unmounts

  return { FETCH_users, ARE_usersFetching, users_ERROR };
}
