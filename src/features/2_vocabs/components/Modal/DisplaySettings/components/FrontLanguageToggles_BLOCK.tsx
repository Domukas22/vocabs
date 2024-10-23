//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_checkMark } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import FETCH_langs from "@/src/features/4_languages/hooks/FETCH_langs";
import USE_langs from "@/src/features/4_languages/hooks/USE_langs";
import USE_zustand, {
  DisplaySettings_PROPS,
  SetDisplaySettings_PROPS,
} from "@/src/zustand";
import i18next, { t } from "i18next";
import { useState, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/DisplaySettings_MODAL";

//
export default function FrontLanguageToggles_BLOCK({
  view = "preview",
  langs = [],
  appLang = "en",
  z_display_SETTINGS,
  z_SET_displaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  langs: Language_MODEL[] | undefined;
  appLang: string | undefined;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
  z_SET_displaySettings: SetDisplaySettings_PROPS | undefined;
}) {
  return view === "preview" && langs && langs?.length > 0 ? (
    <Block>
      <Label>{t("label.vocabFrontLang")}</Label>
      <ScrollView>
        {langs?.map((lang, index) => (
          <Btn
            key={"Select lang" + lang?.lang_id + lang.lang_in_en}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={appLang === "en" ? lang.lang_in_en : lang.lang_in_de}
            iconRight={
              z_display_SETTINGS?.frontTrLang_ID === lang?.lang_id && (
                <ICON_checkMark color="primary" />
              )
            }
            onPress={() => {
              if (z_SET_displaySettings) {
                z_SET_displaySettings({ frontTrLang_ID: lang?.lang_id });
              }
            }}
            type={
              z_display_SETTINGS?.frontTrLang_ID === lang?.lang_id
                ? "active"
                : "simple"
            }
            style={[
              { flex: 1, marginBottom: 8 },
              index === langs.length - 1 && { marginBottom: 24 },
            ]}
            text_STYLES={{ flex: 1 }}
          />
        ))}
      </ScrollView>
    </Block>
  ) : null;
}
