//
//
//

import { useTranslation } from "react-i18next";
import Small_MODAL from "../../Small_MODAL";
import Btn from "../../../../Btn/Btn";
import { ActivityIndicator } from "react-native";

interface LogoutConfirmationModal_PROPS {
  open: boolean;
  toggle: () => void;
  action: () => void;
  title: string;
  actionBtnText: string;
  IS_inAction?: boolean;
}

export default function Confirmation_MODAL({
  open = false,
  toggle = () => {},
  action = () => {},
  title = "Confirmation modal",
  actionBtnText = "Confirm",
  IS_inAction = false,
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();

  return (
    <Small_MODAL
      {...{
        open,
        toggle,
        title,
        btnLeft: <Btn text={t("btn.cancel")} onPress={toggle} type="simple" />,
        btnRight: (
          <Btn
            text={!IS_inAction ? actionBtnText : ""}
            iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
            onPress={action}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    />
  );
}
