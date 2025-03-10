//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { List_TYPE } from "@/src/features_new/lists/types";
import { t } from "i18next";

export function ListCardBottom_LABEL({ list }: { list: List_TYPE }) {
  const { total = 0 } = list?.vocab_infos || {};
  return total ? (
    <Styled_TEXT type="label_small" style={{ marginRight: "auto" }}>
      {`${total} ${
        total === 1 ? t("label.1vocabSmall") : t("label.vocabsSmall")
      }`}
    </Styled_TEXT>
  ) : null;
}
