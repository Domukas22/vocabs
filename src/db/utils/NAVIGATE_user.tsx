//

import { Q } from "@nozbe/watermelondb";
import db, { Users_DB } from "..";
import * as SecureStore from "expo-secure-store";
import { Router, useRouter } from "expo-router";
import USE_zustand, { z_setUser_PROPS } from "@/src/zustand";
import { USE_sync } from "../USE_sync";
import i18next from "i18next";
import { supabase } from "@/src/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { User_MODEL } from "../watermelon_MODELS";
import SEND_internalError from "@/src/utils/SEND_internalError";
import FETCH_mySupabaseProfile from "@/src/features/5_users/utils/FETCH_mySupabaseProfile";
import React, { useState } from "react";
import { CREATE_watermelonUser } from "@/src/features/5_users/utils/CREATE_watermelonUser";
import FETCH_watermelonUser from "@/src/features/5_users/utils/FETCH_watermelonUser";

export default async function NAVIGATE_user({
  navigateToWelcomeSreenOnError = false,
  SET_error,
  z_SET_user,
  router,
  sync,
}: {
  navigateToWelcomeSreenOnError?: boolean;
  SET_error?: React.Dispatch<
    React.SetStateAction<{ value: boolean; user_MSG: string }>
  >;
  z_SET_user: z_setUser_PROPS;
  router: Router;
  sync: ({
    user,
    PULL_EVERYTHING,
  }: {
    user: User_MODEL | undefined;
    PULL_EVERYTHING?: boolean;
  }) => Promise<void>;
}) {
  const NAVIGATE_toWelcomeScreen = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
    router.push("/welcome");
  };

  let user_id = await SecureStore.getItemAsync("user_id");

  if (!user_id) {
    await NAVIGATE_toWelcomeScreen();
    return;
  }

  // previously logged in, so try to find the watermelon user object
  const watermelon_USER = await FETCH_watermelonUser(user_id);
  console.log(0);
  // user not found locally, try to fetch from supabase
  if (!watermelon_USER) {
    console.log(1);

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
    console.log(2);
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
    console.log(3);
    await watermelon_USER.SOFT_DELETE_user();
    await NAVIGATE_toWelcomeScreen();
    return;
  }

  console.log(4);

  // user was found on supabase, lets sync the user profile
  await sync({ user: watermelon_USER });
  console.log(5);
  router.push("/(main)/vocabs");
}
