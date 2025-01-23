//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_calendar,
  ICON_shuffle,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

import { t } from "i18next";
import { USE_zustand } from "@/src/hooks";

export default function VocabSorting_BLOCKS() {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  return (
    <Block row={false}>
      <Label>{t("label.sortVocabs")}</Label>
      <Btn
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
        onPress={() => z_SET_vocabDisplaySettings({ sorting: "shuffle" })}
        type={
          z_vocabDisplay_SETTINGS?.sorting === "shuffle" ? "active" : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
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
        onPress={() => z_SET_vocabDisplaySettings({ sorting: "difficulty" })}
        type={
          z_vocabDisplay_SETTINGS?.sorting === "difficulty"
            ? "active"
            : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar
            color={
              z_vocabDisplay_SETTINGS?.sorting === "date" ? "primary" : "grey"
            }
          />
        }
        onPress={() => z_SET_vocabDisplaySettings({ sorting: "date" })}
        type={z_vocabDisplay_SETTINGS?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
