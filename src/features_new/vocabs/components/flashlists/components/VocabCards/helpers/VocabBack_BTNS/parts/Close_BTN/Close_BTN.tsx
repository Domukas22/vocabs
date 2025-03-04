//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const Close_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    onPress={onPress}
    style={{ flex: 1 }}
    text={t("btn.close")}
    iconRight={<ICON_X rotate big />}
    text_STYLES={{ marginRight: "auto" }}
  />
));
