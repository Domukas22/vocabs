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
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { Language_MODEL, VocabDisplaySettings_PROPS } from "@/src/db/models";
import i18next, { t } from "i18next";
import { useMemo } from "react";

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

  return (
    <Block row={false}>
      <Label>{t("label.vocabFrontLang")}</Label>
      <Btn
        iconLeft={<ICON_flag lang={lang?.id} />}
        text={lang?.[`lang_in_${appLang}`]}
        iconRight={<ICON_dropdownArrow />}
        onPress={TOGGLE_modal}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Label>{t("label.vocabFrontLangExplanation")}</Label>
    </Block>
  );
}
