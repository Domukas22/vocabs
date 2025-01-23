//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { View } from "react-native";

export default function VocabBackDifficultyEdit_BTNS({
  active_DIFFICULTY,
  UPDATE_difficulty,
  TOGGLE_open,
}: {
  active_DIFFICULTY: 1 | 2 | 3;

  UPDATE_difficulty: (diff: 1 | 2 | 3) => void;
  TOGGLE_open: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Btn
        type={active_DIFFICULTY === 1 ? "difficulty_1_active" : "simple"}
        style={{ flex: 1, height: 50 }}
        onPress={() => UPDATE_difficulty(1)}
        iconLeft={<ICON_difficultyDot difficulty={1} big={true} />}
      />

      <Btn
        type={active_DIFFICULTY === 2 ? "difficulty_2_active" : "simple"}
        style={{ flex: 1 }}
        onPress={() => UPDATE_difficulty(2)}
        iconLeft={<ICON_difficultyDot difficulty={2} big={true} />}
      />

      <Btn
        type={active_DIFFICULTY === 3 ? "difficulty_3_active" : "simple"}
        style={{ flex: 1 }}
        onPress={() => UPDATE_difficulty(3)}
        iconLeft={<ICON_difficultyDot difficulty={3} big={true} />}
      />
      <Btn
        type="simple"
        onPress={TOGGLE_open}
        iconLeft={<ICON_X big={true} rotate={true} />}
      />
    </View>
  );
}
