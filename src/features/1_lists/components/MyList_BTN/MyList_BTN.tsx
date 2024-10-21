//
//
//
//

import { Pressable, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../../../../components/Styled_TEXT/Styled_TEXT";

import { MyColors } from "@/src/constants/MyColors";
import { ICON_difficultyDot } from "../../../../components/icons/icons";

import { useTranslation } from "react-i18next";

import { useEffect, useMemo, useState } from "react";
import GET_listDifficulties from "../../utils/GET_listDifficulties";
import VocabDifficulty_COUNTS from "../VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";

function _MyList_BTN({
  diff_1_count,
  diff_2_count,
  diff_3_count,
  total_count,
  vocabs,
  list,
  onPress,
  highlighted,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
  total_count: number;
  list: List_MODEL;
  vocabs: Vocab_MODEL;
  onPress: () => void;
  highlighted: boolean;
}) {
  const { t } = useTranslation();
  const IS_submitted = useMemo(
    () => list?.is_submitted_for_publish,
    [list?.is_submitted_for_publish]
  );
  const IS_accepted = useMemo(
    () => list?.has_been_submitted,
    [list?.has_been_submitted]
  );

  return (
    <Transition_BTN {...{ onPress }}>
      <Styled_TEXT type="text_18_bold" style={{ textAlign: "left", flex: 1 }}>
        {list?.name || "INSERT LIST NAME"}
      </Styled_TEXT>
      {list?.type === "shared" && (
        <Styled_TEXT
          type="label_small"
          style={{
            textAlign: "left",
            color: MyColors.text_green,
            fontSize: 16,
          }}
        >
          Shared with 14 people
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
      <Styled_TEXT type="label_small" style={{ textAlign: "left" }}>
        {total_count > 0
          ? `${total_count} ${t("other.vocabs")}`
          : t("other.emptyList")}
      </Styled_TEXT>

      <VocabDifficulty_COUNTS
        difficulties={{ diff_1_count, diff_2_count, diff_3_count }}
      />
    </Transition_BTN>
  );
}

const enhance = withObservables([], ({ list }: { list: List_MODEL }) => ({
  vocabs: list.vocabs,
  diff_1_count: list.diff_1,
  diff_2_count: list.diff_2,
  diff_3_count: list.diff_3,
  total_count: list.totalVocabs,
}));

export const MyList_BTN = enhance(_MyList_BTN);
