import User_MODEL from "@/src/db/models/User_MODEL";
import { supabase } from "@/src/lib/supabase";
import { Error_PROPS } from "@/src/props";
import { SEND_internalError } from "@/src/utils";

interface Response {
  supabase_USER?: User_MODEL;
  error?: Error_PROPS;
}

const defaultUserError_MSG =
  "Something went wrong when trying to load your profile. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

const function_NAME = "FETCH_mySupabaseProfile";

function _CREATE_internalErr(
  internal_MSG = "Something went wrong..."
): Error_PROPS {
  return {
    error_TYPE: "internal",
    function_NAME,
    internal_MSG,
    user_MSG: defaultUserError_MSG,
  };
}

export async function FETCH_mySupabaseProfile(
  userId: string | undefined
): Promise<Response> {
  try {
    if (!userId) {
      return {
        error: _CREATE_internalErr(
          "User ID not defined when fetching from Supabase"
        ),
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
        msg: defaultUserError_MSG,
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
      msg: defaultUserError_MSG,
      error_REASON: "internal",
    };
  }
}
