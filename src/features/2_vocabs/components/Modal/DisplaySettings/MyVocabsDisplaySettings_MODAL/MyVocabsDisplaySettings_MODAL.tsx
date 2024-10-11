//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";

import DisplaySettings_SUBNAV from "../components/DisplaySettings_SUBNAV/DisplaySettings_SUBNAV";

import { MyVocabPreview_BLOCKS } from "../components/VocabPreview_BLOCK/private/MyVocabPreview_BLOCKS";
import { VocabFilter_BLOCKS } from "../components/VocabFilter_BLOCKS/VocabFilter_BLOCKS";
import VocabSorting_BLOCKS from "../components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "../components/VocabSortDirection_BLOCK/VocabSortDirection_BLOCK";
import Footer from "@/src/components/Footer/Footer";
import Btn from "@/src/components/Btn/Btn";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";

import Vocab_DUMMY from "../../../Vocab/Components/Vocab_DUMMY";
import Block from "@/src/components/Block/Block";
import USE_zustand from "@/src/zustand";

interface DisplaySettingsModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  list_id?: string;
}

export function MyVocabDisplaySettings_MODAL({
  open,
  TOGGLE_open,
  list_id,
}: DisplaySettingsModal_PROPS) {
  const [view, SET_view] = useState<"preview" | "sort" | "filter">("preview");
  const { t } = useTranslation();
  const { z_display_SETTINGS } = USE_zustand();

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
        ) : view === "preview" ? (
          <MyVocabPreview_BLOCKS {...{ list_id }} />
        ) : view === "filter" ? (
          <VocabFilter_BLOCKS {...{ list_id }} />
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
    </Big_MODAL>
  );
}
