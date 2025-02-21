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
  const SET_sorting = useCallback((sorting: "date") => {}, []);

  return (
    <Block row={false}>
      <Label>{t("label.sortLists")}</Label>

      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar color={{}?.sorting === "date" ? "primary" : "grey"} />
        }
        onPress={() => SET_sorting("date")}
        type={{}?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
