//
//
//

import { useTranslation } from "react-i18next";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import Btn from "../../Basic/Btn/Btn";

interface LogoutConfirmationModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  logout: () => void;
}

export default function LogoutConfirmation_MODAL({
  open,
  TOGGLE_open,
  logout,
}: LogoutConfirmationModal_PROPS) {
  const { t } = useTranslation();

  return (
    <Simple_MODAL
      title={t("modal.logoutConfirmation.header")}
      {...{
        open: open,
        toggle: TOGGLE_open,
        btnLeft: (
          <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
        ),
        btnRight: (
          <Btn
            text={t("btn.confirmLogout")}
            onPress={logout}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    ></Simple_MODAL>
  );
}
