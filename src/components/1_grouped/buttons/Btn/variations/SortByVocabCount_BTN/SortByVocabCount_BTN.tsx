//
//
//

import { ICON_calendar } from "@/src/components/1_grouped/icons/icons";
import { t } from "i18next";
import Btn from "../../Btn";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export function SortByVocabCount_BTN({
  IS_active = false,
  onPress = () => {},
}: {
  IS_active: boolean;
  onPress: () => void;
}) {
  return (
    <Btn
      text={t("btn.sortByVocabCount")}
      iconRight={<Styled_TEXT style={{ fontSize: 20 }}>V</Styled_TEXT>}
      onPress={onPress}
      type={IS_active ? "active" : "simple"}
      style={{ flex: 1 }}
      text_STYLES={{ flex: 1 }}
    />
  );
}
