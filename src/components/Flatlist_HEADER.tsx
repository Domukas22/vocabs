//
//

import { View } from "react-native";
import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";
import { MyColors } from "../constants/MyColors";

//
export default function Flatlist_HEADER({ title }: { title: string }) {
  return (
    <View>
      <Styled_TEXT
        type="text_22_bold"
        style={{ marginTop: 4, marginBottom: 16 }}
      >
        {title}
      </Styled_TEXT>
      {/* <Styled_TEXT
        type="label"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
          paddingBottom: 12,
        }}
      >
        Browse through 57 public lists
      </Styled_TEXT> */}
    </View>
  );
}
