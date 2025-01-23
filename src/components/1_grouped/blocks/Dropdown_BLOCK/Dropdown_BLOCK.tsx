//
//
//

import { View } from "react-native";
import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_dropdownArrow,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import React from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

export default function Dropdown_BLOCK({
  toggleBtn_TEXT = "INSERT TOGGLE BTN TEXT",
  label,
  children,
}: {
  toggleBtn_TEXT: string;
  label?: string;
  children: React.ReactNode;
}) {
  const [open, toggle] = USE_toggle();

  return (
    <Block>
      {label && <Label>{label}</Label>}
      <Btn
        text={toggleBtn_TEXT}
        type={open ? "seethrough" : "simple"}
        iconRight={
          open ? <ICON_X rotate={true} big={true} /> : <ICON_dropdownArrow />
        }
        text_STYLES={{ flex: 1 }}
        onPress={toggle}
      />
      {open && <View style={{ marginTop: 8, gap: 8 }}>{children}</View>}
    </Block>
  );
}
