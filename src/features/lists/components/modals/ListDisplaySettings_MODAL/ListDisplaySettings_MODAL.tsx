//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";

import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { useTranslation } from "react-i18next";

import ListDisplaySettings_SUBNAV from "@/src/features/vocabs/components/1_myVocabs/modals/VocabDisplaySettings_MODAL/comps/components/ListDisplaySettings_SUBNAV/ListDisplaySettings_SUBNAV";
import ListLangFilters_BLOCK from "@/src/features/vocabs/components/1_myVocabs/modals/VocabDisplaySettings_MODAL/comps/components/ListLangFilters_BLOCK";
import ListSortDirection_BLOCK from "@/src/features/vocabs/components/1_myVocabs/modals/VocabDisplaySettings_MODAL/comps/ListSortDirection_BLOCK";
import ListSorting_BLOCK from "@/src/features/vocabs/components/1_myVocabs/modals/VocabDisplaySettings_MODAL/comps/ListSorting_BLOCK";

interface ListDisplaySettingsModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
}

export type ListDisplaySettingsModalView_PROPS = "sort" | "filter";

export function ListDisplaySettings_MODAL({
  open,
  TOGGLE_open,
}: ListDisplaySettingsModal_PROPS) {
  const { t } = useTranslation();
  const [view, SET_view] =
    useState<ListDisplaySettingsModalView_PROPS>("filter");

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

      <ListDisplaySettings_SUBNAV {...{ view, SET_view }} />

      <ScrollView style={{ flex: 1, width: "100%" }}>
        {view === "filter" ? (
          <ListLangFilters_BLOCK />
        ) : (
          <>
            <ListSorting_BLOCK />
            <ListSortDirection_BLOCK />
          </>
        )}
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
