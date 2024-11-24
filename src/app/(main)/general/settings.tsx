//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import {
  ICON_3dots,
  ICON_arrow,
  ICON_flag,
} from "@/src/components/icons/icons";

import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import { router } from "expo-router";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";

import Block from "@/src/components/Block/Block";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import USE_zustand from "@/src/zustand";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { Controller, useForm } from "react-hook-form";
import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";
import Label from "@/src/components/Label/Label";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import EditUsername_MODAL from "@/src/features/5_users/components/EditUsername_MODAL";

import { useToast } from "react-native-toast-notifications";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { MyColors } from "@/src/constants/MyColors";
import db, { Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { PUSH_changes } from "@/src/hooks/USE_sync/USE_sync";

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

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "editUsername" },
    { name: "editEmail" },
  ]);

  const {
    isHighlighted: IS_usernameHighlighted,
    highlight: HIGHLIGHT_username,
  } = USE_highlightBoolean();

  return (
    <Page_WRAP>
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
        editBtn_ACTION={() => TOGGLE_modal("editUsername")}
        IS_contentHighlighted={IS_usernameHighlighted}
      />
      <Edit_BLOCK
        title={t("label.email")}
        content={z_user?.email}
        editBtn_ACTION={() => TOGGLE_modal("editEmail")}
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
        IS_open={modal_STATES.editUsername}
        CLOSE_modal={() => TOGGLE_modal("editUsername")}
        onSuccess={() => {
          HIGHLIGHT_username();
          toast.show(t("notifications.usernameUpdated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
    </Page_WRAP>
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
