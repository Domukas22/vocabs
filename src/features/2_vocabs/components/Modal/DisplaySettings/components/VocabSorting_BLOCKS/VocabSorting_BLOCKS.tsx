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
import { Language_MODEL, DisplaySettings_PROPS } from "@/src/db/models";
import { t } from "i18next";
import VocabFrontLang_BLOCK from "../VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";

export default function VocabSorting_BLOCKS({
  displaySettings,
  SET_displaySettings,
}: {
  displaySettings: DisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettings_PROPS>
  >;
  list_LANGS: Language_MODEL[];
}) {
  return (
    <Block row={false}>
      <Label>{t("modal.displaySettings.label.sorting")}</Label>
      <Btn
        text={t("btn.sortByShuffling")}
        iconRight={
          <ICON_shuffle
            color={
              displaySettings?.sorting === "shuffle" ? "primary" : "grey_light"
            }
          />
        }
        onPress={() =>
          SET_displaySettings((p) => ({ ...p, sorting: "shuffle" }))
        }
        type={displaySettings?.sorting === "shuffle" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.sortByDifficulty")}
        iconRight={
          <ICON_difficultyDot
            big={true}
            difficulty={displaySettings?.sorting === "difficulty" ? 0 : 1}
          />
        }
        onPress={() =>
          SET_displaySettings((p) => ({ ...p, sorting: "difficulty" }))
        }
        type={displaySettings?.sorting === "difficulty" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
      <Btn
        text={t("btn.sortByDate")}
        iconRight={
          <ICON_calendar
            color={displaySettings?.sorting === "date" ? "primary" : "grey"}
          />
        }
        onPress={() => SET_displaySettings((p) => ({ ...p, sorting: "date" }))}
        type={displaySettings?.sorting === "date" ? "active" : "simple"}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
