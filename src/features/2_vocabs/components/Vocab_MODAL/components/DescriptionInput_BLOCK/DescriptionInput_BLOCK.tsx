//
//
//

import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { useTranslation } from "react-i18next";

interface DescriptionInput_PROPS {
  value: string;
  SET_value: React.Dispatch<React.SetStateAction<string>>;
}

export default function DescriptionInput_BLOCK({
  value,
  SET_value,
}: DescriptionInput_PROPS) {
  const { t } = useTranslation();
  return (
    <Block>
      <Label>{t("label.notes")}</Label>
      <StyledText_INPUT
        multiline
        staySmall
        value={value || ""}
        SET_value={(value: string) => SET_value(value)}
      />
    </Block>
  );
}
