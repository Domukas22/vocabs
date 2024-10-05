//
//
//

import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DescriptionInput_PROPS {
  value: string;
  error: FieldError | undefined;
  isSubmitted: boolean;
  onChange: (...event: any[]) => void;
}

export default function DescriptionInput_BLOCK({
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
        {...{ error, isSubmitted, isFocused, setIsFocused }}
      />
      {error && <Styled_TEXT type="text_error">{error?.message}</Styled_TEXT>}
    </Block>
  );
}
