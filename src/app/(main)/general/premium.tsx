import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import {
  ICON_arrow,
  ICON_3dots,
  ICON_checkmark,
} from "@/src/components/icons/icons";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import { MyColors } from "@/src/constants/MyColors";
import { router, Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Billing_PAGE() {
  const hasPremium = true;

  return (
    <Page_WRAP>
      <Header
        title={"Premium"}
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
        {!hasPremium && (
          <Block>
            <Styled_TEXT type="text_28_bold">Get unlimited vocabs</Styled_TEXT>
            <Styled_TEXT>
              With just a tiny, one-time payment, you'll be able to create an
              infinite amout of vocabs and enjoy everything this sexy app has to
              offer.
            </Styled_TEXT>
            <Styled_TEXT>
              On top of that, you'll support a{" "}
              <Link href={"/(main)/general/about"}>
                <Styled_TEXT style={{ color: MyColors.text_primary }}>
                  student
                </Styled_TEXT>
              </Link>{" "}
              who is trying to pay the bills and make cool stuff.
            </Styled_TEXT>

            <Btn
              text="Get premium for €4.99"
              type="action"
              style={{ marginTop: 12 }}
            />
          </Block>
        )}
        {hasPremium && (
          <>
            <Block row={true}>
              <View style={{ flex: 1 }}>
                <Styled_TEXT type="text_22_bold">
                  Your account is premium
                </Styled_TEXT>
                <Styled_TEXT>email2gmail.com</Styled_TEXT>
              </View>
              <View
                style={{
                  marginTop: 4,
                }}
              >
                <ICON_checkmark />
              </View>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">Payment date:</Styled_TEXT>
              <Styled_TEXT>17. September, 2024</Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">Payment amount:</Styled_TEXT>
              <Styled_TEXT>€4.99</Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">Payment type:</Styled_TEXT>
              <Styled_TEXT>PayPal</Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT style={{ marginTop: 8 }}>
                Thanks for supporting us! If you have any questions or ideas,
                feel free to{" "}
                <Link href={"/(main)/general/contact"}>
                  <Styled_TEXT style={{ color: MyColors.text_primary }}>
                    send us a message
                  </Styled_TEXT>
                </Link>
                .
              </Styled_TEXT>
            </Block>
          </>
        )}
      </ScrollView>
    </Page_WRAP>
  );
}
