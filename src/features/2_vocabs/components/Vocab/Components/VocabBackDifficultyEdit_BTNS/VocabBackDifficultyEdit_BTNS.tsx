//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_difficultyDot, ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { View, ActivityIndicator } from "react-native";

export default function VocabBackDifficultyEdit_BTNS({
  active_DIFFICULTY,
  privateVocabDifficultyEdit_PROPS,
  EDIT_difficulty,
  TOGGLE_open,
}: {
  active_DIFFICULTY: 1 | 2 | 3;
  privateVocabDifficultyEdit_PROPS: {
    loading: boolean;
    targetDifficulty: 1 | 2 | 3 | undefined;
  };

  EDIT_difficulty: (diff: 1 | 2 | 3) => void;
  TOGGLE_open: () => void;
}) {
  const { loading, targetDifficulty } = privateVocabDifficultyEdit_PROPS;

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Btn
        type={active_DIFFICULTY === 1 ? "difficulty_1_active" : "simple"}
        style={{ flex: 1, height: 50 }}
        onPress={() => EDIT_difficulty(1)}
        iconLeft={
          loading && targetDifficulty === 1 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_1} />
          ) : (
            <ICON_difficultyDot difficulty={1} big={true} />
          )
        }
      />

      <Btn
        type={active_DIFFICULTY === 2 ? "difficulty_2_active" : "simple"}
        style={{ flex: 1 }}
        onPress={() => EDIT_difficulty(2)}
        iconLeft={
          loading && targetDifficulty === 2 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_2} />
          ) : (
            <ICON_difficultyDot difficulty={2} big={true} />
          )
        }
      />

      <Btn
        type={active_DIFFICULTY === 3 ? "difficulty_3_active" : "simple"}
        style={{ flex: 1 }}
        onPress={() => EDIT_difficulty(3)}
        iconLeft={
          loading && targetDifficulty === 3 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_3} />
          ) : (
            <ICON_difficultyDot difficulty={3} big={true} />
          )
        }
      />
      <Btn
        type="simple"
        onPress={TOGGLE_open}
        iconLeft={<ICON_X big={true} rotate={true} />}
      />
    </View>
  );
}
