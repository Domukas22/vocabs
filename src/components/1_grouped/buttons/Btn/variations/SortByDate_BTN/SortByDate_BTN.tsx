//
//
//

import { ICON_calendar } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Btn from "../../Btn";

export function SortByDate_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.sortByDate")}
      iconRight={<ICON_calendar color={IS_active ? "primary" : "grey"} />}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
