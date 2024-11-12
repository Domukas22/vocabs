//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { t } from "i18next";
import Header from "@/src/components/Header/Header";

export default function SelectOneUserModal_HEADER({
  cancel,
}: {
  cancel: () => void;
}) {
  return (
    <Header
      title={t("header.selectUsers")}
      big={true}
      btnRight={
        <Btn
          type="seethrough"
          iconLeft={<ICON_X big={true} rotate={true} />}
          onPress={cancel}
          style={{ borderRadius: 100 }}
        />
      }
    />
  );
}
