import User_MODEL from "@/src/db/models/User_MODEL";
import { supabase } from "@/src/lib/supabase";
import { SEND_internalError } from "@/src/utils";

interface Response {
  success: boolean;
  msg?: string;
  supabase_USER?: User_MODEL;
  error_REASON?: "user_internet" | "internal";
}

const defaultError_MSG =
  "Something went wrong when trying to load your profile. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

export async function FETCH_mySupabaseProfile(
  userId: string | undefined
): Promise<Response> {
  try {
    if (!userId) {
      SEND_internalError({
        internal_MSG: "🔴 User ID not defined when fetching from Supabase 🔴",
        function_NAME: "FETCH_mySupabaseProfile",
        user_id: "",
      });

      return {
        success: false,
        msg: defaultError_MSG,
        error_REASON: "internal",
      };
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // If there's an error in the response from Supabase
    if (error) {
      // Check if the error is due to a network failure
      if (
        error.message
          .toLowerCase()
          .includes("network request failed".toLowerCase())
      ) {
        return {
          success: false,
          msg: "There seems to be an issue with your internet connection.",
          error_REASON: "user_internet",
        };
      }

      // Handle Supabase-related errors
      SEND_internalError({
        message: `🔴 Error fetching user from Supabase 🔴: ${error.message}`,
        function_NAME: "FETCH_mySupabaseProfile",
        user_id: userId,
      });
      return {
        success: false,
        msg: defaultError_MSG,
        error_REASON: "internal",
      };
    }

    // Return success if user data was fetched
    return { success: true, supabase_USER: user };
  } catch (err) {
    // Check for network-related error
    if (
      err instanceof Error &&
      err.message.includes("Network request failed")
    ) {
      return {
        msg: "There seems to be an issue with your internet connection.",
        success: false,
        error_REASON: "user_internet",
      };
    }

    // Handle any other unexpected errors
    SEND_internalError({
      message: `🔴 Error fetching user from Supabase 🔴: ${
        err instanceof Error ? err.message : ""
      }`,
      function_NAME: "FETCH_mySupabaseProfile",
      user_id: userId || "",
    });
    return {
      success: false,
      msg: defaultError_MSG,
      error_REASON: "internal",
    };
  }
}
