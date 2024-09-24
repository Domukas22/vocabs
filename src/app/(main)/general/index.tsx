//
//
//

import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import Header from "@/src/components/Compound/Header/Header";
import Btn from "@/src/components/Basic/Btn/Btn";
import Block from "@/src/components/Basic/Block/Block";
import {
  ICON_settings,
  ICON_arrow,
  ICON_premium,
  ICON_privacyPolicy,
  ICON_contact,
  ICON_about,
} from "@/src/components/Basic/icons/icons";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useTranslation } from "react-i18next";
import LogoutConfirmation_MODAL from "@/src/components/Modals/LogoutConfirmation_MODAL/LogoutConfirmation_MODAL";
import { USE_toggle } from "@/src/hooks/USE_toggle";

export default function General_PAGE() {
  const { t } = useTranslation();
  const vocabCount = 89;
  const { SET_auth } = USE_auth();

  const lougout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    } else {
      SET_auth(null);
    }
  };

  const [IS_logoutModalOpen, TOGGLE_logoutModal] = USE_toggle();

  return (
    <Page_WRAP>
      <Header title={t("page.general.header")} big={true} />

      <ScrollView>
        <Block>
          <View style={{ gap: 16 }}>
            <Styled_TEXT>XX vocabs left until you reach the limit</Styled_TEXT>
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
                {vocabCount}
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
                    width: `${vocabCount}%`,
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
                100
              </Styled_TEXT>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn
                text={t("page.general.btn.learnMore")}
                onPress={() => router.push("/(main)/general/premium")}
              />
              <Btn
                text={t("page.general.btn.getPremium")}
                type="action"
                style={{ flex: 1 }}
                onPress={() => {}}
              />
            </View>
          </View>
        </Block>

        <Block>
          <Btn
            iconLeft={<ICON_settings />}
            text={t("page.general.btn.settings")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/settings")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_premium />}
            text="Premium"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/premium")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />

          <Btn
            iconLeft={<ICON_contact />}
            text={t("page.general.btn.contact")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/contact")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_about />}
            text={t("page.general.btn.about")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/about")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_privacyPolicy />}
            text={t("page.general.btn.privacy")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/privacy")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
        </Block>
        <Block styles={{ gap: 12 }}>
          <Btn
            text={t("page.general.btn.logout")}
            type="delete"
            onPress={TOGGLE_logoutModal}
          />
        </Block>
      </ScrollView>
      <LogoutConfirmation_MODAL
        open={IS_logoutModalOpen}
        TOGGLE_open={TOGGLE_logoutModal}
        logout={lougout}
      />
    </Page_WRAP>
  );
}
