import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_X,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { t } from "i18next";

import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";
import { DisplaySettingsModalView_PROPS } from "../../VocabDisplaySettings_MODAL";
import GET_handledDifficulties from "../../utils/GET_handledDifficulties";

export default function DifficultyFilters_BLOCK({
  view = "preview",
  HAS_difficulties = true,
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  HAS_difficulties: boolean;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
  function TOGGLE_difficulty(diff: 1 | 2 | 3) {
    if (z_SET_vocabDisplaySettings) {
      z_SET_vocabDisplaySettings({
        difficultyFilters: GET_handledDifficulties({
          difficultyFilters: z_vocabDisplay_SETTINGS?.difficultyFilters || [],
          incoming_DIFF: diff,
        }),
      });
    }
  }

  return view === "filter" && HAS_difficulties ? (
    <Block>
      <Label>{t("label.filterByDifficulty")}</Label>
      <Btn
        text={t("difficulty.easy")}
        iconRight={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 1) ? (
            <ICON_X big={true} rotate={true} color="difficulty_1" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={1} />
          )
        }
        onPress={() => TOGGLE_difficulty(1)}
        type={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 1)
            ? "difficulty_1_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.medium")}
        iconRight={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 2) ? (
            <ICON_X big={true} rotate={true} color="difficulty_2" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={2} />
          )
        }
        onPress={() => TOGGLE_difficulty(2)}
        type={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 2)
            ? "difficulty_2_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.hard")}
        iconRight={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 3) ? (
            <ICON_X big={true} rotate={true} color="difficulty_3" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={3} />
          )
        }
        onPress={() => TOGGLE_difficulty(3)}
        type={
          z_vocabDisplay_SETTINGS?.difficultyFilters.some((nr) => nr === 3)
            ? "difficulty_3_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  ) : null;
}
