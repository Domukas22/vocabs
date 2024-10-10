//
//
//

import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import {
  Language_MODEL,
  DisplaySettings_PROPS,
  Vocab_MODEL,
} from "@/src/db/props";
import DisplaySettings_SUBNAV from "../components/DisplaySettings_SUBNAV/DisplaySettings_SUBNAV";

import MyVocabPreview_BLOCKS from "../components/VocabPreview_BLOCK/private/MyVocabPreview_BLOCKS";
import VocabFilter_BLOCKS from "../components/VocabFilter_BLOCKS/VocabFilter_BLOCKS";
import VocabSorting_BLOCKS from "../components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "../components/VocabSortDirection_BLOCK/VocabSortDirection_BLOCK";
import Footer from "@/src/components/Footer/Footer";
import Btn from "@/src/components/Btn/Btn";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import SelectOneLanguage_MODAL from "@/src/features/4_languages/components/SelectOneLanguage_MODAL/SelectOneLanguage_MODAL";
import languages, { languagesArr_PROPS } from "@/src/constants/languages";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import Vocab_DUMMY from "../../../Vocab/Components/Vocab_DUMMY";
import Block from "@/src/components/Block/Block";
import GET_uniqueLanguagesInAList from "@/src/features/4_languages/utils/GET_uniqueLanguagesInAList/GET_uniqueLanguagesInAList";
import USE_zustand from "@/src/zustand";

interface DisplaySettingsModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  vocabs?: Vocab_MODEL[];
}

export default function MyVocabDisplaySettings_MODAL({
  open,
  TOGGLE_open,

  vocabs,
}: DisplaySettingsModal_PROPS) {
  const [view, SET_view] = useState<"preview" | "sort" | "filter">("preview");
  const { t } = useTranslation();
  const [SHOW_frontLangModal, TOGGLE_frontLangModal] = USE_toggle();
  const { languages } = USE_langs();
  const { z_display_SETTINGS, z_SET_displaySettings } = USE_zustand();

  const list_LANGS = useMemo(
    () => GET_uniqueLanguagesInAList(vocabs || [], languages),
    [vocabs]
  );

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

      <DisplaySettings_SUBNAV
        activeFilters={
          z_display_SETTINGS.difficultyFilters.length +
          z_display_SETTINGS.langFilters.length
        }
        {...{ view, SET_view }}
      />
      {view === "preview" && (
        <Block>
          <Vocab_DUMMY />
        </Block>
      )}
      <ScrollView style={{ flex: 1 }}>
        {view === "sort" ? (
          <VocabSorting_BLOCKS />
        ) : view === "filter" ? (
          <VocabFilter_BLOCKS {...{ list_LANGS }} />
        ) : view === "preview" ? (
          <MyVocabPreview_BLOCKS {...{ list_LANGS }} />
        ) : (
          ""
        )}
        {view === "sort" &&
          (z_display_SETTINGS.sorting === "date" ||
            z_display_SETTINGS.sorting === "difficulty") && (
            <VocabSortDirection_BLOCK />
          )}
      </ScrollView>
      <Footer
        btnLeft={
          <Btn
            type="simple"
            text={t("btn.done")}
            onPress={TOGGLE_open}
            style={{ flex: 1 }}
            // text_STYLES={{ color: MyColors.text_white }}
          />
        }
      />
      <SelectOneLanguage_MODAL
        open={SHOW_frontLangModal}
        TOGGLE_open={TOGGLE_frontLangModal}
        SELECT_lang={(lang_ID: string) => {
          z_SET_displaySettings({ frontTrLang_ID: lang_ID });
        }}
        chosenLang_ID={z_display_SETTINGS.frontTrLang_ID}
        // {...{ list_LANGS }}
        {...{
          list_LANGS,
        }}
      />
    </Big_MODAL>
  );
}
