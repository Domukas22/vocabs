//
//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";
import React, { useMemo } from "react";
import { withObservables } from "@nozbe/watermelondb/react";
import List_MODEL from "@/src/db/models/List_MODEL";
import Big_BTN from "@/src/components/1_grouped/buttons/Big_BTN/Big_BTN";

import { List_TYPE } from "@/src/types/general_TYPES";
import { ListBtn_FLAGS, ListBtnDifficulty_COUNTS } from "./helpers";
import { View } from "react-native";

export const MyList_BTN = React.memo(function MyList_BTN({
  list,
  highlighted,
  onPress,
}: {
  list: List_TYPE;
  highlighted: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const totalVocab_COUNT = useMemo(() => GET_totalVocabListCount(list), [list]);
  const {
    diff_1 = 0,
    diff_2 = 0,
    diff_3 = 0,
    marked = 0,
  } = list.vocab_INFOS || {};

  return (
    <Big_BTN {...{ onPress, highlighted }}>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 14,
        }}
      >
        <Styled_TEXT type="list_title">{list?.name}</Styled_TEXT>

        {!totalVocab_COUNT && (
          <Styled_TEXT type="label_small">{t("label.emptyList")}</Styled_TEXT>
        )}
      </View>

      {totalVocab_COUNT > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderTopWidth: 1,
            borderTopColor: MyColors.border_white_005,
          }}
        >
          <ListBtnDifficulty_COUNTS {...{ diff_1, diff_2, diff_3, marked }} />

          <ListBtn_FLAGS lang_ids={list?.collected_lang_ids || []} />
        </View>
      )}
    </Big_BTN>
  );
});

function GET_totalVocabListCount(list: List_TYPE) {
  return (
    (list.vocab_INFOS?.diff_1 || 0) +
    (list.vocab_INFOS?.diff_2 || 0) +
    (list.vocab_INFOS?.diff_3 || 0)
  );
}
