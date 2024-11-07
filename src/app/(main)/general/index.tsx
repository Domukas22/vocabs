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
  ICON_notificationBell,
  ICON_activeCount,
  ICON_checkMark,
  ICON_checkMarkFull,
  ICON_star,
  ICON_questionMark,
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
import { useEffect, useMemo, useState } from "react";

import { vocabLimit } from "@/src/constants/globalVars";
import FETCH_vocabs, {
  VocabFilter_PROPS,
} from "@/src/features/2_vocabs/utils/FETCH_vocabs";
import { withObservables } from "@nozbe/watermelondb/react";
import { sync } from "@/src/db/sync";
import USE_fetchNotifications from "@/src/features/6_notifications/hooks/USE_fetchNotifications";
import { Notifications_DB, Payments_DB, Vocabs_DB } from "@/src/db";
import USE_fetchPayments from "@/src/features/7_payments/hooks/USE_fetchPayments";
import { Notifications_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import * as SecureStore from "expo-secure-store";
import USE_zustand from "@/src/zustand";
import CurrentVocabCount_BAR from "@/src/components/CurrentVocabCount_BAR";
import Notification_BOX from "@/src/components/Notification_BOX/Notification_BOX";
import { useToast } from "react-native-toast-notifications";

function _General_PAGE({
  notification_COUNT,
  totalUserVocab_COUNT,
}: {
  notification_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();

  // const { SET_auth } = USE_auth();
  const { _lougout } = USE_logout();

  const { z_user } = USE_zustand();

  const [IS_logoutModalOpen, TOGGLE_logoutModal] = USE_toggle();
  const toast = useToast();
  return (
    <Page_WRAP>
      <Header title={t("page.general.header")} big={true} />
      {/* <Btn text="Sync" style={{ margin: 12 }} onPress={sync} /> */}

      <ScrollView>
        {/* <Btn
          onPress={async () => {
            const {
              data,
              error: fetchError,
              count,
            } = await supabase.from("users").select("id", { count: "exact" });
            // .eq("list_id", list.id);
            console.log(count);
          }}
        /> */}
        <Block>
          <View>
            <Styled_TEXT type="text_18_semibold">
              You have{" "}
              {(z_user?.max_vocabs || 200) - (totalUserVocab_COUNT || 0)} vocabs
              left
            </Styled_TEXT>
            <Styled_TEXT type="label">{z_user?.email}</Styled_TEXT>
            <Styled_TEXT type="label">{z_user?.username}</Styled_TEXT>
          </View>
          <CurrentVocabCount_BAR
            totalUserVocab_COUNT={totalUserVocab_COUNT || 0}
            max_vocabs={z_user?.max_vocabs || 0}
          />

          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Btn
              text={t("btn.getMoreVocabs")}
              type="action"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
              iconRight={<ICON_arrow direction="right" color="black" />}
              onPress={() => router.push("/(main)/general/getVocabs")}
            />

            <Btn iconRight={<ICON_questionMark />} onPress={() => {}} />
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
            iconLeft={
              <View style={{ flexDirection: "row", gap: 4 }}>
                <ICON_notificationBell />
                {typeof notification_COUNT === "number" &&
                  notification_COUNT > 0 && (
                    <ICON_activeCount count={notification_COUNT} />
                  )}
              </View>
            }
            text={t("page.general.btn.notifications")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/notifications")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_checkMarkFull />}
            text={t("page.general.btn.payments")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/payments")}
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
        action={_lougout}
        actionBtnText={t("btn.confirmLogout")}
      />
    </Page_WRAP>
  );
}

export default function General_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    notification_COUNT: z_user?.unreadNotification_COUNT
      ? z_user?.unreadNotification_COUNT
      : undefined,
    totalUserVocab_COUNT: z_user?.totalVocab_COUNT
      ? z_user?.totalVocab_COUNT
      : undefined,
  }));
  const EnhancedPage = enhance(_General_PAGE);

  // Render the enhanced page
  return <EnhancedPage />;
}

export function USE_logout() {
  const { logout } = USE_auth();
  const { z_user } = USE_zustand();

  const _lougout = async () => {
    await sync("all", z_user?.id);
    const { error } = await logout();

    if (error) {
      Alert.alert("Logout error", "Error signing out");
    } else {
      await SecureStore.setItemAsync("user_id", "");
      router.push("/welcome");
    }
  };

  return { _lougout };
}
