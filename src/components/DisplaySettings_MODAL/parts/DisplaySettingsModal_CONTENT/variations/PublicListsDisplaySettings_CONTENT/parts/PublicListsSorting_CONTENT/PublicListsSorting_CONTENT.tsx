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
  const { sorting, sortDirection, z_SET_sorting, z_SET_sortDirection } =
    z_USE_publicListsDisplaySettings();

  return (
    <>
      <Block row={false}>
        <Label>{t("label.sortLists")}</Label>
        <SortByDate_BTN
          IS_active={sorting === "date"}
          onPress={() => z_SET_sorting("date")}
        />
        <SortByVocabCount_BTN
          IS_active={sorting === "vocab-count"}
          onPress={() => z_SET_sorting("vocab-count")}
        />
        <SortBySavedCount_BTN
          IS_active={sorting === "saved-count"}
          onPress={() => z_SET_sorting("saved-count")}
        />
      </Block>

      <Block>
        <Label>{t("label.sortDirection")}</Label>
        {sorting === "date" ? (
          <>
            <NewToOld_BTN
              IS_active={sortDirection === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <OldToNew_BTN
              IS_active={sortDirection === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : sorting === "vocab-count" ? (
          <>
            <FewToMany_BTN
              IS_active={sortDirection === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={sortDirection === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : sorting === "saved-count" ? (
          <>
            <FewToMany_BTN
              IS_active={sortDirection === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
            <ManyToFew_BTN
              IS_active={sortDirection === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
          </>
        ) : null}
      </Block>
    </>
  );
}
