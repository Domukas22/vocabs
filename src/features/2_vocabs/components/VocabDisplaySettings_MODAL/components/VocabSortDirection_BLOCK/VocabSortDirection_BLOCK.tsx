//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import React from "react";
import { useTranslation } from "react-i18next";

interface MyVocabSortDirectionBlock_PROPS {
  displaySettings: MyVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<MyVocabDisplaySettings_PROPS>
  >;
}

export default function VocabSortDirection_BLOCK({
  displaySettings,
  SET_displaySettings,
}: MyVocabSortDirectionBlock_PROPS) {
  const { t } = useTranslation();

  return (
    <Block>
      <Label>{t("label.sortDirection")}</Label>
      <Btn
        text={
          displaySettings?.sorting === "difficulty"
            ? t("btn.easyToHard")
            : t("btn.newToOld")
        }
        onPress={() =>
          SET_displaySettings((p) => ({
            ...p,
            sortDirection: "ascending",
          }))
        }
        type={
          displaySettings?.sortDirection === "ascending" ? "active" : "simple"
        }
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={
          displaySettings?.sorting === "difficulty"
            ? t("btn.hardToEasy")
            : t("btn.oldToNew")
        }
        onPress={() =>
          SET_displaySettings((p) => ({
            ...p,
            sortDirection: "descending",
          }))
        }
        type={
          displaySettings?.sortDirection === "descending" ? "active" : "simple"
        }
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
