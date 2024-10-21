//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { t } from "i18next";
import Header from "@/src/components/Header/Header";

export default function LangModal_HEADER({
  IS_inAction,
  cancel,
}: {
  IS_inAction?: boolean | undefined;
  cancel: () => void;
}) {
  return (
    <Header
      title={t("modal.selectLanguages.header")}
      big={true}
      btnRight={
        <Btn
          type="seethrough"
          iconLeft={<ICON_X big={true} rotate={true} />}
          onPress={() => {
            if (!IS_inAction) cancel();
          }}
          style={{ borderRadius: 100 }}
        />
      }
    />
  );
}
