//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const Copy_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    onPress={onPress}
    text={t("btn.saveVocab")}
    iconRight={<ICON_X color="green" big />}
    text_STYLES={{ marginRight: "auto", color: MyColors.text_green }}
  />
));
