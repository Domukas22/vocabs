import React, { useState } from "react";
import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Custom_TOGGLE from "@/src/components/1_grouped/inputs/Custom_TOGGLE/Custom_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { DisplaySettingsModalView_PROPS } from "../../VocabDisplaySettings_MODAL";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_letterT,
} from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { Switch, StyleSheet } from "react-native";

export default function VocabPreviewToggles_BLOCK({
  view,
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
  const [toggles, setToggles] = useState({
    SHOW_description: z_vocabDisplay_SETTINGS?.SHOW_description || false,
    SHOW_flags: z_vocabDisplay_SETTINGS?.SHOW_flags || false,
    SHOW_difficulty: z_vocabDisplay_SETTINGS?.SHOW_difficulty || false,
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    const newValue = !toggles[key];
    Haptics.selectionAsync();

    // Update local state
    setToggles((prev) => ({ ...prev, [key]: newValue }));

    // Update Zustand state
    setTimeout(() => {
      if (z_SET_vocabDisplaySettings) {
        z_SET_vocabDisplaySettings({ [key]: newValue });
      }
    }, 0);
  };

  return view === "preview" ? (
    <Block>
      <Label>{t("label.vocabPreview")}</Label>
      <View style={{ gap: 12, marginTop: 4 }}>
        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: MyColors.border_white_005,
            overflow: "hidden",
          }}
        >
          <Custom_TOGGLE
            icon={<ICON_letterT />}
            text={t("toggle.showDescription")}
            active={toggles.SHOW_description}
            onPress={() => toggleSetting("SHOW_description")}
          />
          <Custom_TOGGLE
            icon={
              <ICON_flag
                big
                lang={z_vocabDisplay_SETTINGS?.frontTrLang_ID || "en"}
              />
            }
            text={t("toggle.showFlags")}
            active={toggles.SHOW_flags}
            onPress={() => toggleSetting("SHOW_flags")}
          />
          <Custom_TOGGLE
            icon={<ICON_difficultyDot big difficulty={3} />}
            text={t("toggle.showDifficulty")}
            active={toggles.SHOW_difficulty}
            onPress={() => toggleSetting("SHOW_difficulty")}
            last
          />
        </View>
      </View>
    </Block>
  ) : null;
}
