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
} from "@/src/components/1_grouped/buttons/Btn/variations";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

import { t } from "i18next";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { SortByShuffle_BTN } from "@/src/components/1_grouped/buttons/Btn/variations/SortByShuffle_BTN/SortByShuffle_BTN";
import { useMemo } from "react";

export function PublicVocabsSorting_CONTENT() {
  const { sorting, z_SET_sorting, z_SET_sortDirection } =
    z_USE_publicVocabsDisplaySettings();

  const { type = "date", direction = "descending" } = sorting;
  const SHOW_sortDirectionBlock = useMemo(
    () => type === "date" || type === "saved-count",
    [sorting]
  );

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
        <SortBySavedCount_BTN
          IS_active={type === "saved-count"}
          onPress={() => {
            z_SET_sorting("saved-count");
            z_SET_sortDirection("descending");
          }}
        />
        <SortByShuffle_BTN
          IS_active={type === "shuffle"}
          onPress={() => {
            z_SET_sorting("shuffle");
          }}
        />
      </Block>

      {SHOW_sortDirectionBlock && (
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
          ) : type === "saved-count" ? (
            <>
              <ManyToFew_BTN
                IS_active={direction === "descending"}
                onPress={() => z_SET_sortDirection("descending")}
              />
              <FewToMany_BTN
                IS_active={direction === "ascending"}
                onPress={() => z_SET_sortDirection("ascending")}
              />
            </>
          ) : null}
        </Block>
      )}
    </DisplaySettingsModalContent_SCROLLVIEW>
  );
}
