//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import {
  ICON_X,
  ICON_difficultyDot,
  ICON_calendar,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import { ScrollView, View } from "react-native";

import DisplaySettings_SUBNAV from "../DisplaySettings_SUBNAV";
import React from "react";
import Header from "@/src/components/Header/Header";

export default function DisplaySettings_MODAL({
  open,
  TOGGLE_open,
  children,
}: {
  open: boolean;
  TOGGLE_open: () => void;
  children: React.ReactNode;
}) {
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

      {children}
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
