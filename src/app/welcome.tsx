//
//
//
//

import { View } from "react-native";
import Page_WRAP from "../components/Compound/Page_WRAP/Page_WRAP";
import { Styled_TEXT } from "../components/Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "../constants/MyColors";
import Btn from "../components/Basic/Btn/Btn";
import { useRouter } from "expo-router";

export default function Welcome_PAGE() {
  const router = useRouter();

  return (
    <Page_WRAP>
      <View
        style={{
          alignItems: "center",
          paddingVertical: 64,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <Styled_TEXT type="text_28_bold">👋</Styled_TEXT>
        <Styled_TEXT type="text_28_bold">Hellooo there!</Styled_TEXT>
        <Styled_TEXT>Great to see you in the Vocabs app.</Styled_TEXT>
      </View>
      <View
        style={{
          alignItems: "center",
          paddingVertical: 32,
          gap: 12,
        }}
      >
        <Btn
          text="Create an account"
          type="action"
          onPress={() => router.push("/register")}
        />
        <Btn text="Log in" onPress={() => router.push("/login")} />
      </View>
    </Page_WRAP>
  );
}
