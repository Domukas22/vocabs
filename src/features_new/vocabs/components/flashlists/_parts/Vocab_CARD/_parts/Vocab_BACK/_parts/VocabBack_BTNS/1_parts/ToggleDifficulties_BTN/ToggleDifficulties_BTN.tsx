//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficulty,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { memo, useMemo } from "react";
import { ActivityIndicator } from "react-native";

type props = {
  onPress: () => void;
  vocab: Vocab_TYPE;
};

export const ToggleDifficulties_BTN = memo(
  ({ onPress = () => {}, vocab }: props) => {
    const { z_currentActions, IS_inAction } = z_USE_currentActions();

    const IS_updatingDifficulty = useMemo(
      () => IS_inAction("vocab", vocab?.id, "updating_difficulty"),
      [z_currentActions]
    );
    return (
      <Btn
        type="simple"
        onPress={onPress}
        style={{ width: 56 }}
        iconLeft={
          IS_updatingDifficulty ? (
            <ActivityIndicator color={MyColors.icon_gray} />
          ) : (
            <ICON_difficulty
              difficulty={vocab?.difficulty || 3}
              size="medium"
            />
          )
        }
      />
    );
  }
);
