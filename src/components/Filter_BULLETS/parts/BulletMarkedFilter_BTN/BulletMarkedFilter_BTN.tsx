//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_markedStar,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";

export function BulletMarkedFilter_BTN({
  REMOVE_markedFilter = () => {},
}: {
  REMOVE_markedFilter: () => void;
}) {
  return (
    <Btn
      text={t("filterBullet.hasMarked")}
      iconRight={<ICON_X color="green" rotate={true} />}
      type="active_green"
      tiny={true}
      onPress={REMOVE_markedFilter}
    />
  );
}
