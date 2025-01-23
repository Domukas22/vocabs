//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";

import {
  ICON_3dots,
  ICON_arrow,
  ICON_flag,
} from "@/src/components/1_grouped/icons/icons";

import React, { useMemo } from "react";
import { View } from "react-native";

import { router } from "expo-router";

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { USE_zustand } from "@/src/hooks";
import { EditUsername_MODAL } from "@/src/features/users/components";

import { useToast } from "react-native-toast-notifications";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { MyColors } from "@/src/constants/MyColors";
import { PUSH_changes } from "@/src/hooks/USE_sync/USE_sync";
import { USE_modalToggles } from "@/src/hooks/index";

export default function Settings_PAGE() {
  const { z_user, z_SET_user } = USE_zustand();
  const { t } = useTranslation();
  const toast = useToast();

  const changeLanguage = async (lang: "en" | "de") => {
    if (z_user) {
      const updated_USER = await z_user.UPDATE_preferredLangId(lang);
      if (updated_USER) {
        z_SET_user(updated_USER);
        PUSH_changes();
        i18next.changeLanguage(lang);
      }
    }
  };
  const appLang = useMemo(() => i18next.language, [i18next.language]);

  const { modals } = USE_modalToggles(["editUsername", "editEmail"]);

  const {
    isHighlighted: IS_usernameHighlighted,
    highlight: HIGHLIGHT_username,
  } = USE_highlightBoolean();

  return (
    <>
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
      <Edit_BLOCK
        title={t("label.username")}
        content={z_user?.username}
        editBtn_ACTION={() => modals.editUsername.set(true)}
        IS_contentHighlighted={IS_usernameHighlighted}
      />
      <Edit_BLOCK
        title={t("label.email")}
        content={z_user?.email}
        editBtn_ACTION={() => modals.editEmail.set(true)}
      />

      <Block styles={{ gap: 12 }}>
        <Styled_TEXT type="text_18_bold">{t("blockLabels.uiLang")}</Styled_TEXT>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Btn
            text="English"
            iconRight={<ICON_flag lang="en" big />}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
            type={appLang === "en" ? "active" : "simple"}
            onPress={async () => changeLanguage("en")}
          />
          <Btn
            text="German"
            iconRight={<ICON_flag lang="de" big />}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
            type={appLang === "de" ? "active" : "simple"}
            onPress={async () => changeLanguage("de")}
          />
        </View>
      </Block>

      <EditUsername_MODAL
        IS_open={modals.editUsername.IS_open}
        CLOSE_modal={() => modals.editUsername.set(false)}
        onSuccess={() => {
          HIGHLIGHT_username();
          toast.show(t("notifications.usernameUpdated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
    </>
  );
}

export function Edit_BLOCK({
  title,
  content,
  IS_contentHighlighted = false,
  editBtn_ACTION,
}: {
  title: string | undefined;
  content: string | undefined;
  IS_contentHighlighted: boolean;
  editBtn_ACTION: () => void;
}) {
  return (
    <Block
      row={true}
      styles={{ position: "relative", alignItems: "flex-start" }}
    >
      <View style={{ flex: 1 }}>
        <Styled_TEXT type="text_18_bold">{title || "INSERT TITLE"}</Styled_TEXT>

        <Styled_TEXT
          style={[IS_contentHighlighted && { color: MyColors.text_green }]}
        >
          {content || "INSERT CONTENT"}
        </Styled_TEXT>
      </View>
      <Btn text="Edit" onPress={editBtn_ACTION} />
    </Block>
  );
}
