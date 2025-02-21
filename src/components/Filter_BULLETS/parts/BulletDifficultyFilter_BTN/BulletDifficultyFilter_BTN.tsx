//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";

export function BulletDifficultyFilter_BTN({
  difficulty = 1,
  REMOVE_difficulty = () => {},
}: {
  difficulty: 1 | 2 | 3;
  REMOVE_difficulty: (difficulty: number) => void;
}) {
  return (
    <Btn
      iconLeft={<ICON_difficultyDot difficulty={difficulty} />}
      text={"Difficulty: " + difficulty}
      iconRight={
        <ICON_X color={`difficulty_${difficulty || 1}`} rotate={true} />
      }
      type={`difficulty_${difficulty || 1}_active`}
      tiny={true}
      onPress={() => REMOVE_difficulty(difficulty)}
    />
  );
}
