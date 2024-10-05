//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { VocabDisplaySettings_PROPS } from "@/src/db/models";
import DisplaySettings_SUBNAV from "../components/DisplaySettings_SUBNAV/DisplaySettings_SUBNAV";
import PublicVocabPreview_BLOCK from "../components/VocabPreview_BLOCK/public";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Header from "@/src/components/Header/Header";
import { useTranslation } from "react-i18next";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import VocabFrontLang_BLOCK from "../components/VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";

interface DisplaySettingsModal_PROPS {
  displaySettings: VocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<VocabDisplaySettings_PROPS>
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
      <DisplaySettings_SUBNAV {...{ view, SET_view }} toShow={["preview"]} />
      <ScrollView style={{ flex: 1 }}>
        {view === "preview" && (
          <PublicVocabPreview_BLOCK
            {...{ displaySettings, SET_displaySettings }}
          />
        )}
        {/* {view === "preview" && (
          <VocabFrontLang_BLOCK  {...{ displaySettings, SET_displaySettings }}/>
        )} */}
      </ScrollView>
    </Big_MODAL>
  );
}
