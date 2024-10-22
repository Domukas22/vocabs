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
import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { Vocabs_DB } from "@/src/db";
import { withObservables } from "@nozbe/watermelondb/react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

function __GetVocabs_PAGE({
  vocabs = [],
}: {
  vocabs: Vocab_MODEL[] | undefined;
}) {
  const { t } = useTranslation();
  const { user } = USE_auth();

  //   const [vocabs, SET_vocabs]

  //   const totalVocabs = useMemo(() =>

  //     ,[user?.max_vocabs])

  return (
    <Page_WRAP>
      {vocabs &&
        vocabs?.map((v) => (
          <Styled_TEXT key={v.id}>{v.trs?.[0]?.text}</Styled_TEXT>
        ))}

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
        {/* <Block>
          <View style={{ gap: 16 }}>
            <View>
              <Styled_TEXT>
                {user?.max_vocabs - totalVocabs} vocabs left until you reach the
                limit
              </Styled_TEXT>
              <Styled_TEXT type="label">{user?.email}</Styled_TEXT>
              <Styled_TEXT type="label">{user?.username}</Styled_TEXT>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Styled_TEXT
                type="text_18_bold"
                style={{
                  color: MyColors.text_primary,
                }}
              >
                {totalVocabs}
              </Styled_TEXT>
              <View
                style={{
                  height: 12,
                  flex: 1,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: MyColors.border_white_005,
                  backgroundColor: MyColors.btn_3,
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${totalVocabs}%`,
                    borderRadius: 50,
                    backgroundColor: MyColors.icon_primary,
                  }}
                ></View>
              </View>
              <Styled_TEXT
                type="text_18_bold"
                style={{
                  color: MyColors.text_white_06,
                }}
              >
                {user?.max_vocabs}
              </Styled_TEXT>
            </View>
          </View>
        </Block> */}
        <Pricing_BLOCK vocab_COUNT={500} price={4.99} discount={0} cents={1} />
        <Pricing_BLOCK
          vocab_COUNT={1000}
          price={7.99}
          discount={15}
          cents={0.7}
        />
        <Pricing_BLOCK
          vocab_COUNT={2000}
          price={9.99}
          discount={30}
          cents={0.35}
        />
      </ScrollView>
    </Page_WRAP>
  );
}
export default function GetVocabs_PAGE() {
  // const { user } = USE_auth();

  const enhance = withObservables([], () => ({
    vocabs: Vocabs_DB.query(),
  }));

  const EnhancedPage = enhance(__GetVocabs_PAGE);

  // Pass the observable to the EnhancedPage
  return <EnhancedPage />;
}

function Pricing_BLOCK({
  vocab_COUNT,
  price,
  discount,
  cents,
}: {
  vocab_COUNT: number;
  price: number;
  discount: number;
  cents: number;
}) {
  return (
    <Block styles={{ gap: 0, paddingTop: 16, paddingBottom: 20 }}>
      <Styled_TEXT type="text_22_bold">
        {vocab_COUNT} Vocabs for{" "}
        <Styled_TEXT
          type="text_22_bold"
          style={{ color: MyColors.text_primary }}
        >
          €{price}
        </Styled_TEXT>
      </Styled_TEXT>
      <Styled_TEXT
        type="label"
        style={[discount > 0 && { color: MyColors.text_red }]}
      >
        {discount}% discount
      </Styled_TEXT>
      <Styled_TEXT type="label">{cents} cents per vocab</Styled_TEXT>
      <Btn
        text={`Get ${vocab_COUNT} vocabs`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        style={{ marginTop: 12 }}
      />
    </Block>
  );
}
