//
//
//

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React, { useEffect } from "react";

import "@/src/i18n";
import { Auth_PROVIDER } from "../context/Auth_CONTEXT";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { USE_navigateUser } from "../features/users/functions/general/hooks/USE_navigateUser/USE_navigateUser";
import Toast_CONTEXT from "../context/Toast_CONTEXT";
import Page_WRAP from "../components/1_grouped/Page_WRAP/Page_WRAP";
import { z_USE_user } from "../features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_populateLangs } from "../features_new/languages/hooks";

export default function _layout() {
  return (
    <Auth_PROVIDER>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Toast_CONTEXT>
          <PortalProvider>
            <Content />
          </PortalProvider>
        </Toast_CONTEXT>
      </GestureHandlerRootView>
    </Auth_PROVIDER>
  );
}

function Content() {
  const [fontsLoaded] = useFonts(loadFonts());
  const { navigate } = USE_navigateUser();
  const { z_user } = z_USE_user();
  const { POPULATE_langs } = USE_populateLangs();

  // --------------------------------------------
  // Initial navigation
  useEffect(() => {
    const initializeApp = async () => {
      if (fontsLoaded) {
        await POPULATE_langs();
        await navigate();
      }
    };

    initializeApp();
  }, [fontsLoaded]);

  // --------------------------------------------
  // in case something happens to the zustand user obj, re-navigate
  useEffect(() => {
    if ((!z_user || !z_user?.id) && fontsLoaded) {
      (async () => {
        await navigate();
      })();
    }
  }, [z_user]);

  return (
    <Page_WRAP>
      <Slot />
    </Page_WRAP>
  );
}
// Slot is usually used in the upper most _layout file
// -- Depending on the current route, the contents of that route will be inserted into this slot
// -- Some of the routes might contain a Stack, which is like a folder of files that you can navigate with the Tabs component

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
