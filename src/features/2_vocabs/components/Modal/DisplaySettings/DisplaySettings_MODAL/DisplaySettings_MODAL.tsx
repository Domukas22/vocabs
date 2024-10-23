//
//
//

import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import DisplaySettings_SUBNAV from "../components/DisplaySettings_SUBNAV/DisplaySettings_SUBNAV";

import { MyVocabPreview_BLOCKS } from "../components/VocabPreview_BLOCK/private/MyVocabPreview_BLOCKS";
import { VocabFilter_BLOCKS } from "../components/VocabFilter_BLOCKS/VocabFilter_BLOCKS";
import VocabSorting_BLOCKS from "../components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "../components/VocabSortDirection_BLOCK/VocabSortDirection_BLOCK";
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
import PreviewToggles_BLOCK from "../components/PreviewToggles_BLOCK";
import DifficultyFilters_BLOCK from "../components/DifficultyFilters_BLOCK";
import Sorting_BLOCK from "../Sorting_BLOCK";
import SortDirection_BLOCK from "../SortDirection_BLOCK";
import Label from "@/src/components/Label/Label";
import FrontLanguageToggles_BLOCK from "../components/FrontLanguageToggles_BLOCK";
import USE_langs from "@/src/features/4_languages/hooks/USE_langs";
import i18next from "i18next";
import LangFilters_BLOCK from "../components/LangFilters_BLOCK";

interface DisplaySettingsModal_PROPS {
  open: boolean;
  HAS_difficulties?: boolean;
  collectedLang_IDS: string[] | undefined;
  TOGGLE_open: () => void;
}

export type DisplaySettingsModalView_PROPS = "preview" | "sort" | "filter";

export function DisplaySettings_MODAL({
  open,
  HAS_difficulties = true,
  collectedLang_IDS = [],
  TOGGLE_open,
}: DisplaySettingsModal_PROPS) {
  const { t } = useTranslation();
  const [view, SET_view] = useState<DisplaySettingsModalView_PROPS>("preview");

  const { z_display_SETTINGS, z_SET_displaySettings } = USE_zustand();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_display_SETTINGS);
  const langs = USE_langs({ lang_ids: collectedLang_IDS });
  const appLang = useMemo(() => i18next.language, [i18next.language]);

  // TODO: Create a "display settings correction" function, which:
  // - if modal doesnt have difficulties, yet the selected sorting is by difficulty, change it to sorting "date"
  // console.log(collectedLang_IDS);

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

      <DisplaySettings_SUBNAV {...{ view, SET_view, activeFilter_COUNT }} />
      <Vocab_DUMMY {...{ view, z_display_SETTINGS }} />

      <ScrollView style={{ flex: 1 }}>
        <PreviewToggles_BLOCK
          {...{
            view,
            z_display_SETTINGS,
            z_SET_displaySettings,
            HAS_difficulties,
          }}
        />
        <FrontLanguageToggles_BLOCK
          {...{
            view,
            langs,
            appLang,
            z_display_SETTINGS,
            z_SET_displaySettings,
          }}
        />
        <Sorting_BLOCK
          {...{
            view,
            z_display_SETTINGS,
            z_SET_displaySettings,
            HAS_difficulties,
          }}
        />

        <SortDirection_BLOCK
          {...{
            view,
            z_display_SETTINGS,
            z_SET_displaySettings,
            HAS_difficulties,
          }}
        />
        <DifficultyFilters_BLOCK
          {...{
            view,
            z_display_SETTINGS,
            z_SET_displaySettings,
            HAS_difficulties,
          }}
        />
        <LangFilters_BLOCK
          {...{
            view,
            langs,
            appLang,
            z_display_SETTINGS,
            z_SET_displaySettings,
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
