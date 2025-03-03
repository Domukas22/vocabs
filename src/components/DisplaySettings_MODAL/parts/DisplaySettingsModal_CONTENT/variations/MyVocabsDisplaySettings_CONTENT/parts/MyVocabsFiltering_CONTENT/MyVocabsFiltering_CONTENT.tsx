//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_X,
  ICON_difficultyDot,
  ICON_markedStar,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_publicLists } from "@/src/features_new/lists/hooks/zustand/z_USE_publicLists/z_USE_publicLists";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { t } from "i18next";

export function MyVocabsFiltering_CONTENT() {
  const { z_myOneList } = z_USE_myOneList();
  const {
    filters,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_HANDLE_markedFilter,
  } = z_USE_myVocabsDisplaySettings();

  const { langs = [], difficulties = [], byMarked = false } = filters;

  return (
    <>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_myOneList?.collected_lang_ids || []}
        activeLang_IDs={langs}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
      <Block>
        <Label>{t("label.difficultyFilters")}</Label>
        <Btn
          text={t("btn.filterVocabsByDifficulty3")}
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
          text={t("btn.filterVocabsByDifficulty2")}
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
          text={t("btn.filterVocabsByDifficulty1")}
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
      <Block>
        <Label>{t("label.otherFilters")}</Label>
        <Btn
          text={t("btn.filterVocabsByMarked")}
          iconRight={
            byMarked ? (
              <ICON_X big rotate color="green" />
            ) : (
              <ICON_markedStar color="green" />
            )
          }
          type={byMarked ? "active_green" : "simple"}
          text_STYLES={{ flex: 1 }}
          onPress={z_HANDLE_markedFilter}
        />
      </Block>
    </>
  );
}
