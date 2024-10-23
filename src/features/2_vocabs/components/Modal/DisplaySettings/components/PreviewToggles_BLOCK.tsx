import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/DisplaySettings_MODAL";
import { DisplaySettings_PROPS, SetDisplaySettings_PROPS } from "@/src/zustand";

export default function PreviewToggles_BLOCK({
  view,
  z_display_SETTINGS,
  z_SET_displaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
  z_SET_displaySettings: SetDisplaySettings_PROPS | undefined;
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
            text={t("toggle.showDescription")}
            active={z_display_SETTINGS?.SHOW_description || false}
            onPress={() => {
              if (z_SET_displaySettings) {
                z_SET_displaySettings({
                  SHOW_description: !z_display_SETTINGS?.SHOW_description,
                });
              }
            }}
          />
          <Settings_TOGGLE
            text={t("toggle.showFlags")}
            active={z_display_SETTINGS?.SHOW_flags || false}
            onPress={() => {
              if (z_SET_displaySettings) {
                z_SET_displaySettings({
                  SHOW_flags: !z_display_SETTINGS?.SHOW_flags,
                });
              }
            }}
          />
          <Settings_TOGGLE
            text={t("toggle.showDifficulty")}
            active={z_display_SETTINGS?.SHOW_difficulty || false}
            onPress={() => {
              if (z_SET_displaySettings) {
                z_SET_displaySettings({
                  SHOW_difficulty: !z_display_SETTINGS?.SHOW_difficulty,
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
