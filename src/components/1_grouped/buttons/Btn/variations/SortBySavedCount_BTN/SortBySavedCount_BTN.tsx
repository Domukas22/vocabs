//
//
//

import {
  ICON_calendar,
  ICON_download,
} from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Btn from "../../Btn";

export function SortBySavedCount_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.sortBySavedCount")}
      iconRight={<ICON_download color={IS_active ? "primary" : "gray"} />}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
