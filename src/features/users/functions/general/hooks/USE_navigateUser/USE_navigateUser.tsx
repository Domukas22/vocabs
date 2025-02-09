//

import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import { useCallback, useState } from "react";
import {
  FETCH_mySupabaseProfile,
  USE_clearUserContext,
} from "@/src/features/users/functions";
import { USE_zustand } from "@/src/hooks";
import { Error_PROPS } from "@/src/props";

export function USE_navigateUser(SHOW_recoveryModal = () => {}) {
  const { CLEAR_userContext } = USE_clearUserContext();
  const router = useRouter();
  const { z_SET_user } = USE_zustand();

  const [navigation_ERROR, SET_navigationError] = useState<
    Error_PROPS | undefined
  >();

  const NAVIGATE_toWelcomeScreen = useCallback(async () => {
    await CLEAR_userContext();
    router.push("/welcome");
  }, []);

  const navigate = async function NAVIGATE_userToVocabPageOrWelcomePage(
    SEND_toWelcomeScreen = false
  ) {
    SET_navigationError(undefined);

    // If explicitly asked to return to welcome screen, clear context values and return to welcome screen
    if (SEND_toWelcomeScreen) return await NAVIGATE_toWelcomeScreen();

    // Try to find the saved user_id in local storage
    const user_id = await SecureStore.getItemAsync("user_id");

    // If user_id is not saved in local storage, then the user is not logged in.
    // Redirect to welcome page.
    if (!user_id) return await NAVIGATE_toWelcomeScreen();

    // Try to find the user on supabase with the saved user_id in local storage.
    const { supabase_USER, error } = await FETCH_mySupabaseProfile(user_id);

    // If the user wasn't found in supabase with the user_id saved in local storage,
    // send an error with the function provided as an argument
    if (error) return SET_navigationError(error);

    // If the user was found on supabase, and the profile was deleted
    // show the profile recovery modal
    if (supabase_USER?.deleted_at !== null) return SHOW_recoveryModal();

    // -----------------------

    // User found on supabase => insert into zustand state
    z_SET_user(supabase_USER);
    router.push("/vocabs");
  };

  return { navigate, navigation_ERROR, SHOW_recoveryModal };
}
