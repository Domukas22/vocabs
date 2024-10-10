//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_calendar,
  ICON_shuffle,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Language_MODEL, DisplaySettings_PROPS } from "@/src/db/props";
import { t } from "i18next";
import VocabFrontLang_BLOCK from "../VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";
import USE_zustand from "@/src/zustand";

export default function VocabSorting_BLOCKS() {
  const { z_display_SETTINGS, z_SET_displaySettings } = USE_zustand();
  return (
    <Block row={false}>
      <Label>{t("modal.z_display_SETTINGS.label.sorting")}</Label>
      <Btn
        text={t("btn.sortByShuffling")}
        iconRight={
          <ICON_shuffle
            color={
              z_display_SETTINGS?.sorting === "shuffle"
                ? "primary"
                : "grey_light"
            }
          />
        }
        onPress={() => z_SET_displaySettings({ sorting: "shuffle" })}
        type={z_display_SETTINGS?.sorting === "shuffle" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.sortByDifficulty")}
        iconRight={
          <ICON_difficultyDot
            big={true}
            difficulty={z_display_SETTINGS?.sorting === "difficulty" ? 0 : 1}
          />
        }
        onPress={() => z_SET_displaySettings({ sorting: "difficulty" })}
        type={
          z_display_SETTINGS?.sorting === "difficulty" ? "active" : "simple"
        }
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar
            color={z_display_SETTINGS?.sorting === "date" ? "primary" : "grey"}
          />
        }
        onPress={() => z_SET_displaySettings({ sorting: "date" })}
        type={z_display_SETTINGS?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
