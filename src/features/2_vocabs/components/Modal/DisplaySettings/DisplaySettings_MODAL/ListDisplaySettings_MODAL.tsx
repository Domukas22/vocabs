//
//
//

import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import VocabDisplaySettings_SUBNAV from "../components/VocabDisplaySettings_SUBNAV/VocabDisplaySettings_SUBNAV";

import VocabSorting_BLOCKS from "../components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "../VocabSortDirection_BLOCK";
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

import Label from "@/src/components/Label/Label";
import VocabFrontLanguageToggles_BLOCK from "../components/VocabFrontLanguageToggles_BLOCK";
import i18next from "i18next";
import VocabLangFilters_BLOCK from "../components/VocabLangFilters_BLOCK";
import USE_langs_2 from "@/src/features/4_languages/hooks/USE_langs_2";
import ListDisplaySettings_SUBNAV from "../components/ListDisplaySettings_SUBNAV/ListDisplaySettings_SUBNAV";
import ListSorting_BLOCK from "../ListSorting_BLOCK";
import ListSortDirection_BLOCK from "../ListSortDirection_BLOCK";
import ListLangFilters_BLOCK from "../components/ListLangFilters_BLOCK";

interface ListDisplaySettingsModal_PROPS {
  open: boolean;
  collectedLang_IDS: string[] | undefined;
  TOGGLE_open: () => void;
}

export type ListDisplaySettingsModalView_PROPS = "sort" | "filter";

export default function ListDisplaySettings_MODAL({
  open,
  collectedLang_IDS = [],
  TOGGLE_open,
}: ListDisplaySettingsModal_PROPS) {
  const { t } = useTranslation();
  const [view, SET_view] =
    useState<ListDisplaySettingsModalView_PROPS>("filter");

  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);
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

      <ListDisplaySettings_SUBNAV {...{ view, SET_view, activeFilter_COUNT }} />
      <ScrollView style={{ flex: 1 }}>
        <ListSorting_BLOCK
          {...{
            view,
            z_listDisplay_SETTINGS,
            z_SET_listDisplaySettings,
          }}
        />
        <ListSortDirection_BLOCK
          {...{
            view,
            z_listDisplay_SETTINGS,
            z_SET_listDisplaySettings,
          }}
        />

        <ListLangFilters_BLOCK
          {...{
            view,
            langs,
            appLang,
            z_listDisplay_SETTINGS,
            z_SET_listDisplaySettings,
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
