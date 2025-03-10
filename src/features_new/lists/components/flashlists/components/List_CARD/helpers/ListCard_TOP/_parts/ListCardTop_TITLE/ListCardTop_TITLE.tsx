//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { List_TYPE } from "@/src/features_new/lists/types";
import { t } from "i18next";

export function ListCardTop_TITLE({ list }: { list: List_TYPE }) {
  const { name = t("title.noListNameProvided") } = list;

  return <Styled_TEXT type="list_title">{name}</Styled_TEXT>;
}
