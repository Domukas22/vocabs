//
//
//

import Btn from "@/src/components/Basic/Btn/Btn";
import Header from "@/src/components/Compound/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/Basic/icons/icons";

import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";

import { router } from "expo-router";

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import { useTranslation } from "react-i18next";

export default function About_PAGE() {
  const { t } = useTranslation();
  return (
    <Page_WRAP>
      <Header
        title={t("header.page_about")}
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
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 32,
            alignItems: "center",
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
          }}
        >
          <Image
            source={require("@/src/assets/images/Domas.jpg")}
            style={{ width: 240, height: 240, borderRadius: 300 }}
          />
          <Styled_TEXT type="text_28_bold">
            {t("pages.about.title")}
          </Styled_TEXT>
        </View>
        <View
          style={{
            padding: 16,
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
          }}
        >
          <Styled_TEXT>{t("pages.about.paragraph_1")}</Styled_TEXT>
          <Styled_TEXT>{t("pages.about.paragraph_2")}</Styled_TEXT>
          <Styled_TEXT>{t("pages.about.paragraph_3")}</Styled_TEXT>
        </View>
        <View
          style={{
            padding: 16,
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
          }}
        >
          <Styled_TEXT type="text_22_bold">
            {t("pages.about.contactQuestion")}
          </Styled_TEXT>
          <Btn
            text={t("pages.about.contactBtn")}
            iconRight={<ICON_arrow direction="right" />}
            text_STYLES={{ flex: 1 }}
            onPress={() => router.push("/(main)/general/contact")}
          />
        </View>
      </ScrollView>
    </Page_WRAP>
  );
}
