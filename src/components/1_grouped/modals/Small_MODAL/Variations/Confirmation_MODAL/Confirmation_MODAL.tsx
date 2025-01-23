//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "../../Small_MODAL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ActivityIndicator } from "react-native";
import React from "react";

interface LogoutConfirmationModal_PROPS {
  open: boolean;
  toggle: () => void;
  action: () => void;
  title: string;
  actionBtnText: string;
  IS_inAction?: boolean;
  children?: React.ReactNode;
}

export default function Confirmation_MODAL({
  title = "Confirmation modal",
  actionBtnText = "Confirm",
  children,
  open = false,
  IS_inAction = false,
  toggle = () => {},
  action = () => {},
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();

  return (
    <Small_MODAL
      {...{ title, children }}
      IS_open={open}
      TOGGLE_modal={toggle}
      btnLeft={<Btn text={t("btn.cancel")} onPress={toggle} type="simple" />}
      btnRight={
        <Btn
          text={!IS_inAction ? actionBtnText : ""}
          iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
          onPress={action}
          type="action"
          style={{ flex: 1 }}
        />
      }
    />
  );
}
