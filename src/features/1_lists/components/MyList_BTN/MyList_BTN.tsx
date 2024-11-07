//
//
//
//

import { View } from "react-native";
import { Styled_TEXT } from "../../../../components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import VocabDifficulty_COUNTS from "../VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { withObservables } from "@nozbe/watermelondb/react";
import Big_BTN from "@/src/components/Transition_BTN/Big_BTN";
import ListBtn_BOTTOM from "../ListBtn_BOTTOM";
import VocabCount_LABEL from "../VocabCount_LABEL";
import ListBtn_TOP from "../ListBtn_TOP";
import List_FLAGS from "../List_FLAGS";

function _MyList_BTN({
  diff_1_count = 0,
  diff_2_count = 0,
  diff_3_count = 0,
  vocab_COUNT = 0,
  list,
  onPress,
  highlighted,
  blurAndDisable = false,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
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
    <Big_BTN {...{ onPress, highlighted, blurAndDisable }}>
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
        {/* {vocab_COUNT > 0 ? (
          <VocabDifficulty_COUNTS
            {...{ diff_1_count, diff_2_count, diff_3_count }}
          />
        ) : (
          <Styled_TEXT type="label_small">{t("label.emptyList")}</Styled_TEXT>
        )} */}

        {/* <VocabCount_LABEL vocab_COUNT={vocab_COUNT} /> */}
        {/* {list?.description && (
          <Styled_TEXT type="label_small">{list?.description}</Styled_TEXT>
        )} */}
        {/* <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginTop: 4,
            justifyContent: "space-between",
          }}
        > */}
        {/* <VocabCount_LABEL {...{ vocab_COUNT }} />
        <VocabDifficulty_COUNTS
          {...{ diff_1_count, diff_2_count, diff_3_count }}
        /> */}
        {/* </View> */}
      </ListBtn_TOP>

      {vocab_COUNT > 0 && (
        <ListBtn_BOTTOM>
          <VocabDifficulty_COUNTS
            {...{ diff_1_count, diff_2_count, diff_3_count }}
          />

          <List_FLAGS lang_ids={list?.collected_lang_ids?.split(",") || []} />
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
}));

export const MyList_BTN = enhance(_MyList_BTN);
