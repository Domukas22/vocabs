//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_markedStar,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { t } from "i18next";

export function MyListsFiltering_CONTENT() {
  const { z_myListsCollectedLangIds } = z_USE_myLists();
  const {
    filters,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_HANDLE_markedFilter,
  } = z_USE_myListsDisplaySettings();

  const { langs = [], difficulties = [], byMarked = false } = filters;

  return (
    <>
      <LanguagesBtn_BLOCK
        allLang_IDs={z_myListsCollectedLangIds}
        activeLang_IDs={langs}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
        label={t("label.filterByLanguage")}
      />

      <Block>
        <Label>{t("label.otherFilters")}</Label>
        <Btn
          text={t("btn.filterListsByMarkedVocabs")}
          iconRight={
            byMarked ? <ICON_X big rotate color="green" /> : <ICON_markedStar />
          }
          type={byMarked ? "active_green" : "simple"}
          text_STYLES={{ flex: 1 }}
          onPress={z_HANDLE_markedFilter}
        />
        <Btn
          text={t("btn.filterListsByVocabDifficulty1")}
          iconRight={
            difficulties?.includes(3) ? (
              <ICON_X big rotate color="difficulty_3" />
            ) : (
              <ICON_difficultyDot difficulty={3} />
            )
          }
          type={difficulties?.includes(3) ? "difficulty_3_active" : "simple"}
          text_STYLES={{ flex: 1 }}
          onPress={() => z_HANDLE_difficultyFilter(3)}
        />
        <Btn
          text={t("btn.filterListsByVocabDifficulty2")}
          iconRight={
            difficulties?.includes(2) ? (
              <ICON_X big rotate color="difficulty_2" />
            ) : (
              <ICON_difficultyDot difficulty={2} />
            )
          }
          type={difficulties?.includes(2) ? "difficulty_2_active" : "simple"}
          text_STYLES={{ flex: 1 }}
          onPress={() => z_HANDLE_difficultyFilter(2)}
        />
        <Btn
          text={t("btn.filterListsByVocabDifficulty3")}
          iconRight={
            difficulties?.includes(1) ? (
              <ICON_X big rotate color="difficulty_1" />
            ) : (
              <ICON_difficultyDot difficulty={1} />
            )
          }
          type={difficulties?.includes(1) ? "difficulty_1_active" : "simple"}
          text_STYLES={{ flex: 1 }}
          onPress={() => z_HANDLE_difficultyFilter(1)}
        />
      </Block>
    </>
  );
}
