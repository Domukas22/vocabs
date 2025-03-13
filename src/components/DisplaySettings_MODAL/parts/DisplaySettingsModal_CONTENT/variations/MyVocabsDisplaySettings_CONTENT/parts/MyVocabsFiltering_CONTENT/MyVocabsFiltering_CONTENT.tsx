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
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";
import { MarkedFilter_BTN, MyVocabsDifficultyBtn_BLOCK } from "./_parts";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";

export function MyVocabsFiltering_CONTENT() {
  const { z_lang_IDS: z_myVocabsCollectedLang_IDS = [] } = z_USE_myVocabs();
  const {
    filters,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_HANDLE_markedFilter,
  } = z_USE_myVocabsDisplaySettings();

  const { langs = [], difficulties = [], byMarked = false } = filters;

  return (
    <DisplaySettingsModalContent_SCROLLVIEW>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_myVocabsCollectedLang_IDS}
        activeLang_IDs={langs}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
      <MyVocabsDifficultyBtn_BLOCK
        difficulties={difficulties}
        HANDLE_difficulty={(diff) => () => z_HANDLE_difficultyFilter(diff)}
      />
      <Block>
        <Label>{t("label.otherFilters")}</Label>
        <MarkedFilter_BTN
          HAS_markedFilter={byMarked}
          onPress={z_HANDLE_markedFilter}
        />
      </Block>
    </DisplaySettingsModalContent_SCROLLVIEW>
  );
}
