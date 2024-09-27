//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_calendar,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import { t } from "i18next";

export default function MyVocabSorting_BLOCKS({
  displaySettings,
  SET_displaySettings,
}: {
  displaySettings: MyVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<MyVocabDisplaySettings_PROPS>
  >;
}) {
  return (
    <Block row={false}>
      <Label>{t("modal.displaySettings.label.sorting")}</Label>
      <Btn
        text={t("btn.sortByShuffling")}
        iconRight={
          <ICON_difficultyDot
            big={true}
            difficulty={displaySettings?.sorting === "shuffle" ? 0 : 1}
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
