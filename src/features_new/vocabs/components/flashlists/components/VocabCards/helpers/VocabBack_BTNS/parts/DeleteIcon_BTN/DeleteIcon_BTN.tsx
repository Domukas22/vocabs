//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_delete } from "@/src/components/1_grouped/icons/icons";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const DeleteIcon_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    onPress={onPress}
    iconRight={<ICON_delete color="gray_light" />}
  />
));
