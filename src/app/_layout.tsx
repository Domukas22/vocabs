import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { ExpoRouter, Router, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

import "@/src/i18n";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import { USE_sync } from "../db/USE_sync";
import db, { Languages_DB, Users_DB } from "../db";
import { Q } from "@nozbe/watermelondb";
import { Auth_PROVIDER } from "../context/Auth_CONTEXT";
import USE_zustand, { z_setUser_PROPS } from "../zustand";
import { User_MODEL } from "../db/watermelon_MODELS";
import i18next from "@/src/i18n";
import REFRESH_zustandUser from "../features/5_users/utils/REFRESH_zustandUser";
import USE_handleUserNavigation from "../db/utils/NAVIGATE_user";
import SEND_internalError from "../utils/SEND_internalError";
import NAVIGATE_user from "../db/utils/NAVIGATE_user";

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
  const [fontsLoaded] = useFonts(loadFonts());
  const { sync } = USE_sync();
  const { z_SET_user } = USE_zustand();

  useEffect(() => {
    const initializeApp = async () => {
      await SplashScreen.hideAsync();
      if (fontsLoaded) {
        await NAVIGATE_user({
          navigateToWelcomeSreenOnError: true,
          router,
          z_SET_user,
          sync,
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
