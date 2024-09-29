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

export default function _layout() {
  return (
    <Langs_PROVIDER>
      <Auth_PROVIDER>
        <ToastProvider
          renderType={{
            custom_success: (toast) => (
              <Notification_BOX type="success" text={toast?.message} />
            ),
            custom_error: (toast) => (
              <Notification_BOX type="error" text={toast?.message} />
            ),
            custom_warning: (toast) => (
              <Notification_BOX type="warning" text={toast?.message} />
            ),
          }}
          style={{ bottom: 400 }}
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
      // trigger every time user logs in/out or registers
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          SET_auth(session?.user);
          await GET_userData(session?.user); // await user data fetching
          router.push("/(main)/explore"); // push only after fetching user data
        } else {
          SET_auth(null);
          router.push("/welcome");
        }
      });
    }
  }, [loaded, ARE_languagesLoading]);

  console.log("langs: ", languages?.length);

  async function GET_userData(user) {
    let res = await FETCH_userData(user?.id);
    if (res.success) SET_userData(res.data);
  }

  if (!loaded) return null;

  return <Slot />;
}
