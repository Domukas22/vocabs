import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/src/lib/supabase";

interface IncrementListSavedCount_MODEL {
  list_id: string | undefined;
  onSuccess?: (updated_LIST: any) => void;
}

export default function USE_incrementListSavedCount() {
  const [IS_incrementingSavedCount, SET_isIncrementingSavedCount] =
    useState(false);
  const [incrementSavedCount_ERROR, SET_error] = useState<string | null>(null);
  const RESET_incrementSavedCountError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to increment the list saved count. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const INCREMENT_listSavedCount = async ({
    list_id,
    onSuccess,
  }: IncrementListSavedCount_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    if (!list_id) {
      SET_error("🔴 List ID is required to increment saved count 🔴");
      return {
        success: false,
        msg: "🔴 List ID is required to increment saved count 🔴",
      };
    }

    try {
      SET_isIncrementingSavedCount(true);

      const { data, error } = await supabase.rpc("increment_list_saved_count", {
        list_id,
      });

      // Handle supabase errors
      if (error) {
        if (error.message === "Failed to fetch") {
          SET_error(
            "It looks like there's an issue with your internet connection. Please check your connection and try again."
          );
        } else {
          SET_error(errorMessage);
        }
        return {
          success: false,
          msg: `🔴 Unexpected error occurred during incrementing list saved count 🔴: ${error.message}`,
        };
      }

      // Success handling
      if (onSuccess) {
        onSuccess(data);
      }

      return { success: true, data };
    } catch (error: any) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: `🔴 Unexpected error occurred 🔴: ${error.message}`,
      };
    } finally {
      SET_isIncrementingSavedCount(false);
    }
  };

  return {
    INCREMENT_listSavedCount,
    IS_incrementingSavedCount,
    incrementSavedCount_ERROR,
    RESET_incrementSavedCountError,
  };
}
