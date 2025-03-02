//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import {
  FewToMany_BTN,
  ManyToFew_BTN,
  NewToOld_BTN,
  OldToNew_BTN,
  SortByDate_BTN,
  SortByDifficulty_BTN,
  SortByMarked_BTN,
  SortBySavedCount_BTN,
  SortByVocabCount_BTN,
} from "@/src/components/1_grouped/buttons/Btn/variations";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

import { t } from "i18next";

export function MyVocabsSorting_CONTENT() {
  const { z_myVocabDisplay_SETTINGS, z_SET_sorting, z_SET_sortDirection } =
    z_USE_myVocabsDisplaySettings();

  return (
    <>
      <Block row={false}>
        <Label>{t("label.sortLists")}</Label>
        <SortByDate_BTN
          IS_active={z_myVocabDisplay_SETTINGS?.sorting === "date"}
          onPress={() => z_SET_sorting("date")}
        />
        <SortByMarked_BTN
          IS_active={z_myVocabDisplay_SETTINGS?.sorting === "marked"}
          onPress={() => z_SET_sorting("marked")}
        />
        <SortByDifficulty_BTN
          IS_active={z_myVocabDisplay_SETTINGS?.sorting === "difficulty"}
          onPress={() => z_SET_sorting("difficulty")}
        />
      </Block>

      {/* <Block>
        <Label>{t("label.sortDirection")}</Label>
        {z_myVocabDisplay_SETTINGS?.sorting === "date" ? (
          <>
            <NewToOld_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <OldToNew_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : z_myVocabDisplay_SETTINGS?.sorting === "vocab-count" ? (
          <>
            <FewToMany_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : z_myVocabDisplay_SETTINGS?.sorting === "saved-count" ? (
          <>
            <FewToMany_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={
                z_myVocabDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : null}
      </Block> */}
    </>
  );
}
