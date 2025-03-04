//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_restore, ICON_X } from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const Restore_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    onPress={onPress}
    text={t("btn.restoreVocab")}
    iconRight={<ICON_restore />}
    text_STYLES={{ marginRight: "auto", color: MyColors.text_green }}
  />
));
