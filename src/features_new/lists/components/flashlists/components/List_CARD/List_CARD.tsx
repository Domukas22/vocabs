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

import { ListBtn_FLAGS, ListBtnDifficulty_COUNTS } from "./helpers";
import { View } from "react-native";
import { List_TYPE } from "@/src/features_new/lists/types";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";
import { ICON_savedCount } from "@/src/components/1_grouped/icons/icons";

export const List_CARD = React.memo(function List_CARD({
  list,
  highlighted = false,
  onPress,
  list_TYPE = "public",
}: {
  list: List_TYPE;
  highlighted?: boolean;
  onPress: () => void;
  list_TYPE: privateOrPublic_TYPE;
}) {
  const { t } = useTranslation();
  const {
    diff_1 = 0,
    diff_2 = 0,
    diff_3 = 0,
    marked = 0,
    total = 0,
  } = list.vocab_infos || {};

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
        {list?.description && total > 0 && list_TYPE === "public" && (
          <Styled_TEXT type="label_small">{list?.description}</Styled_TEXT>
        )}

        {!total && (
          <Styled_TEXT type="label_small">{t("label.emptyList")}</Styled_TEXT>
        )}
      </View>

      {total > 0 && (
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
          {list_TYPE === "private" ? (
            <ListBtnDifficulty_COUNTS {...{ diff_1, diff_2, diff_3, marked }} />
          ) : (
            <Styled_TEXT type="label_small" style={{ marginRight: "auto" }}>
              {`${total} vocabs`}
            </Styled_TEXT>
          )}

          <View style={{ flexDirection: "row", gap: 2 }}>
            {list_TYPE === "public" && (
              <ICON_savedCount count={list.saved_count} />
            )}
            <ListBtn_FLAGS lang_ids={list?.collected_lang_ids || []} />
          </View>
        </View>
      )}
    </Big_BTN>
  );
});
