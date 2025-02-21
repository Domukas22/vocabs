//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { ActivityIndicator, View } from "react-native";

export default function VocabBackDifficultyEdit_BTNS({
  active_DIFFICULTY,
  UPDATE_vocabDifficulty,
  TOGGLE_open,
  IS_updatingDifficulty,
}: {
  active_DIFFICULTY: number;
  UPDATE_vocabDifficulty: (diff: 1 | 2 | 3) => void;
  TOGGLE_open: () => void;
  IS_updatingDifficulty: {
    IS_updating: boolean;
    target_DIFFICULTY: number | undefined;
  };
}) {
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
        type={active_DIFFICULTY === 1 ? "difficulty_1_active" : "simple"}
        style={[
          {
            flex: 1,
            height: 50,
            borderBottomLeftRadius: 12,
            borderTopLeftRadius: 12,
            borderRadius: 0,
          },
          active_DIFFICULTY !== 1 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (active_DIFFICULTY !== 1) UPDATE_vocabDifficulty(1);
        }}
        iconLeft={
          IS_updatingDifficulty?.IS_updating &&
          IS_updatingDifficulty?.target_DIFFICULTY === 1 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_1} />
          ) : (
            <ICON_difficultyDot difficulty={1} size="big" />
          )
        }
      />

      <Btn
        type={active_DIFFICULTY === 2 ? "difficulty_2_active" : "simple"}
        style={[
          { flex: 1, borderRadius: 0 },
          active_DIFFICULTY !== 2 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (active_DIFFICULTY !== 2) UPDATE_vocabDifficulty(2);
        }}
        iconLeft={
          IS_updatingDifficulty?.IS_updating &&
          IS_updatingDifficulty?.target_DIFFICULTY === 2 ? (
            <ActivityIndicator color={MyColors.icon_difficulty_2} />
          ) : (
            <ICON_difficultyDot difficulty={2} size="big" />
          )
        }
      />

      <Btn
        type={active_DIFFICULTY === 3 ? "difficulty_3_active" : "simple"}
        style={[
          { flex: 1, borderRadius: 0 },
          active_DIFFICULTY !== 3 && { borderRightColor: "transparent" },
        ]}
        onPress={() => {
          if (active_DIFFICULTY !== 3) UPDATE_vocabDifficulty(3);
        }}
        iconLeft={
          IS_updatingDifficulty?.IS_updating &&
          IS_updatingDifficulty?.target_DIFFICULTY === 3 ? (
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
