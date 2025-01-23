//
//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface DifficultyInputs_PROPS {
  value: 1 | 2 | 3;
  onChange: (...event: any[]) => void;
  error: FieldError | undefined;
}

export function DifficultyInput_BLOCK({
  value,
  onChange,
  error,
}: DifficultyInputs_PROPS) {
  const { t } = useTranslation();
  return (
    <Block>
      <Label>{t("label.selectDifficulty")}</Label>
      <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
        <Btn
          text={t("btn.difficulty.easy")}
          onPress={() => {
            onChange(1);
          }}
          type={value === 1 ? "difficulty_1_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
        <Btn
          text={t("btn.difficulty.medium")}
          onPress={() => {
            onChange(2);
          }}
          type={value === 2 ? "difficulty_2_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
        <Btn
          text={t("btn.difficulty.hard")}
          onPress={() => {
            onChange(3);
          }}
          type={value === 3 ? "difficulty_3_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
      </View>
      {error && <Styled_TEXT type="text_error">{error.message}</Styled_TEXT>}
    </Block>
  );
}
