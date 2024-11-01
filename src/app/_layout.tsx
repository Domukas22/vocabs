import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Router, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";
import { FETCH_userData } from "../services/userService";

import "@/src/i18n";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import { sync } from "../db/sync";
import db, { Languages_DB, Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";
import { Auth_PROVIDER } from "../context/Auth_CONTEXT";
import USE_zustand, { z_setUser_PROPS } from "../zustand";
import { User_MODEL } from "../db/watermelon_MODELS";
import FETCH_supabaseUser from "../features/5_users/utils/fullSync_FNS/FETCH_userFromSupabase";
import CHECK_ifUserExistsOnSupabase from "../features/5_users/utils/fullSync_FNS/CHECK_ifUserExistsOnSupabase";

export default function _layout() {
  return (
    <Auth_PROVIDER>
      <ToastProvider
        renderType={{
          green: (toast) => (
            <Notification_BOX type="success" text={toast?.message} />
          ),
          red: (toast) => (
            <Notification_BOX type="error" text={toast?.message} />
          ),
          custom_warning: (toast) => (
            <Notification_BOX type="warning" text={toast?.message} />
          ),
        }}
        style={{
          zIndex: 9999, // Ensure it's a high value to stay on top
          elevation: 9999, // For Android devices
        }}
        offsetBottom={120}
      >
        <Main_LAYOUT />
      </ToastProvider>
    </Auth_PROVIDER>
  );
}

function Main_LAYOUT() {
  const router = useRouter();
  const { z_SET_user } = USE_zustand();
  const [loaded] = useFonts({
    "Nunito-Black": require("@/src/assets/fonts/Nunito-Black.ttf"),
    "Nunito-ExtraBold": require("@/src/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Bold": require("@/src/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("@/src/assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("@/src/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("@/src/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Light": require("@/src/assets/fonts/Nunito-Light.ttf"),
  });

  ///////////////////////////////////////////////////////////////////////////////
  // This fires onces once on load
  ///////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    (async () => {
      // Hide splash screen after loading is complete
      await SplashScreen.hideAsync();

      // Proceed only if fonts are loaded
      if (loaded) {
        await SYNC_langs();

        // Check if user_id exists in Secure Store
        const user_ID = await SecureStore.getItemAsync("user_id");

        if (user_ID) {
          // now lets get the user from local db
          const watermelon_USER = await GET_watermelonUser(user_ID);

          if (watermelon_USER) {
            // TODO: if user has updates, they wont be reflected in the context object
            z_SET_user(watermelon_USER);
            await sync("all", user_ID);
            router.push("/(main)/vocabs");
          } else {
            // if watermelon user doesnt exist, we need to create one
            const { success, supabase_USER, msg } = await GET_supabaseUser(
              user_ID
            );

            if (success) {
              const {
                success: createWatermelonUser_SUCCESS,
                watermelon_USER: newWatermelon_USER,
                msg,
              } = await CREATE_watermelonUser(supabase_USER);

              if (createWatermelonUser_SUCCESS) {
                // user found, now just create it locally and continue
                z_SET_user(newWatermelon_USER);
                await sync("all", user_ID);
                router.push("/(main)/vocabs");
              } else {
                // user exists in supabase authentication, but its not in the users table
                console.error(msg);
                // TODO: insert the user into the "users" table
                z_SET_user(undefined);
                router.push("/welcome");
              }
            } else {
              // user exists in supabase authentication, but its not in the users table
              console.error(
                `🔴 user with ID "${user_ID}" exists in supabase authentication, but its not in the users table 🔴`
              );
              // TODO: insert the user into the "users" table
              z_SET_user(undefined);
              router.push("/welcome");
            }
          }

          router.push("/(main)/vocabs");
        } else {
          // If user_id does not exist, to welcome screen
          z_SET_user(undefined); // clear user state as a precaution
          router.push("/welcome");
        }
      }
    })();
  }, [loaded]);

  if (!loaded) return null; // Show nothing while fonts are loading

  return <Slot />;
}

async function SYNC_langs() {
  // First, check if there are any languages already in WatermelonDB
  const existingLanguages = await Languages_DB.query().fetch();

  // If there are existing languages, skip syncing
  if (existingLanguages && existingLanguages.length > 0) {
    return;
  }

  // Fetch languages from Supabase if WatermelonDB is empty
  const { data: languages, error } = await supabase
    .from("languages")
    .select("*");

  if (error) {
    console.error("Error fetching languages from Supabase:", error.message);
    return;
  }

  // Start a write transaction in WatermelonDB
  await db.write(async () => {
    // Loop through the fetched languages
    for (const lang of languages) {
      // Check if the language already exists in WatermelonDB
      const existingLang = await Languages_DB.query(
        Q.where("lang_id", lang?.lang_id)
      ).fetch();

      if (!existingLang || existingLang.length === 0) {
        // If it doesn't exist, create a new record
        await Languages_DB.create((l) => {
          l._raw.id = lang?.lang_id;
          l.lang_id = lang.lang_id;
          l.lang_in_en = lang.lang_in_en;
          l.lang_in_de = lang.lang_in_de;
          l.country_in_en = lang.country_in_en;
          l.country_in_de = lang.country_in_de;
          l.translation_example = lang.translation_example;
          l.translation_example_highlights =
            lang.translation_example_highlights;
          l.description_example = lang.description_example;
        });
      }
    }
  });
}

export async function GET_watermelonUser(user_id: string | undefined) {
  if (!user_id) return undefined;

  const watermelon_USER = await Users_DB.query(Q.where("id", user_id));
  return watermelon_USER?.[0] ? watermelon_USER?.[0] : undefined;
}
export async function GET_supabaseUser(user_id: string | undefined) {
  if (!user_id) {
    console.error("🔴 User id not defined when fetching user from supabase 🔴");
    return {
      msg: "🔴 User id not defined when fetching user from supabase 🔴",
      success: false,
    };
  }

  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error(error);
    return { msg: "🔴 Error fetching user from supabase 🔴", success: false };
  }

  return { success: true, supabase_USER: user };
}

export async function CREATE_watermelonUser(
  supabase_USER: User_MODEL | undefined
) {
  if (!supabase_USER) {
    console.error(
      "🔴 supabase_USER not defined when creating watermelon user 🔴"
    );
    return {
      msg: "🔴 supabase_USER not defined when creating watermelon user 🔴",
      success: false,
    };
  }

  let watermelon_USER = undefined;

  db.write(async () => {
    const user = await Users_DB.create((user: User_MODEL) => {
      user._raw.id = supabase_USER.id;
      user.username = supabase_USER.username;
      user.email = supabase_USER.email;
      user.max_vocabs = supabase_USER.max_vocabs;
      user.list_submit_attempt_count = supabase_USER.list_submit_attempt_count;
      user.preferred_lang_id = supabase_USER.preferred_lang_id;
    });

    if (!user) {
      console.error("🔴 Something went wrong when creating watermelon user 🔴");
      return {
        msg: "🔴 Something went wrong when creating watermelon user 🔴",
        success: false,
      };
    } else {
      watermelon_USER = user;
    }
  });

  return { success: true, watermelon_USER };
}

export async function HANDLE_contentAndRedirection({
  router,
  user_id,
  z_SET_user,
}: {
  router: Router;
  user_id: string;
  z_SET_user: z_setUser_PROPS;
}) {
  // if user_id is stored, find the watermelonDB user object
  // Sidenote: can't use .find, becasue it throws a weird error when not found
  const watermelon_USER = await Users_DB.query(Q.where("id", user_id));

  if (watermelon_USER?.[0]) {
    // if user found, set user info into context for global refferencing
    z_SET_user(watermelon_USER?.[0]);
    router.push("/(main)/vocabs");
  } else {
    // else fetch the user from supabase

    const { success: checkUserOnSupabase_SUCESS, exists } =
      await CHECK_ifUserExistsOnSupabase(user_id);
    if (exists) {
      await sync("all", user_id);
      // if user does exist on supabase, perform an complete sync of all data
      // await db.write(async () => {
      //   const newUser = await Users_DB.create((user: User_MODEL) => {
      //     user._raw.id = user_DATA.id;
      //     user.username = user_DATA.username;
      //     user.email = user_DATA.email;
      //     user.max_vocabs = user_DATA.max_vocabs;
      //     user.list_submit_attempt_count = user_DATA.list_submit_attempt_count;
      //     user.preferred_lang_id = user_DATA.preferred_lang_id;
      //   });

      //   if (newUser) {
      //     z_SET_user(newUser);
      //     router.push("/(main)/vocabs");
      //   }
      // });
    } else {
      // if not found, that means the user doesnt exist -> clear expo secure store and go to welcome screen
      await SecureStore.setItemAsync("user_id", "");
      z_SET_user(undefined);
      router.push("/welcome");
    }
  }
}
