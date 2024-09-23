//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_dropdownArrow } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { VocabModal_ACTIONS } from "../../hooks/USE_modalToggles";
import { useTranslation } from "react-i18next";

interface ListnInput_PROPS {
  list_NAME: string;
  TOGGLE_modal: (action: VocabModal_ACTIONS) => void;
}

export default function List_INPUT({
  list_NAME,
  TOGGLE_modal,
}: ListnInput_PROPS) {
  const { t } = useTranslation();
  return (
    <Block>
      <Label>{t("label.chosenList")}</Label>
      <Btn
        text={list_NAME || ""}
        iconRight={<ICON_dropdownArrow />}
        onPress={() => TOGGLE_modal("selectedList")}
        type="simple"
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
