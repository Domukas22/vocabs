//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

export default function Error_TEXT({ children }: { children: string }) {
  return (
    <View>
      {/* <ICON_arrow direction="right" /> */}
      <Styled_TEXT style={{ color: MyColors.text_red }}>{children}</Styled_TEXT>
    </View>
  );
}
