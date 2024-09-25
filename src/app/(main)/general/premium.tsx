import Block from "@/src/components/Basic/Block/Block";
import Btn from "@/src/components/Basic/Btn/Btn";
import Header from "@/src/components/Compound/Header/Header";
import {
  ICON_arrow,
  ICON_3dots,
  ICON_premiumCheckmark,
} from "@/src/components/Basic/icons/icons";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { router, Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

export default function Billing_PAGE() {
  const { t } = useTranslation();
  const hasPremium = false;

  return (
    <Page_WRAP>
      <Header
        title="Premium"
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
            <Styled_TEXT type="text_28_bold">
              {t("pages.premium.bigTitle")}
            </Styled_TEXT>
            <Styled_TEXT>{t("pages.premium.paragraph_1")}</Styled_TEXT>
            <Styled_TEXT>
              {t("pages.premium.paragraph_2.pre")}
              <Link href={"/(main)/general/about"}>
                <Styled_TEXT style={{ color: MyColors.text_primary }}>
                  {t("pages.premium.paragraph_2.link")}
                </Styled_TEXT>
              </Link>
              {t("pages.premium.paragraph_2.post")}
            </Styled_TEXT>

            <Btn
              text={t("pages.premium.actionBtn")}
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
                  {t("pages.premium.success.title")}
                </Styled_TEXT>
                <Styled_TEXT>email2gmail.com</Styled_TEXT>
              </View>
              <View
                style={{
                  marginTop: 4,
                }}
              >
                <ICON_premiumCheckmark />
              </View>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">
                {t("pages.premium.success.dateTitle")}
              </Styled_TEXT>
              <Styled_TEXT>
                17. September, 2024 // ADD german/english months
              </Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">
                {t("pages.premium.success.costTitle")}
              </Styled_TEXT>
              <Styled_TEXT>€4.99</Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT type="text_18_bold">
                {t("pages.premium.success.paymentTypeTile")}
              </Styled_TEXT>
              <Styled_TEXT>PayPal</Styled_TEXT>
            </Block>
            <Block>
              <Styled_TEXT style={{ marginTop: 8 }}>
                {t("pages.premium.success.littleText")}
                <Link href={"/(main)/general/contact"}>
                  <Styled_TEXT style={{ color: MyColors.text_primary }}>
                    {t("pages.premium.success.littleTextLink")}
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
