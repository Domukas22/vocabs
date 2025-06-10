//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";

import {
  ICON_3dots,
  ICON_arrow2,
} from "@/src/components/1_grouped/icons/icons";

import React from "react";
import { StyleSheet } from "react-native";

import { router } from "expo-router";

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import Payments_MODEL from "@/src/db/models/Payments_MODEL";
import { USE_fetchPayments } from "@/src/features/payments/functions";
import Expandable_BTN from "@/src/components/1_grouped/buttons/Expandable_BTN/Expandable_BTN";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

export default function Payments_PAGE() {
  const { t } = useTranslation();
  const { z_user } = z_USE_user();
  const { payments, ARE_paymentsFetching, fetchPayments_ERROR } =
    USE_fetchPayments(z_user?.id);

  return (
    <>
      <Header
        title={t("header.payments")}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow2 />}
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
              subtitle={TRANSFORM_dateObject(item.createdAt || 0)}
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
    </>
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
        {TRANSFORM_dateObject(payment?.createdAt || 0)}
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
