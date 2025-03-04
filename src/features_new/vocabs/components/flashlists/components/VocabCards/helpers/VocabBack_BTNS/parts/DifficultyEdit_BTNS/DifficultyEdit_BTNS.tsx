//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { USE_updateVocabDifficulty } from "@/src/features_new/vocabs/hooks/actions/USE_updateVocabDifficulty/USE_updateVocabDifficulty";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

export function DifficultyEdit_BTNS({
  vocab,
  SHOULD_updateListUpdatedAt = false,
  TOGGLE_open,
}: {
  vocab: Vocab_TYPE;
  SHOULD_updateListUpdatedAt: boolean;
  TOGGLE_open: () => void;
}) {
  const { z_currentActions, IS_inAction } = z_USE_currentActions();

  const IS_updatingDifficulty = useMemo(
    () => IS_inAction("vocab", vocab?.id, "updating_difficulty"),
    [z_currentActions]
  );

  const IS_updating = IS_updatingDifficulty;
  const target_DIFFICULTY = undefined;
  const { UPDATE_vocabDifficulty } = USE_updateVocabDifficulty();

  const UPDATE_diff = useCallback(
    async (new_DIFFICULY: 1 | 2 | 3) =>
      await UPDATE_vocabDifficulty(
        vocab?.id,
        vocab?.difficulty,
        new_DIFFICULY,
        SHOULD_updateListUpdatedAt
      ),
    []
  );

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 0,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Btn
        type={vocab?.difficulty === 1 ? "difficulty_1_active" : "simple"}
        style={[
          {
            flex: 1,
            height: 50,
            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            borderRadius: 0,
          },
          vocab?.difficulty !== 1 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (vocab?.difficulty !== 1) UPDATE_diff(1);
        }}
        iconLeft={
          IS_updating && target_DIFFICULTY === 1 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_1} />
          ) : (
            <ICON_difficultyDot difficulty={1} size="big" />
          )
        }
      />

      <Btn
        type={vocab?.difficulty === 2 ? "difficulty_2_active" : "simple"}
        style={[
          { flex: 1, borderRadius: 0 },
          vocab?.difficulty !== 2 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (vocab?.difficulty !== 2) UPDATE_diff(2);
        }}
        iconLeft={
          IS_updating && target_DIFFICULTY === 2 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_2} />
          ) : (
            <ICON_difficultyDot difficulty={2} size="big" />
          )
        }
      />

      <Btn
        type={vocab?.difficulty === 3 ? "difficulty_3_active" : "simple"}
        style={[
          { flex: 1, borderRadius: 0 },
          vocab?.difficulty !== 3 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (vocab?.difficulty !== 3) UPDATE_diff(3);
        }}
        iconLeft={
          IS_updating && target_DIFFICULTY === 3 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_3} />
          ) : (
            <ICON_difficultyDot difficulty={3} size="big" />
          )
        }
      />
      <Btn
        type="simple"
        style={{
          borderBottomRightRadius: 12,
          borderTopRightRadius: 12,
          borderRadius: 0,
          paddingLeft: 18,
          paddingRight: 20,
        }}
        onPress={TOGGLE_open}
        iconLeft={<ICON_X big rotate={true} />}
      />
    </View>
  );
}
