//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import {
  EasyToHard_BTN,
  HardToEasy_BTN,
  MarkedToUnmarked_BTN,
  NewToOld_BTN,
  OldToNew_BTN,
  SortByDate_BTN,
  SortByDifficulty_BTN,
  SortByMarked_BTN,
  UnmarkedToMarked_BTN,
} from "@/src/components/1_grouped/buttons/Btn/variations";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

import { t } from "i18next";

export function MyVocabsSorting_CONTENT() {
  const { sorting, z_SET_sorting, z_SET_sortDirection } =
    z_USE_myVocabsDisplaySettings();

  const { type = "date", direction = "descending" } = sorting;

  return (
    <>
      <Block row={false}>
        <Label>{t("label.sortLists")}</Label>
        <SortByDate_BTN
          IS_active={type === "date"}
          onPress={() => {
            z_SET_sorting("date");
            z_SET_sortDirection("descending");
          }}
        />
        <SortByMarked_BTN
          IS_active={type === "marked"}
          onPress={() => {
            z_SET_sorting("marked");
            z_SET_sortDirection("descending");
          }}
        />
        <SortByDifficulty_BTN
          IS_active={type === "difficulty"}
          onPress={() => {
            z_SET_sorting("difficulty");
            z_SET_sortDirection("descending");
          }}
        />
      </Block>

      <Block>
        <Label>{t("label.sortDirection")}</Label>
        {type === "date" ? (
          <>
            <NewToOld_BTN
              IS_active={direction === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <OldToNew_BTN
              IS_active={direction === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : type === "marked" ? (
          <>
            <MarkedToUnmarked_BTN
              IS_active={direction === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <UnmarkedToMarked_BTN
              IS_active={direction === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : type === "difficulty" ? (
          <>
            <HardToEasy_BTN
              IS_active={direction === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <EasyToHard_BTN
              IS_active={direction === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : null}
      </Block>
    </>
  );
}
