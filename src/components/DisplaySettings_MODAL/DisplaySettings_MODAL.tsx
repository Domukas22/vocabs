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

import { The4Fetch_TYPES } from "@/src/types/general_TYPES";

import { DisplaySettingsView_TYPES } from "./type";
import { Styled_TEXT } from "../1_grouped/texts/Styled_TEXT/Styled_TEXT";
import {
  DisplaySettingsModal_HEADER,
  DisplaySettingsModal_SUBNAV,
} from "./parts";
import { DisplaySettingsModal_CONTENT } from "./parts/DisplaySettingsModal_CONTENT/DisplaySettingsModal_CONTENT";

interface DisplaySettingsModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  starting_TAB: DisplaySettingsView_TYPES;
  type: The4Fetch_TYPES;
}

export function DisplaySettings_MODAL({
  open = false,
  TOGGLE_open = () => {},
  starting_TAB = "sort",
  type,
}: DisplaySettingsModal_PROPS) {
  const { t } = useTranslation();
  const [current_TAB, SET_currentTab] =
    useState<DisplaySettingsView_TYPES>(starting_TAB);

  return (
    <Big_MODAL {...{ open }}>
      <DisplaySettingsModal_HEADER TOGGLE_open={TOGGLE_open} />
      <DisplaySettingsModal_SUBNAV
        type={type}
        current_TAB={current_TAB}
        SET_currentTab={SET_currentTab}
      />
      <DisplaySettingsModal_CONTENT current_TAB={current_TAB} type={type} />

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
