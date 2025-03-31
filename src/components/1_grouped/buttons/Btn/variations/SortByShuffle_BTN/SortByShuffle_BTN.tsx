//
//
//

import { ICON_shuffle } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Btn from "../../Btn";

export function SortByShuffle_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.sortByShuffle")}
      iconRight={<ICON_shuffle color={IS_active ? "primary" : "grey_light"} />}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
