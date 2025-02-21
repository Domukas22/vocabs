//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DescriptionInput_PROPS {
  value: string;
  error: FieldError | undefined;
  isSubmitted: boolean;
  onChange: (...event: any[]) => void;
}

export function DescriptionInput_BLOCK({
  value,
  onChange,
  error,
  isSubmitted,
}: DescriptionInput_PROPS) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Block>
      <Label>{t("label.notes")}</Label>
      <StyledText_INPUT
        multiline
        staySmall
        value={value || ""}
        SET_value={onChange}
        {...{ HAS_error: error, isSubmitted, isFocused, setIsFocused }}
      />
      {error && <Styled_TEXT type="text_error">{error?.message}</Styled_TEXT>}
    </Block>
  );
}
