//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X, ICON_difficultyDot } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import { t } from "i18next";
import { useCallback } from "react";

export default function MyVocabFilter_BLOCK({
  displaySettings,
  SET_displaySettings,
}: {
  displaySettings: MyVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<MyVocabDisplaySettings_PROPS>
  >;
}) {
  const SELECT_filter = useCallback(
    (incoming_DIFF: 1 | 2 | 3) => {
      SET_displaySettings((p) => ({
        ...p,
        difficultyFilters: GET_handledDifficulties({
          difficultyFilters: p.difficultyFilters,
          incoming_DIFF,
        }),
      }));
    },
    [displaySettings]
  );

  return (
    <Block row={false}>
      <Label>{t("label.filterByDifficulty")}</Label>
      <Btn
        text={t("difficulty.easy")}
        iconRight={
          displaySettings?.difficultyFilters.some((nr) => nr === 1) ? (
            <ICON_X big={true} rotate={true} color="difficulty_1" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={1} />
          )
        }
        onPress={() => SELECT_filter(1)}
        type={
          displaySettings?.difficultyFilters.some((nr) => nr === 1)
            ? "difficulty_1_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.medium")}
        iconRight={
          displaySettings?.difficultyFilters.some((nr) => nr === 2) ? (
            <ICON_X big={true} rotate={true} color="difficulty_2" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={2} />
          )
        }
        onPress={() => SELECT_filter(2)}
        type={
          displaySettings?.difficultyFilters.some((nr) => nr === 2)
            ? "difficulty_2_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.hard")}
        iconRight={
          displaySettings?.difficultyFilters.some((nr) => nr === 3) ? (
            <ICON_X big={true} rotate={true} color="difficulty_3" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={3} />
          )
        }
        onPress={() => SELECT_filter(3)}
        type={
          displaySettings?.difficultyFilters.some((nr) => nr === 3)
            ? "difficulty_3_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}

function GET_handledDifficulties({
  difficultyFilters,
  incoming_DIFF,
}: {
  difficultyFilters: (1 | 2 | 3)[];
  incoming_DIFF: 1 | 2 | 3;
}) {
  if (difficultyFilters) {
    return difficultyFilters.some((d) => d === incoming_DIFF)
      ? difficultyFilters.filter((d) => d !== incoming_DIFF)
      : [...difficultyFilters, incoming_DIFF];
  }

  return difficultyFilters;
}
