//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import { DisplaySettings_PROPS } from "@/src/db/props";
import USE_zustand from "@/src/zustand";
import React from "react";
import { useTranslation } from "react-i18next";

export default function VocabSortDirection_BLOCK() {
  const { t } = useTranslation();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  return (
    <Block>
      <Label>{t("label.sortDirection")}</Label>
      <Btn
        text={
          z_vocabDisplay_SETTINGS?.sorting === "difficulty"
            ? t("btn.easyToHard")
            : t("btn.newToOld")
        }
        onPress={() =>
          z_SET_vocabDisplaySettings({ sortDirection: "ascending" })
        }
        type={
          z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
            ? "active"
            : "simple"
        }
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={
          z_vocabDisplay_SETTINGS?.sorting === "difficulty"
            ? t("btn.hardToEasy")
            : t("btn.oldToNew")
        }
        onPress={() =>
          z_SET_vocabDisplaySettings({ sortDirection: "descending" })
        }
        type={
          z_vocabDisplay_SETTINGS?.sortDirection === "descending"
            ? "active"
            : "simple"
        }
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
