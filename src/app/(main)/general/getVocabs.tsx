//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Link, router } from "expo-router";

import Block from "@/src/components/Block/Block";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Label from "@/src/components/Label/Label";
import { useTranslation } from "react-i18next";
import Big_BTN from "@/src/components/Transition_BTN/Big_BTN";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { Vocabs_DB } from "@/src/db";
import { withObservables } from "@nozbe/watermelondb/react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import USE_zustand from "@/src/zustand";
import CurrentVocabCount_BAR from "@/src/components/CurrentVocabCount_BAR";
import { VOCAB_PRICING } from "@/src/constants/globalVars";

function __GetVocabs_PAGE({
  totalUserVocab_COUNT = 0,
}: {
  totalUserVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();

  return (
    <Page_WRAP>
      {/* <Styled_TEXT>Total vocab count: {totalUserVocab_COUNT}</Styled_TEXT> */}
      <Header
        title={t("header.getVocabs")}
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
      <ScrollView>
        <Block>
          <Styled_TEXT type="label">
            You have {(z_user?.max_vocabs || 200) - (totalUserVocab_COUNT || 0)}{" "}
            vocabs left
          </Styled_TEXT>

          <CurrentVocabCount_BAR
            totalUserVocab_COUNT={totalUserVocab_COUNT || 0}
            max_vocabs={z_user?.max_vocabs || 0}
            color="white"
          />
        </Block>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 16,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
          }}
        >
          {/* <Styled_TEXT type="label">Get yourself some vocabs!</Styled_TEXT> */}
          <Pricing_BTN offer={1} />
          <Pricing_BTN offer={2} />
          <Pricing_BTN offer={3} />
        </View>

        <View
          style={{
            padding: 12,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
            marginBottom: 48,
          }}
        >
          <Styled_TEXT type="text_18_bold">
            Are there other ways to get vocabs?
          </Styled_TEXT>
          <Styled_TEXT>
            Yes! Here are a few ways how you can earn vocabs for free:
          </Styled_TEXT>
          <Styled_TEXT>
            1.{" "}
            <Styled_TEXT
              style={{
                fontFamily: "Nunito-Bold",
              }}
            >
              Publish a list:
            </Styled_TEXT>{" "}
            If your list is accepted for publish, your will receive{" "}
            <Styled_TEXT style={{ textDecorationLine: "underline" }}>
              double
            </Styled_TEXT>{" "}
            the amount of vocabs that were inside of your submitted list. Keep
            in mind that there are certain rules your list must adhere to.
          </Styled_TEXT>
          <Styled_TEXT>
            2.{" "}
            <Styled_TEXT
              style={{
                fontFamily: "Nunito-Bold",
              }}
            >
              Invite a friend to the app:
            </Styled_TEXT>{" "}
            As you're completing your first vocab purchase, a pop-up will
            appear, asking you if you were invited to join this app by a friend.
            The person you select will receive the same amount of vocabs that
            you are buying. Note that this only works for your very first
            purchase. If you invite a friend and he decides to make a purchase,
            he can then select your username and you will get
          </Styled_TEXT>
        </View>
      </ScrollView>
    </Page_WRAP>
  );
}
export default function GetVocabs_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    totalUserVocab_COUNT: z_user?.totalVocab_COUNT
      ? z_user?.totalVocab_COUNT
      : undefined,
  }));

  const EnhancedPage = enhance(__GetVocabs_PAGE);

  // Pass the observable to the EnhancedPage
  return <EnhancedPage />;
}

function Pricing_BTN({ offer = 1 }: { offer: 1 | 2 | 3 }) {
  const pricing = VOCAB_PRICING[offer];

  return (
    <Big_BTN
      onPress={() => {}}
      style={{ paddingVertical: 12, paddingHorizontal: 16 }}
    >
      <Styled_TEXT type="text_20_bold">
        Get {pricing.amount} Vocabs for{" "}
        <Styled_TEXT
          type="text_20_bold"
          style={{ color: MyColors.text_primary }}
          // style={{ textDecorationLine: "underline" }}
        >
          €{pricing.price}
        </Styled_TEXT>
      </Styled_TEXT>
      <Styled_TEXT type="label">{pricing.descritpion}</Styled_TEXT>
      <Styled_TEXT
        type="label"
        style={[
          { fontFamily: "Nunito-Semibold" },
          pricing.discount > 0 && { color: MyColors.text_green },
        ]}
      >
        {pricing.discount}% discount
      </Styled_TEXT>
    </Big_BTN>
  );
}
