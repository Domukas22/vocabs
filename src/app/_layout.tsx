import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ExpoRouter, Router, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

import "@/src/i18n";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import { sync, USE_sync_2 } from "../db/sync";
import db, { Languages_DB, Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";
import { Auth_PROVIDER } from "../context/Auth_CONTEXT";
import USE_zustand, { z_setUser_PROPS } from "../zustand";
import { User_MODEL } from "../db/watermelon_MODELS";
import i18next from "@/src/i18n";
import REFRESH_zustandUser from "../features/5_users/utils/REFRESH_zustandUser";

export default function _layout() {
  return (
    <Auth_PROVIDER>
      <ToastProvider
        renderType={{
          // Define a render function for each toast type
          success: (toast: any) => (
            <Notification_BOX type="success" text={toast.message} />
          ),
          error: (toast: any) => (
            <Notification_BOX type="error" text={toast.message} />
          ),
          // Add more toast types as needed
        }}
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
  const { sync: sync_2 } = USE_sync_2();
  const { NAVIGATE_toVocabs, NAVIGATE_toWelcomeScreen } = USE_navigate();

  useEffect(() => {
    const initializeApp = async () => {
      await SplashScreen.hideAsync();
      if (fontsLoaded) {
        const userId = await SecureStore.getItemAsync("user_id");
        await HANDLE_userRouting({
          userId,
          NAVIGATE_toVocabs,
          NAVIGATE_toWelcomeScreen,
        });
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

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

export async function GET_watermelonAndSupabaseUser(userId: string | null) {
  if (!userId) return { watermelon_USER: undefined, supabase_USER: undefined };
  const watermelon_USER = await FETCH_watermelonUser(userId);
  const { supabase_USER } = await FETCH_supabaseUser(userId);

  return { watermelon_USER, supabase_USER };
}

export async function HANDLE_initialRouting({
  watermelon_USER,
  supabase_USER,
  NAVIGATE_toVocabs,
  NAVIGATE_toWelcomeScreen,
}: {
  watermelon_USER: User_MODEL | undefined;
  supabase_USER: any;
  NAVIGATE_toVocabs: () => Promise<void>;
  NAVIGATE_toWelcomeScreen: () => Promise<void>;
}) {
  //
  //
  // 3. if found on both ==> sync all + redirect to vocabs

  // 1. if found on watermelon, but not supabase ==> delete watermelon user + redirect to welcome screen
  if (watermelon_USER && !supabase_USER) {
    // delete watermelon user + redirect to welcome screen
    await watermelon_USER.SOFT_DELETE_user();
    await NAVIGATE_toWelcomeScreen();
  }
  // 2. if found on supabase, but not watermelon ==> create user on watermelon + sync all + redirect to vocabs
  if (!watermelon_USER && supabase_USER) {
    // check if supabase user is deleted
    // if yes, let user recover it.
    // if no, continue

    // create user on watermelon + sync all + redirect to vocabs
    const { success, watermelonUser, msg } = await CREATE_watermelonUser(
      supabase_USER
    );
    if (success && watermelonUser) {
      await NAVIGATE_toVocabs();
    } else await NAVIGATE_toWelcomeScreen();
  }
  // 3.
  if (watermelon_USER && supabase_USER) {
    // check if supabase user is deleted
    // if yes, let user recover it.
    // if no, continue
    await NAVIGATE_toVocabs();
  }

  if (!watermelon_USER && !supabase_USER) {
    await NAVIGATE_toWelcomeScreen();
  }
}

export function USE_navigate() {
  const { z_SET_user } = USE_zustand();
  const router = useRouter();
  const { sync: sync_2, HAS_syncError } = USE_sync_2();

  const NAVIGATE_toVocabs = async (user: User_MODEL | undefined) => {
    if (!user) return;

    await SecureStore.setItemAsync("user_id", user?.id);
    await sync_2("updates", user);
    i18next.changeLanguage(user?.preferred_lang_id || "en");
    router.push("/(main)/vocabs");
  };

  const NAVIGATE_toWelcomeScreen = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
    router.push("/welcome");
  };

  return { NAVIGATE_toVocabs, NAVIGATE_toWelcomeScreen };
}

// Handle user routing based on existence in SecureStore and WatermelonDB
export async function HANDLE_userRouting({
  userId,
  NAVIGATE_toVocabs,
  NAVIGATE_toWelcomeScreen,
}: {
  userId: string | null;
  NAVIGATE_toVocabs: (user: User_MODEL | undefined) => Promise<void>;
  NAVIGATE_toWelcomeScreen: () => Promise<void>;
}) {
  // const NAVIGATE_toWelcomeScreen = async () => {
  //   await SecureStore.setItemAsync("user_id", "");
  //   z_SET_user(undefined);
  //   router.push("/welcome");
  // };

  // const NAVIGATE_tovocabs = async (user: User_MODEL) => {
  //   // z_SET_user(user);

  //   i18next.changeLanguage(user?.preferred_lang_id || "en");
  //   await sync("updates", user);
  //   const updated_USER = await user.UPDATE_lastPulledAt();
  //   if (updated_USER) {
  //     z_SET_user(updated_USER);
  //   }
  //   router.push("/(main)/vocabs");
  // };

  if (userId) {
    // find the user on WatermelonDB and Supabase

    const localUser = await FETCH_watermelonUser(userId);
    const { supabase_USER } = await FETCH_supabaseUser(userId);

    // 1. if found on watermelon, but not supabase ==> delete watermelon user + redirect to welcome screen
    // 2. if found on supabase, but not watermelon ==> create user on watermelon + sync all + redirect to vocabs
    // 3. if found on both ==> sync all + redirect to vocabs

    // 1.
    if (localUser && !supabase_USER) {
      // delete watermelon user + redirect to welcome screen
      await localUser.SOFT_DELETE_user();
      await NAVIGATE_toWelcomeScreen();
    }
    // 2.
    if (!localUser && supabase_USER) {
      // check if supabase user is deleted
      // if yes, let user recover it.
      // if no, continue

      // create user on watermelon + sync all + redirect to vocabs
      const { success, watermelonUser, msg } = await CREATE_watermelonUser(
        supabase_USER
      );
      if (success && watermelonUser) {
        await NAVIGATE_toVocabs(watermelonUser);
      } else await NAVIGATE_toWelcomeScreen();
    }
    // 3.
    if (localUser && supabase_USER) {
      // check if supabase user is deleted
      // if yes, let user recover it.
      // if no, continue
      await NAVIGATE_toVocabs(localUser);
    }

    if (!localUser && !supabase_USER) {
      await NAVIGATE_toWelcomeScreen();
    }
  } else {
    await NAVIGATE_toWelcomeScreen();
  }
}

// Fetch user from Supabase
async function FETCH_supabaseUser(userId: string) {
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

  return { success: true, supabase_USER: user };
}

// Fetch user from WatermelonDB
async function FETCH_watermelonUser(userId: string) {
  const users = await Users_DB.query(Q.where("id", userId));

  return users?.[0] || undefined;
}

// Create a new user in WatermelonDB
async function CREATE_watermelonUser(supabase_USER: User_MODEL) {
  if (!supabase_USER) {
    console.error(
      "🔴 Supabase user not defined when creating Watermelon user 🔴"
    );
    return { msg: "🔴 Supabase user not defined 🔴", success: false };
  }

  let watermelonUser;
  await db.write(async () => {
    watermelonUser = await Users_DB.create((user) => {
      user._raw.id = supabase_USER.id;
      user.username = supabase_USER.username;
      user.email = supabase_USER.email;
      user.max_vocabs = supabase_USER.max_vocabs;
      user.list_submit_attempt_count = supabase_USER.list_submit_attempt_count;
      user.preferred_lang_id = supabase_USER.preferred_lang_id;
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
