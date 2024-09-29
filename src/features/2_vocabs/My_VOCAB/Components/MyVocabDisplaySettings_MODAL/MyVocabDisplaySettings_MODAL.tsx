//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
import DisplaySettings_SUBNAV from "../../../components/DisplaySettings_SUBNAV";
import DisplaySettings_MODAL from "../../../components/DisplaySettings_MODAL/DisplaySettings_MODAL";

import MyVocabPreview_BLOCK from "./components/MyVocabPreview_BLOCK/MyVocabPreview_BLOCK";
import MyVocabFilter_BLOCK from "./components/MyVocabFilter_BLOCK/MyVocabFilter_BLOCK";
import MyVocabSorting_BLOCKS from "./components/MyVocabSorting_BLOCKS/MyVocabSorting_BLOCKS";
import MyVocabSortDirection_BLOCK from "./components/MyVocabSortDirection_BLOCK/MyVocabSortDirection_BLOCK";

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

  return (
    <DisplaySettings_MODAL {...{ open, TOGGLE_open }}>
      <DisplaySettings_SUBNAV
        activeFilters={displaySettings.difficultyFilters.length}
        {...{ view, SET_view }}
      />
      <ScrollView style={{ flex: 1 }}>
        {view === "sort" ? (
          <MyVocabSorting_BLOCKS
            {...{ displaySettings, SET_displaySettings }}
          />
        ) : view === "filter" ? (
          <MyVocabFilter_BLOCK {...{ displaySettings, SET_displaySettings }} />
        ) : view === "preview" ? (
          <MyVocabPreview_BLOCK {...{ displaySettings, SET_displaySettings }} />
        ) : (
          ""
        )}
        {view === "sort" &&
          (displaySettings.sorting === "date" ||
            displaySettings.sorting === "difficulty") && (
            <MyVocabSortDirection_BLOCK
              {...{ displaySettings, SET_displaySettings }}
            />
          )}
      </ScrollView>
    </DisplaySettings_MODAL>
  );
}
