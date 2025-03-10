//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { t } from "i18next";

export function MyVocabsDifficultyBtn_BLOCK({
  difficulties = [],
  HANDLE_difficulty = () => {},
}: {
  difficulties: (1 | 2 | 3)[];
  HANDLE_difficulty: (diff: 1 | 2 | 3) => void;
}) {
  return (
    <Block>
      <Label>{t("label.difficultyFilters")}</Label>
      <Btn
        text={t("btn.filterVocabsByDifficulty3")}
        iconRight={
          difficulties?.includes(3) ? (
            <ICON_X big rotate color="difficulty_3" />
          ) : (
            <ICON_difficultyDot difficulty={3} />
          )
        }
        type={difficulties?.includes(3) ? "difficulty_3_active" : "simple"}
        text_STYLES={{ flex: 1 }}
        onPress={() => HANDLE_difficulty(3)}
      />
      <Btn
        text={t("btn.filterVocabsByDifficulty2")}
        iconRight={
          difficulties?.includes(2) ? (
            <ICON_X big rotate color="difficulty_2" />
          ) : (
            <ICON_difficultyDot difficulty={2} />
          )
        }
        type={difficulties?.includes(2) ? "difficulty_2_active" : "simple"}
        text_STYLES={{ flex: 1 }}
        onPress={() => HANDLE_difficulty(2)}
      />
      <Btn
        text={t("btn.filterVocabsByDifficulty1")}
        iconRight={
          difficulties?.includes(1) ? (
            <ICON_X big rotate color="difficulty_1" />
          ) : (
            <ICON_difficultyDot difficulty={1} />
          )
        }
        type={difficulties?.includes(1) ? "difficulty_1_active" : "simple"}
        text_STYLES={{ flex: 1 }}
        onPress={() => HANDLE_difficulty(1)}
      />
    </Block>
  );
}
