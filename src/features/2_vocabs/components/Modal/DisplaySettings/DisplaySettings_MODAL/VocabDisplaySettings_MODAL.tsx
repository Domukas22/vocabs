//
//
//

import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import VocabDisplaySettings_SUBNAV from "../components/VocabDisplaySettings_SUBNAV/VocabDisplaySettings_SUBNAV";

import Footer from "@/src/components/Footer/Footer";
import Btn from "@/src/components/Btn/Btn";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/Header/Header";
import {
  ICON_checkMark,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";

import Vocab_DUMMY from "../../../Vocab/Components/Vocab_DUMMY";
import Block from "@/src/components/Block/Block";
import USE_zustand from "@/src/zustand";
import USE_displaySettings from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import GET_activeFilterCount from "./utils/USE_getActiveFilterCount";
import USE_getActiveFilterCount from "./utils/USE_getActiveFilterCount";
import VocabPreviewToggles_BLOCK from "../components/VocabPreviewToggles_BLOCK";
import DifficultyFilters_BLOCK from "../components/DifficultyFilters_BLOCK";
import VocabSorting_BLOCK from "../VocabSorting_BLOCK";
import VocabSortDirection_BLOCK from "../VocabSortDirection_BLOCK";
import Label from "@/src/components/Label/Label";
import VocabFrontLanguageToggles_BLOCK from "../components/VocabFrontLanguageToggles_BLOCK";
import USE_langs from "@/src/features/4_languages/hooks/USE_langs";
import i18next from "i18next";
import VocabLangFilters_BLOCK from "../components/VocabLangFilters_BLOCK";
import USE_langs_2 from "@/src/features/4_languages/hooks/USE_langs_2";

interface DisplaySettingsModal_PROPS {
  open: boolean;
  HAS_difficulties?: boolean;
  collectedLang_IDS: string[] | undefined;
  TOGGLE_open: () => void;
}

export type DisplaySettingsModalView_PROPS = "preview" | "sort" | "filter";

export function VocabDisplaySettings_MODAL({
  open,
  HAS_difficulties = true,
  collectedLang_IDS = [],
  TOGGLE_open,
}: DisplaySettingsModal_PROPS) {
  const { t } = useTranslation();
  const [view, SET_view] = useState<DisplaySettingsModalView_PROPS>("preview");

  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const { langs, ARE_langsFetching, fetchLangs_ERROR } = USE_langs_2({
    lang_ids: collectedLang_IDS,
  });

  const appLang = useMemo(() => i18next.language, [i18next.language]);

  // TODO: Create a "display settings correction" function, which:
  // - if modal doesnt have difficulties, yet the selected sorting is by difficulty, change it to sorting "date"

  return (
    <Big_MODAL {...{ open }}>
      <Header
        title={t("modal.displaySettings.header")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={TOGGLE_open}
            style={{ borderRadius: 100 }}
          />
        }
      />

      <VocabDisplaySettings_SUBNAV
        {...{ view, SET_view, activeFilter_COUNT }}
      />
      <Vocab_DUMMY {...{ view, z_vocabDisplay_SETTINGS }} />

      <ScrollView style={{ flex: 1 }}>
        <VocabPreviewToggles_BLOCK
          {...{
            view,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
            HAS_difficulties,
          }}
        />
        <VocabFrontLanguageToggles_BLOCK
          {...{
            view,
            langs,
            appLang,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
          }}
        />
        <VocabSorting_BLOCK
          {...{
            view,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
            HAS_difficulties,
          }}
        />

        <VocabSortDirection_BLOCK
          {...{
            view,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
            HAS_difficulties,
          }}
        />
        <DifficultyFilters_BLOCK
          {...{
            view,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
            HAS_difficulties,
          }}
        />
        <VocabLangFilters_BLOCK
          {...{
            view,
            langs,
            appLang,
            z_vocabDisplay_SETTINGS,
            z_SET_vocabDisplaySettings,
            HAS_difficulties,
          }}
        />
      </ScrollView>
      <Footer
        btnLeft={
          <Btn
            type="simple"
            text={t("btn.done")}
            onPress={TOGGLE_open}
            style={{ flex: 1 }}
          />
        }
      />
    </Big_MODAL>
  );
}
