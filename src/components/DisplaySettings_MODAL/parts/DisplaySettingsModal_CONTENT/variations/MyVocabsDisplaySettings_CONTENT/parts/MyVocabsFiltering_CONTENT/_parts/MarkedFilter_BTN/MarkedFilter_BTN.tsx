//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_markedStar,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";

export function MarkedFilter_BTN({
  HAS_markedFilter = false,
  onPress = () => {},
}: {
  HAS_markedFilter: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.filterVocabsByMarked")}
      iconRight={
        HAS_markedFilter ? (
          <ICON_X big rotate color="green" />
        ) : (
          <ICON_markedStar color="green" />
        )
      }
      type={HAS_markedFilter ? "active_green" : "simple"}
      text_STYLES={{ flex: 1 }}
      onPress={onPress}
    />
  );
}
