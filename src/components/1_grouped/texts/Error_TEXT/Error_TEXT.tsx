//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export default function Error_TEXT({ text }: { text: string | undefined }) {
  return (
    <View>
      <Styled_TEXT style={{ color: MyColors.text_red }}>{text}</Styled_TEXT>
    </View>
  );
}
