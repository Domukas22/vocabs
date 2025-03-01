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
  SortBySavedCount_BTN,
  SortByVocabCount_BTN,
} from "@/src/components/1_grouped/buttons/Btn/variations";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";

import { t } from "i18next";

export function PublicListsSorting_CONTENT() {
  const { z_publicListDisplay_SETTINGS, z_SET_sorting, z_SET_sortDirection } =
    z_USE_publicListsDisplaySettings();

  return (
    <>
      <Block row={false}>
        <Label>{t("label.sortLists")}</Label>
        <SortByDate_BTN
          IS_active={z_publicListDisplay_SETTINGS?.sorting === "date"}
          onPress={() => z_SET_sorting("date")}
        />
        <SortByVocabCount_BTN
          IS_active={z_publicListDisplay_SETTINGS?.sorting === "vocab-count"}
          onPress={() => z_SET_sorting("vocab-count")}
        />
        <SortBySavedCount_BTN
          IS_active={z_publicListDisplay_SETTINGS?.sorting === "saved-count"}
          onPress={() => z_SET_sorting("saved-count")}
        />
      </Block>

      <Block>
        <Label>{t("label.sortDirection")}</Label>
        {z_publicListDisplay_SETTINGS?.sorting === "date" ? (
          <>
            <NewToOld_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <OldToNew_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : z_publicListDisplay_SETTINGS?.sorting === "vocab-count" ? (
          <>
            <FewToMany_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : z_publicListDisplay_SETTINGS?.sorting === "saved-count" ? (
          <>
            <FewToMany_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "descending"
              }
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={
                z_publicListDisplay_SETTINGS?.sortDirection === "ascending"
              }
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : null}
      </Block>
    </>
  );
}
