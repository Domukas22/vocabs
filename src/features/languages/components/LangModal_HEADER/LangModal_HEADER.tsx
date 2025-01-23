//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Header from "@/src/components/1_grouped/headers/regular/Header";

export function LangModal_HEADER({
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
