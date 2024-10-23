import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X, ICON_difficultyDot } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/DisplaySettings_MODAL";
import GET_handledDifficulties from "../DisplaySettings_MODAL/utils/GET_handledDifficulties";
import { DisplaySettings_PROPS, SetDisplaySettings_PROPS } from "@/src/zustand";

export default function DifficultyFilters_BLOCK({
  view = "preview",
  HAS_difficulties = true,
  z_display_SETTINGS,
  z_SET_displaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  HAS_difficulties: boolean;
  z_display_SETTINGS: DisplaySettings_PROPS | undefined;
  z_SET_displaySettings: SetDisplaySettings_PROPS | undefined;
}) {
  function TOGGLE_difficulty(diff: 1 | 2 | 3) {
    if (z_SET_displaySettings) {
      z_SET_displaySettings({
        difficultyFilters: GET_handledDifficulties({
          difficultyFilters: z_display_SETTINGS?.difficultyFilters || [],
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
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 1) ? (
            <ICON_X big={true} rotate={true} color="difficulty_1" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={1} />
          )
        }
        onPress={() => TOGGLE_difficulty(1)}
        type={
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 1)
            ? "difficulty_1_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.medium")}
        iconRight={
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 2) ? (
            <ICON_X big={true} rotate={true} color="difficulty_2" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={2} />
          )
        }
        onPress={() => TOGGLE_difficulty(2)}
        type={
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 2)
            ? "difficulty_2_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("difficulty.hard")}
        iconRight={
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 3) ? (
            <ICON_X big={true} rotate={true} color="difficulty_3" />
          ) : (
            <ICON_difficultyDot big={true} difficulty={3} />
          )
        }
        onPress={() => TOGGLE_difficulty(3)}
        type={
          z_display_SETTINGS?.difficultyFilters.some((nr) => nr === 3)
            ? "difficulty_3_active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  ) : null;
}
