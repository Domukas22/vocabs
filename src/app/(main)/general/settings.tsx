//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import {
  ICON_3dots,
  ICON_arrow,
  ICON_flag,
} from "@/src/components/icons/icons";

import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { router } from "expo-router";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";

import Block from "@/src/components/Block/Block";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";

export default function Settings_PAGE() {
  const [appLang, SET_appLang] = useState("en");
  const { user } = USE_auth();

  return (
    <Page_WRAP>
      <Header
        title={"Settings"}
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
      <Block
        row={true}
        styles={{ position: "relative", alignItems: "flex-start" }}
      >
        <View style={{ flex: 1 }}>
          <Styled_TEXT type="text_18_bold">Email</Styled_TEXT>
          <Styled_TEXT>{user?.email || "---"}</Styled_TEXT>
        </View>
        <Btn text="Edit" />
      </Block>
      <Block styles={{ gap: 12 }}>
        <Styled_TEXT type="text_18_bold">In-app language</Styled_TEXT>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Btn
            text="English"
            iconRight={<ICON_flag lang="en" />}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
            type={appLang === "en" ? "active" : "simple"}
            onPress={() => SET_appLang("en")}
          />
          <Btn
            text="German"
            iconRight={<ICON_flag lang="de" />}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
            type={appLang === "de" ? "active" : "simple"}
            onPress={() => SET_appLang("de")}
          />
        </View>
      </Block>
    </Page_WRAP>
  );
}
