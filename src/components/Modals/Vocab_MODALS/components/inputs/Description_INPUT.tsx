//
//
//

import Block from "@/src/components/Block/Block";

import Label from "@/src/components/Label/Label";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { useTranslation } from "react-i18next";

interface DescriptionInput_PROPS {
  modal_DESC: string;
  SET_modalDesc: React.Dispatch<React.SetStateAction<string>>;
}

export default function Description_INPUT({
  modal_DESC,
  SET_modalDesc,
}: DescriptionInput_PROPS) {
  const { t } = useTranslation();
  return (
    <Block>
      <Label>{t("label.description")}</Label>
      <StyledText_INPUT
        multiline={true}
        value={modal_DESC || ""}
        SET_value={(value: string) => SET_modalDesc(value)}
        placeholder={t("placeholder.description")}
      />
    </Block>
  );
}
