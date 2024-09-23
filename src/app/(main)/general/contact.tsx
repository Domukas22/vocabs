//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { Link, router } from "expo-router";

import Block from "@/src/components/Block/Block";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Label from "@/src/components/Label/Label";

export default function Contact_PAGE() {
  const [message, SET_message] = useState("");
  const [name, SET_name] = useState("");
  const [email, SET_email] = useState("");

  return (
    <Page_WRAP>
      <Header
        title={"Contact us"}
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

      <Block>
        <Label>What's on your mind?</Label>
        <StyledText_INPUT
          multiline={true}
          value={message}
          SET_value={SET_message}
          placeholder="Enter your message here..."
        />
      </Block>
      <Block>
        <Label>What is your name?</Label>
        <StyledText_INPUT
          value={name}
          SET_value={SET_name}
          placeholder="I'm Batman..."
        />
      </Block>
      <Block>
        <Label>What E-mail can we reach you at?</Label>
        <StyledText_INPUT
          value={email}
          SET_value={SET_email}
          placeholder="email@gmail.com..."
        />
      </Block>

      <Block>
        <Btn text="Send my message" type="action" />
      </Block>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <Styled_TEXT type="text_18_bold">Your message will reach:</Styled_TEXT>
        <Styled_TEXT type="text_18_light">Domas Sirbike</Styled_TEXT>
        <Styled_TEXT type="text_18_light">domassirbike@gmail.com</Styled_TEXT>
        <Link href={"/(main)/general/about"}>
          <Styled_TEXT style={{ color: MyColors.text_primary }}>
            About me
          </Styled_TEXT>
        </Link>
      </View>
    </Page_WRAP>
  );
}
