//
//
//

import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";

import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { useTranslation } from "react-i18next";

import { USE_zustand } from "@/src/hooks";
import { USE_getActiveFilterCount } from "@/src/hooks";

import i18next from "i18next";

import { USE_langs_2 } from "@/src/features/languages/functions";
import { Vocab_DUMMY } from "../../vocabCards/Vocab_DUMMY/Vocab_DUMMY";
import DifficultyFilters_BLOCK from "./comps/components/DifficultyFilters_BLOCK";
import VocabDisplaySettings_SUBNAV from "./comps/components/VocabDisplaySettings_SUBNAV/VocabDisplaySettings_SUBNAV";
import VocabFrontLanguageToggles_BLOCK from "./comps/components/VocabFrontLanguageToggles_BLOCK";
import VocabLangFilters_BLOCK from "./comps/components/VocabLangFilters_BLOCK";
import VocabPreviewToggles_BLOCK from "./comps/components/VocabPreviewToggles_BLOCK";
import VocabSortDirection_BLOCK from "./comps/VocabSortDirection_BLOCK";
import VocabSorting_BLOCK from "./comps/VocabSorting_BLOCK";

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
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");
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

      <ScrollView style={{ flex: 1, width: "100%" }}>
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
      <TwoBtn_BLOCK
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
