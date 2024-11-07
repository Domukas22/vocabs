//
//
//

import { User_MODEL } from "@/src/db/watermelon_MODELS";
import { supabase } from "@/src/lib/supabase";
import { useCallback, useMemo, useState } from "react";

export default function USE_editUsername() {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to edit username. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const EDIT_username = async ({
    current_USERNAME,
    new_USERNAME,
    user_id,
  }: {
    current_USERNAME: string | undefined;
    new_USERNAME: string | undefined;
    user_id: string | undefined;
  }) => {
    SET_error(null);

    if (!user_id) {
      SET_error("User id not defined when editing username");
      return {
        success: false,
        msg: "🔴 User id not defined when editing username 🔴",
      };
    }
    if (!current_USERNAME) {
      SET_error("Current username not provided");
      return {
        success: false,
        msg: "🔴 Current username not provided 🔴",
      };
    }
    if (!new_USERNAME) {
      SET_error("Username cannot be empty");
      return {
        success: false,
        msg: "🔴 List ID not provided for renaming 🔴",
      };
    }
    if (new_USERNAME === current_USERNAME) {
      SET_error("This is already your username");
      return {
        success: false,
        msg: "🔴 This is already your username 🔴",
      };
    }
    if (new_USERNAME?.length < 6) {
      SET_error("Username must have at least 6 characters");
      return {
        success: false,
        msg: "🔴 Username must have at least 6 characters 🔴",
      };
    }

    SET_loading(true);

    try {
      const DOES_userWithThisUsernameAlreadyExist = await supabase
        .from("users")
        .select("username")
        .eq("username", new_USERNAME)
        .single();

      if (DOES_userWithThisUsernameAlreadyExist.data) {
        SET_error("A user with this username already exists");
        return {
          success: false,
          msg: "🔴 A user with this username already exists 🔴",
        };
      }

      const { data: user, error } = await supabase
        .from("users")
        .update({ username: new_USERNAME })
        .eq("id", user_id)
        .select("*")
        .single();

      if (error) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Something went wrong when editing username 🔴: ${error}`,
        };
      }

      return { success: true, user };
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
    } finally {
      SET_loading(false);
    }
  };

  return { EDIT_username, loading, error, RESET_error };
}
