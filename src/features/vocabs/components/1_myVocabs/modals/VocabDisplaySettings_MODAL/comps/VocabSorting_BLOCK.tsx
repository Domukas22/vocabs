//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_calendar,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "../VocabDisplaySettings_MODAL";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";

export default function VocabSorting_BLOCK({
  view = "preview",
  z_vocabDisplay_SETTINGS,
  HAS_difficulties = true,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  HAS_difficulties?: boolean;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
  function SET_sorting(sorting: "shuffle" | "date" | "difficulty") {
    if (z_SET_vocabDisplaySettings) {
      z_SET_vocabDisplaySettings({ sorting });
    }
  }

  return view === "sort" ? (
    <Block row={false}>
      <Label>{t("label.sortVocabs")}</Label>
      {/* <Btn
        text={t("btn.sortByShuffling")}
        iconRight={
          <ICON_shuffle
            color={
              z_vocabDisplay_SETTINGS?.sorting === "shuffle"
                ? "primary"
                : "grey_light"
            }
          />
        }
        onPress={() => SET_sorting("shuffle")}
        type={z_vocabDisplay_SETTINGS?.sorting === "shuffle" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      /> */}
      {HAS_difficulties ? (
        <Btn
          text={t("btn.sortByDifficulty")}
          iconRight={
            <ICON_difficultyDot
              big={true}
              difficulty={
                z_vocabDisplay_SETTINGS?.sorting === "difficulty" ? 0 : 1
              }
            />
          }
          onPress={() => SET_sorting("difficulty")}
          type={
            z_vocabDisplay_SETTINGS?.sorting === "difficulty"
              ? "active"
              : "simple"
          }
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
      ) : null}
      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar
            color={
              z_vocabDisplay_SETTINGS?.sorting === "date" ? "primary" : "grey"
            }
          />
        }
        onPress={() => SET_sorting("date")}
        type={z_vocabDisplay_SETTINGS?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  ) : null;
}
