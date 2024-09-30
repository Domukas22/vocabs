//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import DisplaySettings_SUBNAV from "../components/DisplaySettings_SUBNAV/DisplaySettings_SUBNAV";

import MyVocabPreview_BLOCK from "../components/VocabPreview_BLOCK/public";
import VocabFilter_BLOCK from "../components/VocabFilter_BLOCK/VocabFilter_BLOCK";
import VocabSorting_BLOCKS from "../components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "../components/VocabSortDirection_BLOCK/VocabSortDirection_BLOCK";
import Footer from "@/src/components/Footer/Footer";
import Btn from "@/src/components/Btn/Btn";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";

interface DisplaySettingsModal_PROPS {
  displaySettings: MyVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<MyVocabDisplaySettings_PROPS>
  >;
  open: boolean;
  TOGGLE_open: () => void;
}

export default function MyVocabDisplaySettings_MODAL({
  open,
  TOGGLE_open,
  displaySettings,
  SET_displaySettings,
}: DisplaySettingsModal_PROPS) {
  const [view, SET_view] = useState<"preview" | "sort" | "filter">("preview");
  const { t } = useTranslation();

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
        activeFilters={displaySettings.difficultyFilters.length}
        {...{ view, SET_view }}
      />
      <ScrollView style={{ flex: 1 }}>
        {view === "sort" ? (
          <VocabSorting_BLOCKS {...{ displaySettings, SET_displaySettings }} />
        ) : view === "filter" ? (
          <VocabFilter_BLOCK {...{ displaySettings, SET_displaySettings }} />
        ) : view === "preview" ? (
          <MyVocabPreview_BLOCK {...{ displaySettings, SET_displaySettings }} />
        ) : (
          ""
        )}
        {view === "sort" &&
          (displaySettings.sorting === "date" ||
            displaySettings.sorting === "difficulty") && (
            <VocabSortDirection_BLOCK
              {...{ displaySettings, SET_displaySettings }}
            />
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
