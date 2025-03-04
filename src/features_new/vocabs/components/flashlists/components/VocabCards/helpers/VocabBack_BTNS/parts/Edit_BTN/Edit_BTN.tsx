//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_edit } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const Edit_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    style={{ flex: 1 }}
    onPress={onPress}
    text={t("btn.editVocab")}
    iconRight={<ICON_edit />}
    text_STYLES={{ marginRight: "auto" }}
  />
));
