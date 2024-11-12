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
import {
  Notifications_MODEL,
  Payments_MODEL,
} from "@/src/db/watermelon_MODELS";
import USE_fetchPayments from "@/src/features/7_payments/hooks/USE_fetchPayments";
import USE_zustand from "@/src/zustand";
import Expandable_BTN from "@/src/components/Expandable_BTN";

export default function Payments_PAGE() {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { payments, ARE_paymentsFetching, fetchPayments_ERROR } =
    USE_fetchPayments(z_user?.id);

  return (
    <Page_WRAP>
      <Header
        title={t("header.payments")}
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
        data={payments}
        renderItem={({ item }) => {
          return (
            <Expandable_BTN
              title={item.item}
              subtitle={TRANSFORM_dateObject(item.created_at || 0)}
              children={
                <>
                  <Styled_TEXT type="label">
                    Transaction id: {item?.transaction_id}
                  </Styled_TEXT>
                  <Styled_TEXT type="label">
                    Payment method: {item?.payment_method}
                  </Styled_TEXT>
                  <Styled_TEXT type="label">
                    Payment amount: €{item?.amount}
                  </Styled_TEXT>
                </>
              }
            />
          );

          // <Payment payment={item} />;
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

  // Get the day, month name, and year for the given date
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Get today's date for precise comparison
  const today = new Date();
  const isToday =
    today.getDate() === day &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === year;

  // Return formatted date, with "(today)" if the date is today
  return isToday
    ? `${day}. ${monthName}, ${year} (today)`
    : `${day}. ${monthName}, ${year}`;
}

function Payment({ payment }: { payment: Payments_MODEL | undefined }) {
  return (
    <View
      style={{
        backgroundColor: MyColors.btn_1,
        borderWidth: 1,
        borderColor: MyColors.border_white_005,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
      }}
    >
      <Styled_TEXT type="text_18_bold">{payment?.item}</Styled_TEXT>
      <Styled_TEXT type="label">
        {TRANSFORM_dateObject(payment?.created_at || 0)}
      </Styled_TEXT>
      <Styled_TEXT type="label">
        Transaction id: {payment?.transaction_id}
      </Styled_TEXT>
      <Styled_TEXT type="label">
        Payment method: {payment?.payment_method}
      </Styled_TEXT>
      <Styled_TEXT type="label">Payment amount: €{payment?.amount}</Styled_TEXT>
    </View>
  );
}

const s = StyleSheet.create({});
