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
import {
  ListBtn_BOTTOM,
  ListBtn_FLAGS,
  ListBtn_TOP,
  ListBtnDifficulty_COUNTS,
} from "../_components";

function _MyList_BTN({
  diff_1_count = 0,
  diff_2_count = 0,
  diff_3_count = 0,
  vocab_COUNT = 0,
  markedVocab_COUNT = 0,
  list,
  onPress,
  highlighted,
  blurAndDisable = false,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
  markedVocab_COUNT: number;
  vocab_COUNT: number;
  list: List_MODEL;
  onPress: () => void;
  highlighted: boolean;
  blurAndDisable?: boolean;
}) {
  const { t } = useTranslation();
  const IS_submitted = useMemo(
    () => list?.is_submitted_for_publish,
    [list?.is_submitted_for_publish]
  );
  const IS_accepted = useMemo(
    () => list?.was_accepted_for_publish,
    [list?.was_accepted_for_publish]
  );

  return (
    <Big_BTN {...{ onPress, blurAndDisable, highlighted }}>
      <ListBtn_TOP
        name={list?.name}
        description={list?.description}
        IS_shared={list?.type === "shared"}
        IS_submitted={IS_submitted && !IS_accepted}
        {...{ vocab_COUNT }}
      >
        <Styled_TEXT type="list_title">{list?.name}</Styled_TEXT>

        {list?.type === "shared" && (
          <Styled_TEXT
            type="label_small"
            style={{
              textAlign: "left",
              color: MyColors.text_green,
              fontSize: 16,
            }}
          >
            Shared list
          </Styled_TEXT>
        )}
        {IS_submitted && !IS_accepted && (
          <Styled_TEXT
            type="label_small"
            style={{
              textAlign: "left",
              color: MyColors.text_yellow,
              fontSize: 16,
            }}
          >
            Submitted for publish
          </Styled_TEXT>
        )}
        {vocab_COUNT === 0 && (
          <Styled_TEXT type="label_small">{t("label.emptyList")}</Styled_TEXT>
        )}
      </ListBtn_TOP>

      {vocab_COUNT > 0 && (
        <ListBtn_BOTTOM>
          <ListBtnDifficulty_COUNTS
            {...{ diff_1_count, diff_2_count, diff_3_count, markedVocab_COUNT }}
          />

          <ListBtn_FLAGS
            lang_ids={list?.collected_lang_ids?.split(",") || []}
          />
        </ListBtn_BOTTOM>
      )}
    </Big_BTN>
  );
}

const enhance = withObservables([], ({ list }: { list: List_MODEL }) => ({
  list,
  diff_1_count: list?.diff_1,
  diff_2_count: list?.diff_2,
  diff_3_count: list?.diff_3,
  vocab_COUNT: list?.vocab_COUNT,
  markedVocab_COUNT: list?.markedVocab_COUNT,
}));

export const MyList_BTN = enhance(_MyList_BTN);
