//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_shuffle,
  ICON_difficultyDot,
  ICON_calendar,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "./DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
} from "@/src/zustand";

export default function ListSorting_BLOCK({
  view = "preview",
  z_listDisplay_SETTINGS,
  z_SET_listDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS | undefined;
}) {
  function SET_sorting(sorting: "date") {
    if (z_SET_listDisplaySettings) {
      z_SET_listDisplaySettings({ sorting });
    }
  }

  return view === "sort" ? (
    <Block row={false}>
      <Label>{t("label.sortLists")}</Label>

      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar
            color={
              z_listDisplay_SETTINGS?.sorting === "date" ? "primary" : "grey"
            }
          />
        }
        onPress={() => SET_sorting("date")}
        type={z_listDisplay_SETTINGS?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  ) : null;
}
