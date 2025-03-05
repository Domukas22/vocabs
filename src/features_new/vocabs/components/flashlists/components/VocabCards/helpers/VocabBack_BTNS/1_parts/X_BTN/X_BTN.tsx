//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { memo } from "react";

type props = {
  onPress: () => void;
};

export const X_BTN = memo(({ onPress = () => {} }: props) => (
  <Btn
    type="simple"
    onPress={onPress}
    iconLeft={<ICON_X big rotate />}
    style={{
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
    }}
  />
));
