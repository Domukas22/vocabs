//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { t } from "i18next";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks/zustand/USE_zustand/USE_zustand";

export default function ListSortDirection_BLOCK() {
  const SET_sortDirection = useCallback(
    (direction: "ascending" | "descending") => {},
    []
  );

  return (
    <Block>
      <Label>{t("label.sortDirection")}</Label>

      <Btn
        text={t("btn.newToOld")}
        onPress={() => SET_sortDirection("descending")}
        type={{}?.sortDirection === "descending" ? "active" : "simple"}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.oldToNew")}
        onPress={() => SET_sortDirection("ascending")}
        type={{}?.sortDirection === "ascending" ? "active" : "simple"}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
