//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { List_TYPE } from "@/src/features_new/lists/types";
import { t } from "i18next";

export function ListCardTop_DESCRIPTION({ list }: { list: List_TYPE }) {
  const { description = "", type = "private" } = list;
  const { total = 0 } = list?.vocab_infos || {};

  if (description && total && type === "public")
    return <Styled_TEXT type="label_small">{description}</Styled_TEXT>;

  if (!total)
    return <Styled_TEXT type="label_small">{t("label.emptyList")}</Styled_TEXT>;

  return null;
}
