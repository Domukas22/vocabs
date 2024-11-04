//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "./DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import { useMemo } from "react";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
} from "@/src/zustand";

export default function ListSortDirection_BLOCK({
  view = "preview",
  z_listDisplay_SETTINGS,

  z_SET_listDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS | undefined;
}) {
  function SET_sortDirection(direction: "ascending" | "descending") {
    if (z_SET_listDisplaySettings) {
      z_SET_listDisplaySettings({ sortDirection: direction });
    }
  }

  return view === "sort" ? (
    <Block>
      <Label>{t("label.sortDirection")}</Label>

      {z_listDisplay_SETTINGS?.sorting === "date" ? (
        <>
          <Btn
            text={t("btn.newToOld")}
            onPress={() => SET_sortDirection("descending")}
            type={
              z_listDisplay_SETTINGS?.sortDirection === "descending"
                ? "active"
                : "simple"
            }
            text_STYLES={{ flex: 1 }}
          />
          <Btn
            text={t("btn.oldToNew")}
            onPress={() => SET_sortDirection("ascending")}
            type={
              z_listDisplay_SETTINGS?.sortDirection === "ascending"
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
