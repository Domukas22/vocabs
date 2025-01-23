//

import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import React from "react";
import { CREATE_watermelonUser } from "@/src/features/users/functions/create/CREATE_watermelonUser/CREATE_watermelonUser";
import {
  FETCH_mySupabaseProfile,
  FETCH_watermelonUser,
} from "@/src/features/users/functions";
import { USE_sync, USE_zustand } from "@/src/hooks";

export function USE_navigateUser({
  navigateToWelcomeSreenOnError = false,
  SET_error,
  SHOW_recoveryModal,
}: {
  navigateToWelcomeSreenOnError?: boolean;
  SET_error?: React.Dispatch<
    React.SetStateAction<{ value: boolean; user_MSG: string }>
  >;
  SHOW_recoveryModal?: () => void;
}) {
  const router = useRouter();
  const { sync } = USE_sync();
  const { z_SET_user } = USE_zustand();

  const NAVIGATE_toWelcomeScreen = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
    router.push("/welcome");
  };

  const navigate = async () => {
    let user_id = await SecureStore.getItemAsync("user_id");

    if (!user_id) {
      await NAVIGATE_toWelcomeScreen();
      return;
    }

    // previously logged in, so try to find the watermelon user object
    const watermelon_USER = await FETCH_watermelonUser(user_id);

    // user not found locally, try to fetch from supabase
    if (!watermelon_USER) {
      const { supabase_USER, success, msg, error_REASON } =
        await FETCH_mySupabaseProfile(user_id);

      if (!success) {
        // if its the initial load, we dont need to display eny error.
        if (navigateToWelcomeSreenOnError) {
          await NAVIGATE_toWelcomeScreen();
          return;
        }

        // display an error
        if (SET_error) {
          SET_error({ value: true, user_MSG: msg || "" });
        }
        return;
      }

      // supabase user doesnt exist
      if (!supabase_USER) {
        if (navigateToWelcomeSreenOnError) {
          // profiel doesnt exist AND its the initial load
          await NAVIGATE_toWelcomeScreen();
          return;
        }

        if (SET_error) {
          SET_error({ value: true, user_MSG: "This profile does not exist" });
        }
        return;
      }

      if (supabase_USER.deleted_at !== null) {
        if (SHOW_recoveryModal) {
          SHOW_recoveryModal();
        }
        return;
      }

      // user found on supabase, create user on watermelon
      const {
        success: watermelon_SUCCESS,
        watermelon_USER,
        msg: watermelon_MSG,
        error_REASON: watermelonError_REASON,
      } = await CREATE_watermelonUser(supabase_USER);

      if (watermelon_SUCCESS) {
        z_SET_user(watermelon_USER);
        await sync({ user: watermelon_USER, PULL_EVERYTHING: true });
        router.push("/(main)/vocabs");
        return;
      } else {
        if (navigateToWelcomeSreenOnError) {
          await NAVIGATE_toWelcomeScreen();
          return;
        }
        if (SET_error) {
          SET_error({
            value: true,
            user_MSG: watermelon_MSG || "Something went wrong",
          });
        }
        return;
      }
    }

    // user found locally, update zustand user
    z_SET_user(watermelon_USER);

    // see if user can be fetched from supabase for sync
    const { supabase_USER, success, msg, error_REASON } =
      await FETCH_mySupabaseProfile(user_id);

    if (!success) {
      if (error_REASON === "user_internet") {
        // the user is offline, let him continue using the app offline
        router.push("/(main)/vocabs");
        return;
      }
      // not sure what to do here

      router?.push("/(main)/vocabs");
      return;
    }

    // user was not found on supabase, this means it doesnt exist on the supabase users table
    if (!supabase_USER) {
      await watermelon_USER.SOFT_DELETE_user();
      await NAVIGATE_toWelcomeScreen();
      return;
    }

    if (supabase_USER.deleted_at !== null) {
      if (SHOW_recoveryModal) {
        SHOW_recoveryModal();
      }
      return;
    }

    // user was found on supabase, lets sync the user profile
    await sync({ user: watermelon_USER, PULL_EVERYTHING: true });

    router.push("/(main)/vocabs");
  };

  return { navigate };
}
