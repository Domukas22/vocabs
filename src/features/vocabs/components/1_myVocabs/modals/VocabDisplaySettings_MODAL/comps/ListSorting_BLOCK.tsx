//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_calendar } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { t } from "i18next";
import { USE_zustand } from "@/src/hooks/zustand/USE_zustand/USE_zustand";
import { useCallback } from "react";

export default function ListSorting_BLOCK() {
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const SET_sorting = useCallback(
    (sorting: "date") => {
      if (z_SET_listDisplaySettings) {
        z_SET_listDisplaySettings({ sorting });
      }
    },
    [z_SET_listDisplaySettings]
  );

  return (
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
  );
}
