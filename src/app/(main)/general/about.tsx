//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";

import { router } from "expo-router";

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";

export default function About_PAGE() {
  return (
    <Page_WRAP>
      <Header
        title={"About us"}
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
          <Styled_TEXT type="text_28_bold">👋 Hi, ich bin Domas</Styled_TEXT>
        </View>
        <View
          style={{
            padding: 16,
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: MyColors.border_white_005,
          }}
        >
          <Styled_TEXT>
            This is a paragarph This is a paragarph This is a paragarph This is
            a paragarph This is a paragarph This is a paragarph This is a
            paragarph
          </Styled_TEXT>
          <Styled_TEXT>
            This is a paragarph This is a paragarph This is a paragarph This is
            a paragarph This is a paragarph This is a paragarph This is a
            paragarph
          </Styled_TEXT>
          <Styled_TEXT>
            This is a paragarph This is a paragarph This is a paragarph This is
            a paragarph This is a paragarph This is a paragarph This is a
            paragarph
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
          <Styled_TEXT type="text_22_bold">Want to chat?</Styled_TEXT>
          <Btn
            text="Contact me right now"
            iconRight={<ICON_arrow direction="right" />}
            text_STYLES={{ flex: 1 }}
            onPress={() => router.push("/(main)/general/contact")}
          />
        </View>
      </ScrollView>
    </Page_WRAP>
  );
}
