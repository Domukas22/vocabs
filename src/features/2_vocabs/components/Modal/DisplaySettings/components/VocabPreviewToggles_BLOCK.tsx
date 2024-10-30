import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/zustand";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_letterT,
} from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

export default function VocabPreviewToggles_BLOCK({
  view,
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
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
          <Settings_TOGGLE
            icon={<ICON_letterT />}
            text={t("toggle.showDescription")}
            active={z_vocabDisplay_SETTINGS?.SHOW_description || false}
            onPress={() => {
              if (z_SET_vocabDisplaySettings) {
                z_SET_vocabDisplaySettings({
                  SHOW_description: !z_vocabDisplay_SETTINGS?.SHOW_description,
                });
              }
            }}
          />
          <Settings_TOGGLE
            icon={
              <ICON_flag
                big
                lang={z_vocabDisplay_SETTINGS?.frontTrLang_ID || "en"}
              />
            }
            text={t("toggle.showFlags")}
            active={z_vocabDisplay_SETTINGS?.SHOW_flags || false}
            onPress={() => {
              if (z_SET_vocabDisplaySettings) {
                z_SET_vocabDisplaySettings({
                  SHOW_flags: !z_vocabDisplay_SETTINGS?.SHOW_flags,
                });
              }
            }}
          />
          <Settings_TOGGLE
            icon={<ICON_difficultyDot big difficulty={3} />}
            text={t("toggle.showDifficulty")}
            active={z_vocabDisplay_SETTINGS?.SHOW_difficulty || false}
            onPress={() => {
              if (z_SET_vocabDisplaySettings) {
                z_SET_vocabDisplaySettings({
                  SHOW_difficulty: !z_vocabDisplay_SETTINGS?.SHOW_difficulty,
                });
              }
            }}
            last
          />
        </View>
      </View>
    </Block>
  ) : null;
}
