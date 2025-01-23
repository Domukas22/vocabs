//
//
//

import { ActivityIndicator, View } from "react-native";
import { Styled_TEXT } from "../components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/1_grouped/Page_WRAP/Page_WRAP";
import { MyColors } from "../constants/MyColors";

export default function index_PAGE() {
  return (
    <>
      {/* <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          paddingBottom: 70,
        }}
      >
        <Styled_TEXT style={{ fontSize: 40, fontFamily: "Nunito-Bold" }}>
          Vocabs
        </Styled_TEXT>
      </View> */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: MyColors.fill_bg,
        }}
      >
        <ActivityIndicator color={"grey"} size={"large"} />
        <Styled_TEXT
          type="text_20_bold"
          style={{ marginTop: 8, marginBottom: 80, marginLeft: 4 }}
        >
          Loading...
        </Styled_TEXT>
      </View>
    </>
  );
}
