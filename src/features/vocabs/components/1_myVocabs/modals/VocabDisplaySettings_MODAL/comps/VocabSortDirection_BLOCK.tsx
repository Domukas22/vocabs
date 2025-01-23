//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "../VocabDisplaySettings_MODAL";
import { useMemo } from "react";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";

export default function VocabSortDirection_BLOCK({
  view = "preview",
  z_vocabDisplay_SETTINGS,
  HAS_difficulties = true,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  HAS_difficulties?: boolean;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
  function SET_sortDirection(direction: "ascending" | "descending") {
    if (z_SET_vocabDisplaySettings) {
      z_SET_vocabDisplaySettings({ sortDirection: direction });
    }
  }

  const show = useMemo(
    () =>
      view === "sort" &&
      (z_vocabDisplay_SETTINGS?.sorting === "date" ||
        (z_vocabDisplay_SETTINGS?.sorting === "difficulty" &&
          HAS_difficulties)),
    [view, z_vocabDisplay_SETTINGS?.sorting]
  );

  return show ? (
    <Block>
      <Label>{t("label.sortDirection")}</Label>
      {z_vocabDisplay_SETTINGS?.sorting === "difficulty" && HAS_difficulties ? (
        <>
          <Btn
            text={t("btn.easyToHard")}
            onPress={() => SET_sortDirection("descending")}
            type={
              z_vocabDisplay_SETTINGS?.sortDirection === "descending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
          <Btn
            text={t("btn.hardToEasy")}
            onPress={() => SET_sortDirection("ascending")}
            type={
              z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
        </>
      ) : null}
      {z_vocabDisplay_SETTINGS?.sorting === "date" ? (
        <>
          <Btn
            text={t("btn.newToOld")}
            onPress={() => SET_sortDirection("ascending")}
            type={
              z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
          <Btn
            text={t("btn.oldToNew")}
            onPress={() => SET_sortDirection("descending")}
            type={
              z_vocabDisplay_SETTINGS?.sortDirection === "descending"
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
