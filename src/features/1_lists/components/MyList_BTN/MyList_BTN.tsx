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
import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import ListBtn_BOTTOM from "../ListBtn_BOTTOM";
import VocabCount_LABEL from "../VocabCount_LABEL";
import ListBtn_TOP from "../ListBtn_TOP";

function _MyList_BTN({
  diff_1_count = 0,
  diff_2_count = 0,
  diff_3_count = 0,
  vocab_COUNT = 0,
  list,
  onPress,
  highlighted,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
  vocab_COUNT: number;
  list: List_MODEL;
  onPress: () => void;
  highlighted: boolean;
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
    <Transition_BTN {...{ onPress, highlighted }}>
      <ListBtn_TOP
        name={list?.name}
        description={list?.description}
        IS_shared={list?.type === "shared"}
        IS_submitted={IS_submitted && !IS_accepted}
      />

      <ListBtn_BOTTOM>
        <VocabCount_LABEL {...{ vocab_COUNT }} />

        <VocabDifficulty_COUNTS
          {...{ diff_1_count, diff_2_count, diff_3_count }}
        />
      </ListBtn_BOTTOM>
    </Transition_BTN>
  );
}

const enhance = withObservables([], ({ list }: { list: List_MODEL }) => ({
  diff_1_count: list.diff_1 ? list.diff_1 : 0,
  diff_2_count: list.diff_2 ? list.diff_2 : 0,
  diff_3_count: list.diff_3 ? list.diff_3 : 0,
  vocab_COUNT: list.vocab_COUNT ? list.vocab_COUNT : 0,
}));

export const MyList_BTN = enhance(_MyList_BTN);
