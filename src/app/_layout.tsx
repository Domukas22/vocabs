//
//
//
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Slot, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Auth_PROVIDER, USE_auth } from "../context/Auth_CONTEXT";
import { supabase } from "../lib/supabase";
import { FETCH_userData } from "../services/userService";
import { Langs_PROVIDER, USE_langs } from "../context/Langs_CONTEXT";
import { ToastProvider } from "react-native-toast-notifications";
import "@/src/i18n";
import { View } from "react-native";
import { Styled_TEXT } from "../components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "../constants/MyColors";
import { ICON_toastNotification } from "../components/icons/icons";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import { User_MODEL } from "../db/watermelon_MODELS";

export default function _layout() {
  return (
    <Langs_PROVIDER>
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
            bottom: 400,
            zIndex: 9999, // Ensure it's a high value to stay on top
            elevation: 9999, // For Android devices
          }}
        >
          <Main_LAYOUT />
        </ToastProvider>
      </Auth_PROVIDER>
    </Langs_PROVIDER>
  );
}

function Main_LAYOUT() {
  const { SET_auth, SET_userData } = USE_auth();
  const { ARE_languagesLoading, languages } = USE_langs();

  const router = useRouter();
  const [loaded] = useFonts({
    "Nunito-Black": require("@/src/assets/fonts/Nunito-Black.ttf"),
    "Nunito-ExtraBold": require("@/src/assets/fonts/Nunito-ExtraBold.ttf"),
    "Nunito-Bold": require("@/src/assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("@/src/assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("@/src/assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("@/src/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Light": require("@/src/assets/fonts/Nunito-Light.ttf"),
  });

  useEffect(() => {
    SplashScreen.hideAsync();

    if (loaded && !ARE_languagesLoading && languages?.length > 0) {
      // Set up the auth state change listener
      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            SET_auth(session.user);
            const userData = await fetchUserData(session.user);
            if (userData) {
              // await executeSync(); // Sync after fetching user data
              router.push("/(main)/vocabs");
            }
          } else {
            SET_auth(null);
            router.push("/welcome");
          }
        }
      );

      return () => {
        data.subscription.unsubscribe(); // Cleanup the listener on unmount
      };
    }
  }, [loaded, ARE_languagesLoading]);

  async function fetchUserData(user) {
    const res = await FETCH_userData(user.id);
    if (res.success) {
      SET_userData(res.data);

      return res.data; // Return user data if successful
    }
    return null; // Return null if fetching failed
  }

  if (!loaded) return null; // Show nothing while fonts are loading

  return <Slot />;
}
