//
//
//

import { Text, View } from "react-native";
import { Styled_TEXT } from "../components/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/Page_WRAP/Page_WRAP";
import Btn from "../components/Btn/Btn";
import { useRouter } from "expo-router";

export default function index_PAGE() {
  return (
    <Page_WRAP>
      <View
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
      </View>
    </Page_WRAP>
  );
}
