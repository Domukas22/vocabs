import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ExpoRouter, Router, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

import "@/src/i18n";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import { sync } from "../db/sync";
import db, { Languages_DB, Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";
import { Auth_PROVIDER } from "../context/Auth_CONTEXT";
import USE_zustand, { z_setUser_PROPS } from "../zustand";
import { User_MODEL } from "../db/watermelon_MODELS";
import CHECK_ifUserExistsOnSupabase from "../features/5_users/utils/fullSync_FNS/CHECK_ifUserExistsOnSupabase";

export default function _layout() {
  return (
    <Auth_PROVIDER>
      <ToastProvider
        renderType={(toast) => (
          <Notification_BOX type={toast.type} text={toast.message} />
        )}
        style={toastProviderStyles}
        offsetBottom={120}
      >
        <MainLayout />
      </ToastProvider>
    </Auth_PROVIDER>
  );
}

// Styles for ToastProvider
const toastProviderStyles = {
  zIndex: 9999,
  elevation: 9999,
};

function MainLayout() {
  const router = useRouter();
  const { z_SET_user } = USE_zustand();
  const [fontsLoaded] = useFonts(loadFonts());

  useEffect(() => {
    const initializeApp = async () => {
      await SplashScreen.hideAsync();
      if (fontsLoaded) {
        const userId = await SecureStore.getItemAsync("user_id");
        await HANDLE_userRouting(router, userId, z_SET_user);
      }
    };

    initializeApp();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <Slot />;
}

// Load font files
function loadFonts() {
  return {
    "Nunito-Black": require("@/src/assets/fonts/Nunito-Black.ttf"),
    "Nunito-ExtraBold": require("@/src/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Bold": require("@/src/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("@/src/assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("@/src/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("@/src/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Light": require("@/src/assets/fonts/Nunito-Light.ttf"),
  };
}

// Handle user routing based on existence in SecureStore and WatermelonDB
export async function HANDLE_userRouting(
  router: Router,
  userId: string | null,
  z_SET_user: z_setUser_PROPS
) {
  if (userId) {
    const localUser = await FETCH_localUser(userId);
    if (localUser) {
      z_SET_user(localUser);
      await sync("all", userId);
      router.push("/(main)/vocabs");
    } else {
      await HANDLE_newUser(userId, z_SET_user, router);
    }
  } else {
    z_SET_user(undefined);
    router.push("/welcome");
  }
}

// Fetch user from WatermelonDB
export async function FETCH_localUser(userId: string) {
  const users = await Users_DB.query(Q.where("id", userId));
  return users[0] || undefined;
}

// Handle new user creation or fetching from Supabase
export async function HANDLE_newUser(
  userId: string,
  z_SET_user: z_setUser_PROPS,
  router: Router
) {
  const { success, supabaseUser } = await FETCH_supabaseUser(userId);
  if (success) {
    const {
      success: userCreated,
      watermelonUser,
      msg,
    } = await CREATE_watermelonUser(supabaseUser);
    if (userCreated) {
      z_SET_user(watermelonUser);
      await sync("all", userId);
      router.push("/(main)/vocabs");
    } else {
      console.error(msg);
      z_SET_user(undefined);
      router.push("/welcome");
    }
  } else {
    console.error(
      `🔴 User with ID "${userId}" exists in Supabase authentication but is not in the users table 🔴`
    );
    z_SET_user(undefined);
    router.push("/welcome");
  }
}

// Fetch user from Supabase
export async function FETCH_supabaseUser(userId: string) {
  if (!userId) {
    console.error("🔴 User ID not defined when fetching from Supabase 🔴");
    return { msg: "🔴 User ID not defined 🔴", success: false };
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.error(error);
    return { msg: "🔴 Error fetching user from Supabase 🔴", success: false };
  }

  return { success: true, supabaseUser: user };
}

// Create a new user in WatermelonDB
export async function CREATE_watermelonUser(supabaseUser: User_MODEL) {
  if (!supabaseUser) {
    console.error(
      "🔴 Supabase user not defined when creating Watermelon user 🔴"
    );
    return { msg: "🔴 Supabase user not defined 🔴", success: false };
  }

  let watermelonUser;
  await db.write(async () => {
    watermelonUser = await Users_DB.create((user) => {
      user._raw.id = supabaseUser.id;
      user.username = supabaseUser.username;
      user.email = supabaseUser.email;
      user.max_vocabs = supabaseUser.max_vocabs;
      user.list_submit_attempt_count = supabaseUser.list_submit_attempt_count;
      user.preferred_lang_id = supabaseUser.preferred_lang_id;
    });
  });

  if (!watermelonUser) {
    console.error("🔴 Something went wrong when creating Watermelon user 🔴");
    return {
      msg: "🔴 Something went wrong when creating Watermelon user 🔴",
      success: false,
    };
  }

  return { success: true, watermelonUser };
}
