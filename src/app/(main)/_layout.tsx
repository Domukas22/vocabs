//
//
//

import {
  ICON_exploreTab,
  ICON_generalTab,
  ICON_vocabularyTab,
} from "@/src/components/1_grouped/icons/icons";

import { MyColors } from "@/src/constants/MyColors";
import { USE_observeMyUnreadNotificationCount } from "@/src/features/notifications/functions";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const tabBar_HEIGHT = 70;

export default function TabLayout() {
  const { t } = useTranslation();
  const { z_user } = z_USE_user();
  const unreadNotifications_COUnt = USE_observeMyUnreadNotificationCount(
    z_user?.id
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarItemStyle: {
          height: tabBar_HEIGHT,
          paddingTop: 7,
          paddingBottom: 4,
        },

        tabBarStyle: {
          height: tabBar_HEIGHT,
          backgroundColor: MyColors.fill_bg,
          borderTopColor: MyColors.border_white_005,
          alignItems: "flex-start",
          alignContent: "flex-start",
          justifyContent: "flex-start",
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Nunito-Bold",
        },

        tabBarActiveTintColor: MyColors.text_primary,
        tabBarInactiveTintColor: MyColors.text_white_06,
      }}
    >
      <Tabs.Screen
        name="vocabs"
        options={{
          title: t("tabs.vocabs"),

          tabBarIcon: ({ focused }) => (
            <View>
              <ICON_vocabularyTab color={focused ? "primary" : "gray_light"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t("tabs.explore"),
          tabBarIcon: ({ focused }) => (
            <ICON_exploreTab color={focused ? "primary" : "gray_light"} />
          ),
        }}
      />

      <Tabs.Screen
        name="general"
        options={{
          title: t("tabs.general"),
          tabBarIcon: ({ focused }) => (
            <ICON_generalTab color={focused ? "primary" : "gray_light"} />
          ),
        }}
      />
    </Tabs>
  );
}
