//
//
//

import {
  ICON_calendar,
  ICON_difficultyDot,
  ICON_download,
} from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Btn from "../../Btn";

export function SortByDifficulty_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.sortByDifficulty")}
      iconRight={<ICON_difficultyDot difficulty={1} />}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
