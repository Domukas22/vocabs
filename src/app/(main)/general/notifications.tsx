//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import {
  ICON_3dots,
  ICON_arrow,
  ICON_trash,
} from "@/src/components/icons/icons";

import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet } from "react-native";

import { router } from "expo-router";

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useTranslation } from "react-i18next";
import USE_fetchNotifications from "@/src/features/6_notifications/hooks/USE_fetchNotifications";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { HEADER_MARGIN } from "@/src/constants/globalVars";
import ExploreList_BTN from "@/src/features/1_lists/components/ExploreList_BTN";
import ExploreListsBottom_SECTION from "@/src/features/1_lists/components/ExploreListsBottom_SECTION";
import { Notifications_MODEL } from "@/src/db/watermelon_MODELS";
import USE_updateNotification from "@/src/features/6_notifications/hooks/USE_updateNotification";
import USE_zustand from "@/src/zustand";

export default function Notifications_PAGE() {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { notifications, ARE_notificationsFetching, fetchNotifications_ERROR } =
    USE_fetchNotifications(z_user?.id);

  const {
    EDIT_notificationReadStatus,
    IS_notificationUpdating,
    updateNotification_ERROR,
    RESET_notificationError,
  } = USE_updateNotification();
  // const {value, target} = IS_notificationUpdating

  return (
    <Page_WRAP>
      <Header
        title={t("header.notifications")}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
      />
      <Styled_FLASHLIST
        data={notifications}
        renderItem={({ item }) => {
          return (
            <Notification_BTN
              notification={item}
              TOGGLE_read={() =>
                EDIT_notificationReadStatus(item.id, !item.is_read)
              }
            />
          );
        }}
        keyExtractor={(item) => "PublicVocab" + item.id}
      />
    </Page_WRAP>
  );
}

export function TRANSFORM_dateObject(_date: number) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Convert the timestamp to a Date object
  const date = new Date(_date);

  // Get the day, month name, and year
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Calculate the difference in days from today
  const today = new Date();
  const differenceInTime = today.getTime() - date.getTime();
  const daysAgo = Math.floor(differenceInTime / (1000 * 3600 * 24));

  // Return the formatted date with the days ago part
  return `${day}. ${monthName}, ${year} (${daysAgo} days ago)`;
}

function Notification_BTN({
  notification,
  TOGGLE_read,
}: {
  notification: Notifications_MODEL | undefined;
  TOGGLE_read: () => void;
}) {
  const [open, SET_open] = useState(false);

  return (
    <View
      style={[
        s.btn,
        open && s.btn_OPEN,
        open && !notification?.is_read && s.btnActive_OPEN,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          s.btn_TOP,
          !notification?.is_read && s.btnTop_ACTIVE,
          pressed && !open && s.btnTop_PRESSED,
          pressed && !notification?.is_read && s.btnTopactive_PRESSED,
          open && s.btnTop_OPEN,
        ]}
        onPress={() => {
          if (!open) SET_open(true);
        }}
      >
        <Styled_TEXT
          type="text_18_bold"
          style={{
            color: !notification?.is_read ? MyColors.text_primary : "white",
          }}
        >
          {notification?.title}
        </Styled_TEXT>
        <Styled_TEXT
          type="label_small"
          // style={[!notification?.is_read && { color: "white" }]}
        >
          {TRANSFORM_dateObject(notification?.createdAt || 0)}
        </Styled_TEXT>
      </Pressable>
      {open && (
        <>
          <View style={s.paragraph_WRAP}>
            <Styled_TEXT type="label">{notification?.paragraph}</Styled_TEXT>
          </View>
          <View style={s.btn_WRAP}>
            <Btn
              text={notification?.is_read ? "Mark as unread" : "Mark as read"}
              style={{ flex: 1 }}
              onPress={TOGGLE_read}
            />
            <Btn text="Close" onPress={() => SET_open(false)} />
            {/* <Btn iconLeft={<ICON_trash />} onPress={() => {}} /> */}
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    borderRadius: 16,
    borderColor: "transparent",
    borderWidth: 1,
  },
  btn_OPEN: {
    borderColor: MyColors.border_white_005,
  },
  btnActive_OPEN: {
    borderColor: MyColors.border_primary,
  },
  btn_TOP: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  btnTop_ACTIVE: {
    backgroundColor: MyColors.btn_active,
    borderColor: MyColors.border_primary,
  },

  btnTop_PRESSED: {
    backgroundColor: MyColors.btn_3,
  },
  btnTopactive_PRESSED: {
    backgroundColor: MyColors.btn_active_press,
  },
  btnTop_OPEN: {
    backgroundColor: MyColors.btn_1,
    borderColor: "transparent",
  },
  paragraph_WRAP: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: MyColors.border_white_005,
  },
  btn_WRAP: {
    borderTopWidth: 1,
    borderTopColor: MyColors.border_white_005,
    padding: 12,
    gap: 8,
    flexDirection: "row",
  },
});
