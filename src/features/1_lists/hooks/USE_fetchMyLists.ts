import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { List_MODEL } from "@/src/db/watermelon_MODELS"; // Assuming List_MODEL is used in the app

export interface PrivateListFilter_PROPS {
  user_id: string;
}

export default function USE_fetchMyLists() {
  const [ARE_listsFetching, SET_listsFetching] = useState(false);
  const [fetchLists_ERROR, SET_fetchListsError] = useState<string | null>(null);

  const RESET_error = useCallback(() => SET_fetchListsError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to fetch the lists. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const FETCH_myLists = async ({
    user_id,
  }: PrivateListFilter_PROPS): Promise<{
    success: boolean;
    lists?: List_MODEL[] | undefined;
    msg?: string;
  }> => {
    // Reset previous error
    SET_fetchListsError(null);

    // Validation: Ensure user_id is provided
    if (!user_id) {
      SET_fetchListsError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for fetching lists 🔴",
      };
    }

    // Start the loading state
    SET_listsFetching(true);

    try {
      // Fetch lists for the given user
      const { data: lists, error } = await supabase
        .from("lists")
        .select("*, vocabs(*, translations(*))")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("🔴 Error fetching lists: 🔴", error);
        SET_fetchListsError(errorMessage);
        return {
          success: false,
          msg: "🔴 Error fetching lists. Please try again later. 🔴",
        };
      }

      return { success: true, lists };
    } catch (error: any) {
      // Handle different types of errors
      if (error.message === "Failed to fetch") {
        SET_fetchListsError(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_fetchListsError(errorMessage);
      }

      return {
        success: false,
        msg: `🔴 Unexpected error occurred while fetching lists: ${error.message} 🔴`,
      };
    } finally {
      // End the loading state
      SET_listsFetching(false);
    }
  };

  return { FETCH_myLists, ARE_listsFetching, fetchLists_ERROR, RESET_error };
}
