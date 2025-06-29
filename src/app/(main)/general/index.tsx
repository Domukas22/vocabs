//
//
//

import Header from "@/src/components/1_grouped/headers/regular/Header";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Block from "@/src/components/1_grouped/blocks/Block/Block";
import {
  ICON_settings,
  ICON_arrow2,
  ICON_privacyPolicy,
  ICON_contact,
  ICON_about,
  ICON_notificationBell,
  ICON_activeCount,
  ICON_checkMarkFull,
  ICON_questionMark,
  ICON_inviteFriend,
} from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { router } from "expo-router";
import { Alert, ScrollView, View } from "react-native";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useTranslation } from "react-i18next";
import Confirmation_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Dropdown_BLOCK from "@/src/components/1_grouped/blocks/Dropdown_BLOCK/Dropdown_BLOCK";
import { useEffect, useState } from "react";

import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import User_MODEL from "@/src/db/models/User_MODEL";
import * as SecureStore from "expo-secure-store";
import CurrentVocabCount_BAR from "@/src/components/2_byPage/general/CurrentVocabCount_BAR";
import { useToast } from "react-native-toast-notifications";
import { USE_navigateUser } from "@/src/features/users/functions/general/hooks/USE_navigateUser/USE_navigateUser";
import { USE_modalToggles } from "@/src/hooks/index";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { MyColors } from "@/src/constants/MyColors";

export default function General_PAGE() {
  const { t } = useTranslation();
  const { z_user } = z_USE_user();
  const { sync } = USE_sync();
  const { navigate } = USE_navigateUser();
  const { logout } = USE_auth();

  // const { notification_COUNT, totalUserVocab_COUNT } =
  //   USE_userObservables(z_user);

  const notification_COUNT = 0;

  const _logout = async () => {
    if (z_user) {
      await sync({ user: z_user });
    }
    const { error } = await logout();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    }

    await SecureStore.setItemAsync("user_id", "");
    await navigate();
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
    // await sync({ user: z_user });

    // await SOFT_DELETE_userOnSupabase(z_user);
    // await z_user.HARD_DELETE_user();
    // const { error } = await logout();

    // toast.show(t("notifications.profileDeleted"), {
    //   type: "warning",
    //   duration: 20000,
    // });

    // if (error) {
    //   Alert.alert("Logout error", "Error signing out");
    // }
    // await logout();
    // await navigate();
  };

  const { modals } = USE_modalToggles(["logout", "deleteAccount"]);

  const toast = useToast();

  const { sync: sync_2, sync_SUCCESS, IS_syncing } = USE_sync();

  return (
    <>
      <Header title={t("page.general.header")} big={true} />
      {/* <Btn
        text="Sync"
        style={{ margin: 12 }}
        onPress={async () => {
          await sync_2({ user: z_user, PULL_EVERYTHING: true });
        }}
      /> */}

      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <Block>
          <View>
            <Styled_TEXT type="text_18_semibold">
              You have{" "}
              {(z_user?.max_vocabs || 200) - (z_user?.total_vocabs || 0)} vocabs
              left
            </Styled_TEXT>
            <Styled_TEXT type="label">{z_user?.email}</Styled_TEXT>
          </View>
          <CurrentVocabCount_BAR
            totalUserVocab_COUNT={z_user?.total_vocabs || 0}
            max_vocabs={z_user?.max_vocabs || 0}
          />

          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <Btn
              text={t("btn.getMoreVocabs")}
              type="action"
              style={{ flex: 1 }}
              text_STYLES={{ flex: 1 }}
              iconRight={<ICON_arrow2 direction="right" color="black" />}
              onPress={() => router.push("/(main)/general/getVocabs")}
            />

            <Btn iconRight={<ICON_questionMark />} onPress={() => {}} />
          </View>
        </Block>

        <Block>
          <Btn
            iconLeft={<ICON_settings />}
            text={t("page.general.btn.settings")}
            iconRight={<ICON_arrow2 direction="right" />}
            onPress={() => router.push("/(main)/general/settings")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          {/* <Btn
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
          /> */}
          <Btn
            iconLeft={<ICON_checkMarkFull />}
            text={t("page.general.btn.payments")}
            iconRight={<ICON_arrow2 direction="right" />}
            onPress={() => router.push("/(main)/general/payments")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />

          <Btn
            iconLeft={<ICON_contact />}
            text={t("page.general.btn.contact")}
            iconRight={<ICON_arrow2 direction="right" />}
            onPress={() => router.push("/(main)/general/contact")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />

          <Btn
            iconLeft={<ICON_about />}
            text={t("page.general.btn.about")}
            iconRight={<ICON_arrow2 direction="right" />}
            onPress={() => router.push("/(main)/general/about")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_privacyPolicy />}
            text={t("page.general.btn.privacy")}
            iconRight={<ICON_arrow2 direction="right" />}
            onPress={() => router.push("/(main)/general/privacy")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
        </Block>
        <Dropdown_BLOCK toggleBtn_TEXT={t("btn.dangerZone")}>
          <Btn
            text={t("page.general.btn.logout")}
            type="delete"
            onPress={() => modals.logout.set(true)}
          />
          <Btn
            text={t("btn.deleteProfile")}
            type="delete"
            onPress={() => modals.deleteAccount.set(true)}
          />
        </Dropdown_BLOCK>
      </ScrollView>

      {/* ----- LOGOUT confirmation ----- */}
      <Confirmation_MODAL
        open={modals.logout.IS_open}
        toggle={() => modals.logout.set(false)}
        title={t("modal.logoutConfirmation.header")}
        action={() => {
          (async () => await _logout())();
        }}
        actionBtnText={t("btn.confirmLogout")}
      />
      <Confirmation_MODAL
        open={modals.deleteAccount.IS_open}
        toggle={() => modals.deleteAccount.set(false)}
        title={t("header.deleteProfile")}
        action={async () => await DELETE_p()}
        actionBtnText={t("btn.confirmProfileDeletion")}
      />
    </>
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
