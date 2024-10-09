//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_calendar,
  ICON_shuffle,
  ICON_flag,
  ICON_dropdownArrow,
  ICON_X,
  ICON_questionMark,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { Language_MODEL, DisplaySettings_PROPS } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import i18next, { t } from "i18next";
import { useMemo, useState } from "react";
import { View } from "react-native";

export default function VocabFrontLang_BLOCK({
  selectedLang_ID,
  TOGGLE_modal,
}: {
  selectedLang_ID: string;
  TOGGLE_modal: () => void;
}) {
  const { languages } = USE_langs();
  const lang = useMemo(
    () => languages.find((lang) => lang.id === selectedLang_ID),
    [languages, selectedLang_ID]
  );

  const appLang = useMemo(() => i18next.language, []);

  const [SHOW_details, TOGGLE_showDetails] = USE_toggle(false);

  return (
    <Block row={false}>
      <Label>{t("label.vocabFrontLang")}</Label>
      <View style={{ gap: 8, flexDirection: "row" }}>
        <Btn
          iconLeft={<ICON_flag lang={lang?.id} />}
          text={lang?.[`lang_in_${appLang}`]}
          iconRight={<ICON_dropdownArrow />}
          onPress={TOGGLE_modal}
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
        <Btn
          iconLeft={
            SHOW_details ? <ICON_X big rotate /> : <ICON_questionMark />
          }
          type={SHOW_details ? "seethrough" : "simple"}
          onPress={TOGGLE_showDetails}
        />
      </View>
      {SHOW_details && (
        <View style={{ gap: 4 }}>
          <Styled_TEXT type="label">
            {t("label.vocabFrontLangExplanation1")}
          </Styled_TEXT>
          <Styled_TEXT type="label">
            {t("label.vocabFrontLangExplanation2")}
          </Styled_TEXT>
        </View>
      )}
    </Block>
  );
}
