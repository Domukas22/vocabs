//
//
//

import { t } from "i18next";
import Btn from "../../Btn";

export function UnmarkedToMarked_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.unmarkedToMarked")}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      text_STYLES={{ flex: 1 }}
    />
  );
}
