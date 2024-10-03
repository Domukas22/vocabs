//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";
import Btn from "@/src/components/Btn/Btn";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";

interface LogoutConfirmationModal_PROPS {
  open: boolean;
  toggle: () => void;
  rename: (new_NAME: string) => void;
  title: string;
  actionBtnText: string;
  IS_inAction?: boolean;
  current_NAME: string;
}

export default function RenameList_MODAL({
  open = false,
  toggle = () => {},
  rename = (new_NAME: string) => {},
  title = "Rename list modal",
  actionBtnText = "Save name",
  IS_inAction = false,
  current_NAME = "INSERT NEW NAME",
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();
  const [name, SET_name] = useState("");

  useEffect(() => {
    SET_name(current_NAME);
  }, [open]);

  return (
    <Small_MODAL
      {...{
        IS_open: open,
        TOGGLE_modal: toggle,
        title,
        btnLeft: <Btn text={t("btn.cancel")} onPress={toggle} type="simple" />,
        btnRight: (
          <Btn
            text={!IS_inAction ? actionBtnText : ""}
            iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
            onPress={() => rename(name)}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      <Label>{t("label.editListName")}</Label>
      <StyledText_INPUT
        value={name}
        SET_value={SET_name}
        placeholder={t("placeholder.enterNewListName")}
      />
    </Small_MODAL>
  );
}
