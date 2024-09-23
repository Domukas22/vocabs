//
//
//

import { ActivityIndicator, Alert, View } from "react-native";
import { Styled_TEXT } from "../components/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/Page_WRAP/Page_WRAP";
import { MyColors } from "../constants/MyColors";
import Block from "../components/Block/Block";
import StyledText_INPUT from "../components/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import Label from "../components/Label/Label";
import Btn from "../components/Btn/Btn";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Register_PAGE() {
  const [email, SET_email] = useState("");
  const [password, SET_password] = useState("");
  const [loading, SET_loading] = useState(false);
  const router = useRouter();

  const createAccount = async () => {
    if (!email || !password) return;
    SET_loading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          is_premium: false,
        },
      },
    });
    SET_loading(false);

    if (error) {
      Alert.alert("Sign up error", error.message);
    }
  };

  return (
    <Page_WRAP>
      <View
        style={{
          alignItems: "center",
          paddingVertical: 32,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <Styled_TEXT type="text_22_bold">
          Create your Vocabs account!
        </Styled_TEXT>
      </View>
      <Block noBorder>
        <Label labelText="What is your E-Mail?" />
        <StyledText_INPUT
          value={email}
          SET_value={SET_email}
          placeholder="email@gmail.com..."
        />
      </Block>
      <Block noBorder>
        <Label labelText="Create a password" />
        <StyledText_INPUT
          value={password}
          SET_value={SET_password}
          placeholder="myPassword..."
        />
      </Block>
      <Block styles={{ marginTop: 8 }}>
        <Btn
          text={!loading ? "Create accounttt" : ""}
          iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
          type="action"
          onPress={createAccount}
        />
      </Block>
      <Block>
        <Styled_TEXT type="text_18_regular">
          Already have an account?
        </Styled_TEXT>
        <Btn text="Log in" onPress={() => router.push("/login")} />
      </Block>
    </Page_WRAP>
  );
}
