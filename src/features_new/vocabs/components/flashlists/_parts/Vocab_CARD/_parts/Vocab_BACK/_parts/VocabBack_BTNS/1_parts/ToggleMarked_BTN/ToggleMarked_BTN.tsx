//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_markedStar } from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_markVocab } from "@/src/features_new/vocabs/hooks/actions/USE_markVocab/USE_markVocab";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { memo, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

type props = {
  vocab: Vocab_TYPE;
  SHOULD_updateListUpdatedAt: boolean;
};

export const ToggleMarked_BTN = memo((props: props) => {
  const { vocab, SHOULD_updateListUpdatedAt = false } = props;

  const { MARK_vocab } = USE_markVocab();
  const { z_currentActions, IS_inAction } = z_USE_currentActions();

  const IS_updatingMarked = useMemo(
    () => IS_inAction("vocab", vocab?.id, "updating_marked"),
    [z_currentActions]
  );

  return (
    <Btn
      type={vocab?.is_marked ? "active_green" : "simple"}
      onPress={async () => {
        await MARK_vocab(
          vocab?.id,
          vocab?.list_id || "",
          !vocab?.is_marked,
          SHOULD_updateListUpdatedAt
        );
      }} // Toggle spinning on press
      stayPressed={IS_updatingMarked}
      iconLeft={
        <View style={{ width: 26, alignItems: "center" }}>
          {IS_updatingMarked ? (
            <ActivityIndicator
              color={
                vocab?.is_marked ? MyColors.icon_green : MyColors.icon_gray
              }
            />
          ) : (
            <ICON_markedStar
              color={vocab?.is_marked ? "green" : "gray"}
              size="big"
            />
          )}
        </View>
      }
    />
  );
});
