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
import i18next from "@/src/i18n";

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

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// Handle user routing based on existence in SecureStore and WatermelonDB
export async function HANDLE_userRouting(
  router: Router,
  userId: string | null,
  z_SET_user: z_setUser_PROPS
) {
  const NAVIGATE_toWelcomeScreen = async () => {
    await SecureStore.setItemAsync("user_id", "");
    z_SET_user(undefined);
    router.push("/welcome");
  };

  const NAVIGATE_tovocabs = async (user: User_MODEL) => {
    z_SET_user(user);
    i18next.changeLanguage(user?.preferred_lang_id || "en");
    await sync("all", user?.id || "");
    router.push("/(main)/general");
  };

  if (userId) {
    // find the user on WatermelonDB and Supabase
    const localUser = await FETCH_watermelonUser(userId);
    const { success, supabaseUser } = await FETCH_supabaseUser(userId);

    // 1. if found on watermelon, but not supabase ==> delete watermelon user + redirect to welcome screen
    // 2. if found on supabase, but not watermelon ==> create user on watermelon + sync all + redirect to vocabs
    // 3. if found on both ==> sync all + redirect to vocabs
    // 4. if not found on any ==> redirect to welcome screen

    // 1.
    if (localUser && !supabaseUser) {
      // delete watermelon user + redirect to welcome screen
      await localUser.SOFT_DELETE_user();
      await NAVIGATE_toWelcomeScreen();
    }
    // 2.
    if (!localUser && supabaseUser) {
      // create user on watermelon + sync all + redirect to vocabs
      const { success, watermelonUser, msg } = await CREATE_watermelonUser(
        supabaseUser
      );
      if (success && watermelonUser) await NAVIGATE_tovocabs(watermelonUser);
      else await NAVIGATE_toWelcomeScreen();
    }
    // 3.
    if (localUser && supabaseUser) {
      await NAVIGATE_tovocabs(localUser);
    }
    // 4.
    if (!localUser && !supabaseUser) {
      await NAVIGATE_toWelcomeScreen();
    }
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

  return { success: true, supabaseUser: user };
}

// Fetch user from WatermelonDB
async function FETCH_watermelonUser(userId: string) {
  const users = await Users_DB.query(Q.where("id", userId));
  return users[0] || undefined;
}

// Create a new user in WatermelonDB
async function CREATE_watermelonUser(supabaseUser: User_MODEL) {
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
