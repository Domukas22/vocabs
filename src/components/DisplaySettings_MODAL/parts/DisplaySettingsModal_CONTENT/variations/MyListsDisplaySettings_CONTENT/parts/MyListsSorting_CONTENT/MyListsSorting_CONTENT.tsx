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
  SortByVocabCount_BTN,
} from "@/src/components/1_grouped/buttons/Btn/variations";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";

export function MyListsSorting_CONTENT() {
  const {
    sorting: { direction, type },
    z_SET_sorting,
    z_SET_sortDirection,
  } = z_USE_myListsDisplaySettings();

  return (
    <DisplaySettingsModalContent_SCROLLVIEW>
      <Block row={false}>
        <Label>{t("label.sortLists")}</Label>
        <SortByDate_BTN
          IS_active={type === "date"}
          onPress={() => {
            z_SET_sorting("date");
            z_SET_sortDirection("descending");
          }}
        />
        <SortByVocabCount_BTN
          IS_active={type === "vocab-count"}
          onPress={() => {
            z_SET_sorting("vocab-count");
            z_SET_sortDirection("ascending");
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
        ) : (
          <>
            <ManyToFew_BTN
              IS_active={direction === "ascending"}
              onPress={() => z_SET_sortDirection("ascending")}
            />
            <FewToMany_BTN
              IS_active={direction === "descending"}
              onPress={() => z_SET_sortDirection("descending")}
            />
          </>
        )}
      </Block>
    </DisplaySettingsModalContent_SCROLLVIEW>
  );
}
