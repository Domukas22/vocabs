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
  ICON_privacyPolicy,
  ICON_contact,
  ICON_about,
  ICON_notificationBell,
  ICON_activeCount,
  ICON_checkMarkFull,
  ICON_questionMark,
  ICON_inviteFriend,
} from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { router } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useTranslation } from "react-i18next";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import { useEffect, useState } from "react";

import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import User_MODEL from "@/src/db/models/User_MODEL";
import * as SecureStore from "expo-secure-store";
import USE_zustand from "@/src/zustand";
import CurrentVocabCount_BAR from "@/src/components/CurrentVocabCount_BAR";
import { useToast } from "react-native-toast-notifications";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import NAVIGATE_user from "@/src/utils/NAVIGATE_user";

export default function General_PAGE() {
  const { t } = useTranslation();
  const { z_user, z_SET_user } = USE_zustand();
  const { sync } = USE_sync();

  const { notification_COUNT, totalUserVocab_COUNT } =
    USE_userObservables(z_user);

  // const { SET_auth } = USE_auth();

  const { logout } = USE_auth();

  const _logout = async () => {
    if (z_user) {
      await sync({ user: z_user });
    }
    const { error } = await logout();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    }

    await SecureStore.setItemAsync("user_id", "");
    await NAVIGATE_user({
      navigateToWelcomeSreenOnError: true,
      z_SET_user,
      SET_error,
      router,
      sync,
    });
  };

  const [error, SET_error] = useState({
    value: false,
    user_MSG: "",
  });

  useEffect(() => {
    if (error.value) console.error(error.user_MSG);
  }, [error]);

  const DELETE_p = async () => {
    if (!z_user) return;
    await sync({ user: z_user });

    await SOFT_DELETE_userOnSupabase(z_user);
    await z_user.HARD_DELETE_user();
    const { error } = await logout();

    toast.show(t("notifications.profileDeleted"), {
      type: "warning",
      duration: 20000,
    });

    if (error) {
      Alert.alert("Logout error", "Error signing out");
    }
    await logout();
    await NAVIGATE_user({
      navigateToWelcomeSreenOnError: true,
      z_SET_user,
      SET_error,
      router,
      sync,
    });
  };

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "logout" },
    { name: "deleteAccount" },
  ]);

  const toast = useToast();

  const { sync: sync_2 } = USE_sync();

  return (
    <Page_WRAP>
      <Header title={t("page.general.header")} big={true} />
      <Btn
        text="Sync"
        style={{ margin: 12 }}
        onPress={async () => {
          await sync_2({ user: z_user });
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
        action={() => {
          (async () => await _logout())();
        }}
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

const USE_userObservables = (user: User_MODEL | undefined) => {
  const [observables, setObservables] = useState({
    notification_COUNT: undefined as number | undefined,
    totalUserVocab_COUNT: undefined as number | undefined,
  });

  useEffect(() => {
    if (!user) return;

    const subscriptions = [
      user.unreadNotification_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, notification_COUNT: count }))
      ),
      user.totalVocab_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, totalUserVocab_COUNT: count }))
      ),
    ];

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, [user]);

  return observables;
};
