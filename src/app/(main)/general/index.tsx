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
  ICON_inviteFriend,
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
import { PUSH_changes, sync, USE_sync_2 } from "@/src/db/sync";
import USE_fetchNotifications from "@/src/features/6_notifications/hooks/USE_fetchNotifications";
import db, { Notifications_DB, Payments_DB, Vocabs_DB } from "@/src/db";
import USE_fetchPayments from "@/src/features/7_payments/hooks/USE_fetchPayments";
import { Notifications_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import * as SecureStore from "expo-secure-store";
import USE_zustand from "@/src/zustand";
import CurrentVocabCount_BAR from "@/src/components/CurrentVocabCount_BAR";
import Notification_BOX from "@/src/components/Notification_BOX/Notification_BOX";
import { useToast } from "react-native-toast-notifications";
import REFRESH_zustandUser from "@/src/features/5_users/utils/REFRESH_zustandUser";
import USE_sync from "@/src/features/5_users/hooks/USE_sync";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { USE_navigate } from "../../_layout";

function _General_PAGE({
  notification_COUNT,
  totalUserVocab_COUNT,
}: {
  notification_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();

  // const { SET_auth } = USE_auth();
  const logout = USE_logout();

  const { z_user, z_SET_user } = USE_zustand();

  const { NAVIGATE_toWelcomeScreen } = USE_navigate();

  const DELETE_p = async () => {
    if (!z_user) return;
    await sync_2("all", z_user);

    await SOFT_DELETE_userOnSupabase(z_user);
    await z_user.HARD_DELETE_user();
    await logout();
    await NAVIGATE_toWelcomeScreen();
  };

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "logout" },
    { name: "deleteAccount" },
  ]);

  const toast = useToast();

  const { SYNC } = USE_sync();
  const { sync: sync_2 } = USE_sync_2();

  return (
    <Page_WRAP>
      <Header title={t("page.general.header")} big={true} />
      <Btn
        text="Sync"
        style={{ margin: 12 }}
        onPress={async () => {
          await sync_2("all", z_user);
        }}
      />

      <ScrollView>
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
            iconLeft={<ICON_inviteFriend />}
            text={t("btn.inviteFriends")}
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/inviteFriends")}
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
            onPress={() => TOGGLE_modal("logout")}
          />
          <Btn
            text={t("btn.deleteProfile")}
            type="delete"
            onPress={() => TOGGLE_modal("deleteAccount")}
          />
        </Dropdown_BLOCK>
      </ScrollView>

      {/* ----- LOGOUT confirmation ----- */}
      <Confirmation_MODAL
        open={modal_STATES.logout}
        toggle={() => TOGGLE_modal("logout")}
        title={t("modal.logoutConfirmation.header")}
        action={logout}
        actionBtnText={t("btn.confirmLogout")}
      />
      <Confirmation_MODAL
        open={modal_STATES.deleteAccount}
        toggle={() => TOGGLE_modal("deleteAccount")}
        title={t("header.deleteProfile")}
        action={async () => await DELETE_p()}
        actionBtnText={t("btn.confirmProfileDeletion")}
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
  const { SYNC } = USE_sync();

  const _lougout = async () => {
    const { error } = await logout();

    if (error) {
      Alert.alert("Logout error", "Error signing out");
    } else {
      await SecureStore.setItemAsync("user_id", "");
      router.push("/welcome");
    }
  };

  return _lougout;
}

async function SOFT_DELETE_userOnSupabase(user: User_MODEL | undefined) {
  if (!user) return;

  // all lists are reset to type="private"
  // all list accesses associated with the user are deleted permanently
  // user.deleted_at is set to now

  const { error: listError } = await supabase
    .from("lists")
    .update({ type: "private", is_submitted_for_publish: false })
    .eq("user_id", user.id);

  const { error: listAccessError } = await supabase
    .from("list_accesses")
    .delete()
    .eq("owner_id", user.id)
    .eq("participant_id", user.id);

  const { error: userError } = await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (listError) console.error(listError);
  if (listAccessError) console.error(listAccessError);
  if (userError) console.error(userError);
}
