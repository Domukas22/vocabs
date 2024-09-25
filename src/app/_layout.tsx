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
import "@/src/i18n";
import { User_MODEL } from "../db/models";

export default function _layout() {
  return (
    <Auth_PROVIDER>
      <Langs_PROVIDER>
        <Main_LAYOUT />
      </Langs_PROVIDER>
    </Auth_PROVIDER>
  );
}

function Main_LAYOUT() {
  const { SET_auth, SET_userData } = USE_auth();
  const { ARE_languagesLoading } = USE_langs();

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
    if (loaded && !ARE_languagesLoading) {
      // trigger every time user logs in/out or registers
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          SET_auth(session?.user);
          GET_userData(session?.user);
          // router.push("/(main)/vocabs");
          router.push("/(main)/vocabs");
        } else {
          SET_auth(null);
          router.push("/welcome");
          // router.push("/");
        }
      });
    }
  }, [loaded, ARE_languagesLoading]);

  async function GET_userData(user) {
    let res = await FETCH_userData(user?.id);
    // we could also use the SET_auth function, but we defined the SET_userData for clarity
    if (res.success) SET_userData(res.data);
  }

  if (!loaded) return null;

  return <Slot />;
}
