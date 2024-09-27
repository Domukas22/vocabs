//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import {
  MyVocabDisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
} from "@/src/db/models";
import DisplaySettings_SUBNAV from "../../../components/DisplaySettings_SUBNAV";
import DisplaySettings_MODAL from "../../../components/DisplaySettings_MODAL/DisplaySettings_MODAL";

import PublicVocabPreview_BLOCK from "./components/PublicVocabPreview_BLOCK/PublicVocabPreview_BLOCK";

interface DisplaySettingsModal_PROPS {
  displaySettings: PublicVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<PublicVocabDisplaySettings_PROPS>
  >;
  open: boolean;
  TOGGLE_open: () => void;
}

export default function PublicVocabDisplaySettings_MODAL({
  open,
  displaySettings,
  TOGGLE_open,
  SET_displaySettings,
}: DisplaySettingsModal_PROPS) {
  const [view, SET_view] = useState<"preview" | "sort" | "filter">("preview");

  return (
    <DisplaySettings_MODAL {...{ open, TOGGLE_open }}>
      <DisplaySettings_SUBNAV {...{ view, SET_view }} toShow={["preview"]} />
      <ScrollView style={{ flex: 1 }}>
        {view === "preview" && (
          <PublicVocabPreview_BLOCK
            {...{ displaySettings, SET_displaySettings }}
          />
        )}
      </ScrollView>
    </DisplaySettings_MODAL>
  );
}
