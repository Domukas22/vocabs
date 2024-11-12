//
//
//

import {
  ICON_general,
  ICON_search,
  ICON_vocabs,
} from "@/src/components/icons/icons";

import { MyColors } from "@/src/constants/MyColors";
import USE_observeUserUnreadNotificationCount from "@/src/features/5_users/hooks/USE_observeUserUnreadNotificationCount";
import USE_zustand from "@/src/zustand";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function TabLayout() {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const unreadNotifications_COUnt = USE_observeUserUnreadNotificationCount(
    z_user?.id
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarItemStyle: {
          paddingBottom: 16,
          paddingTop: 8,
          height: 80,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          height: 100,
          minHeight: 100,

          backgroundColor: MyColors.fill_bg,
          borderTopColor: MyColors.border_white_005,
          alignItems: "flex-start",
          alignContent: "flex-start",
          justifyContent: "flex-start",
        },
        tabBarActiveTintColor: MyColors.text_primary,
        tabBarLabelStyle: {
          fontSize: 15, // Adjust font size
          fontFamily: "Nunito-Bold",
        },
      }}
    >
      <Tabs.Screen
        name="vocabs"
        options={{
          title: t("tabs.vocabs"),

          tabBarIcon: ({ focused }) => (
            <View>
              <ICON_vocabs color={focused ? "primary" : "grey"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t("tabs.explore"),
          tabBarIcon: ({ focused }) => (
            <ICON_search
              big={true}
              color={focused ? "primary" : "grey_light"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="general"
        options={{
          title: t("tabs.general"),
          tabBarIcon: ({ focused }) => (
            <ICON_general
              color={focused ? "primary" : "grey"}
              notification_COUNT={unreadNotifications_COUnt}
            />
          ),
        }}
      />
    </Tabs>
  );
}
