//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import Block from "@/src/components/Block/Block";
import {
  ICON_settings,
  ICON_arrow,
  ICON_premium,
  ICON_privacyPolicy,
  ICON_contact,
  ICON_about,
} from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useTranslation } from "react-i18next";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import { useMemo } from "react";
import USE_zustand from "@/src/zustand";
import { vocabLimit } from "@/src/constants/globalVars";
import FETCH_vocabs, {
  VocabFilter_PROPS,
} from "@/src/features/2_vocabs/utils/FETCH_vocabs";
import { withObservables } from "@nozbe/watermelondb/react";

export default function General_PAGE() {
  const { t } = useTranslation();

  const { SET_auth } = USE_auth();
  const { user } = USE_auth();

  const lougout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    } else {
      SET_auth(null);
    }
  };

  const [IS_logoutModalOpen, TOGGLE_logoutModal] = USE_toggle();

  const { z_lists } = USE_zustand();

  const totalVocabs = useMemo(
    () =>
      z_lists.reduce((count, list) => {
        return (count += list.vocabs?.length || 0);
      }, 0),
    [z_lists]
  );

  return (
    <Page_WRAP>
      <Header title={t("page.general.header")} big={true} />

      <ScrollView>
        <Block>
          <View style={{ gap: 16 }}>
            <View>
              <Styled_TEXT>
                {vocabLimit - totalVocabs} vocabs left until you reach the limit
              </Styled_TEXT>
              <Styled_TEXT type="label">{user?.email}</Styled_TEXT>
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
                {vocabLimit}
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
        <Dropdown_BLOCK toggleBtn_TEXT={t("btn.dangerZone")}>
          <Btn
            text={t("page.general.btn.logout")}
            type="delete"
            onPress={TOGGLE_logoutModal}
          />
          <Btn
            text={t("btn.deleteProfile")}
            type="delete"
            onPress={TOGGLE_logoutModal}
          />
        </Dropdown_BLOCK>
      </ScrollView>

      {/* ----- LOGOUT confirmation ----- */}
      <Confirmation_MODAL
        open={IS_logoutModalOpen}
        toggle={TOGGLE_logoutModal}
        title={t("modal.logoutConfirmation.header")}
        action={lougout}
        actionBtnText={t("btn.confirmLogout")}
      />
    </Page_WRAP>
  );
}
