//
//
//

import React, { useState } from "react";
import { ScrollView } from "react-native";
import {
  Language_MODEL,
  DisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
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
import PublicVocabPreview_BLOCKS from "../components/VocabPreview_BLOCK/public/PublicVocabPreview_BLOCKS";

interface DisplaySettingsModal_PROPS {
  displaySettings: PublicVocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<PublicVocabDisplaySettings_PROPS>
  >;
  open: boolean;
  TOGGLE_open: () => void;
  available_LANGS: Language_MODEL[];
}

export default function PublicVocabDisplaySettings_MODAL({
  open,
  displaySettings,
  available_LANGS,
  TOGGLE_open,
  SET_displaySettings,
}: DisplaySettingsModal_PROPS) {
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

      <DisplaySettings_SUBNAV {...{ view: "preview", SET_view: () => {} }} />
      <Block>
        <Vocab_DUMMY {...{ displaySettings }} HAS_difficulty={false} />
      </Block>
      <ScrollView style={{ flex: 1 }}>
        <PublicVocabPreview_BLOCKS
          available_LANGS={available_LANGS}
          {...{ displaySettings, SET_displaySettings }}
        />
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
