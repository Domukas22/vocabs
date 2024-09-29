//
//
//

import { View } from "react-native";
import Block from "../Block/Block";
import Btn from "../Btn/Btn";
import { ICON_dropdownArrow, ICON_X } from "../icons/icons";
import React from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";

export default function Dropdown_BLOCK({
  toggleBtn_TEXT = "INSERT TOGGLE BTN TEXT",
  children,
}: {
  toggleBtn_TEXT: string;
  children: React.ReactNode;
}) {
  const [open, toggle] = USE_toggle();

  return (
    <Block>
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
