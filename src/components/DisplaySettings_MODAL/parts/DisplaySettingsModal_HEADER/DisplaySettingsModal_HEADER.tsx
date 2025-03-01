//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";

export function DisplaySettingsModal_HEADER({
  TOGGLE_open = () => {},
}: {
  TOGGLE_open: () => void;
}) {
  return (
    <Header
      title={t("modal.displaySettings.header")}
      big={true}
      btnRight={
        <Btn
          type="seethrough"
          iconLeft={<ICON_X big={true} rotate={true} />}
          onPress={TOGGLE_open}
          style={{ borderRadius: 100 }}
        />
      }
    />
  );
}
