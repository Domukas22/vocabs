//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "./DisplaySettings_MODAL/DisplaySettings_MODAL";
import { useMemo } from "react";
import { DisplaySettings_PROPS, SetDisplaySettings_PROPS } from "@/src/zustand";

export default function SortDirection_BLOCK({
  view = "preview",
  z_display_SETTINGS,
  HAS_difficulties = true,
  z_SET_displaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
  HAS_difficulties?: boolean;
  z_SET_displaySettings: SetDisplaySettings_PROPS | undefined;
}) {
  function SET_sortDirection(direction: "ascending" | "descending") {
    if (z_SET_displaySettings) {
      z_SET_displaySettings({ sortDirection: direction });
    }
  }

  const show = useMemo(
    () =>
      view === "sort" &&
      (z_display_SETTINGS?.sorting === "date" ||
        (z_display_SETTINGS?.sorting === "difficulty" && HAS_difficulties)),
    [view, z_display_SETTINGS?.sorting]
  );

  return show ? (
    <Block>
      <Label>{t("label.sortDirection")}</Label>
      {z_display_SETTINGS?.sorting === "difficulty" && HAS_difficulties ? (
        <>
          <Btn
            text={t("btn.easyToHard")}
            onPress={() => SET_sortDirection("ascending")}
            type={
              z_display_SETTINGS?.sortDirection === "ascending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
          <Btn
            text={t("btn.hardToEasy")}
            onPress={() => SET_sortDirection("descending")}
            type={
              z_display_SETTINGS?.sortDirection === "descending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
        </>
      ) : null}
      {z_display_SETTINGS?.sorting === "date" ? (
        <>
          <Btn
            text={t("btn.newToOld")}
            onPress={() => SET_sortDirection("ascending")}
            type={
              z_display_SETTINGS?.sortDirection === "ascending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
          <Btn
            text={t("btn.oldToNew")}
            onPress={() => SET_sortDirection("descending")}
            type={
              z_display_SETTINGS?.sortDirection === "descending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
        </>
      ) : null}
    </Block>
  ) : null;
}