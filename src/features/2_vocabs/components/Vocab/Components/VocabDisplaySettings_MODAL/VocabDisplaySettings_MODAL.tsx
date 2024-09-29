//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import DisplaySettings_SUBNAV from "../../../components/DisplaySettings_SUBNAV";
import DisplaySettings_MODAL from "../../../components/DisplaySettings_MODAL/DisplaySettings_MODAL";

import VocabPreview_BLOCK from "./components/VocabPreview_BLOCK/VocabPreview_BLOCK";
import VocabFilter_BLOCK from "./components/VocabFilter_BLOCK/VocabFilter_BLOCK";
import VocabSorting_BLOCKS from "./components/VocabSorting_BLOCKS/VocabSorting_BLOCKS";
import VocabSortDirection_BLOCK from "./components/VocabSortDirection_BLOCK/VocabSortDirection_BLOCK";

interface DisplaySettingsModal_PROPS {
  displaySettings: MyVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<MyVocabDisplaySettings_PROPS>
  >;
  open: boolean;
  TOGGLE_open: () => void;
}

export default function VocabDisplaySettings_MODAL({
  open,
  TOGGLE_open,
  displaySettings,
  SET_displaySettings,
}: DisplaySettingsModal_PROPS) {
  const [view, SET_view] = useState<"preview" | "sort" | "filter">("preview");

  return (
    <DisplaySettings_MODAL {...{ open, TOGGLE_open }}>
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
          <VocabPreview_BLOCK {...{ displaySettings, SET_displaySettings }} />
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
    </DisplaySettings_MODAL>
  );
}
