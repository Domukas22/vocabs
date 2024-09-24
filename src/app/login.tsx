//
//
//

import { ActivityIndicator, Alert, View } from "react-native";
import { Styled_TEXT } from "../components/Basic/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/Compound/Page_WRAP/Page_WRAP";
import { MyColors } from "../constants/MyColors";
import Block from "../components/Basic/Block/Block";
import StyledText_INPUT from "../components/Basic/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import Label from "../components/Basic/Label/Label";
import Btn from "../components/Basic/Btn/Btn";
import { Link, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Login_PAGE() {
  const [email, SET_email] = useState("");
  const [password, SET_password] = useState("");
  const [loading, SET_loading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!email || !password) return;
    SET_loading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    SET_loading(false);

    if (error) {
      Alert.alert("Log in errro", error.message);
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
        <Styled_TEXT type="text_22_bold">Log in to Vocabs!</Styled_TEXT>
      </View>
      <Block noBorder>
        <Label labelText="Enter your account E-Mail" />
        <StyledText_INPUT
          value={email}
          SET_value={SET_email}
          placeholder="email@gmail.com..."
        />
      </Block>
      <Block noBorder>
        <Label labelText="Enter your password" />
        <StyledText_INPUT
          value={password}
          SET_value={SET_password}
          placeholder="myPassword..."
        />
        <Link
          href={"/"}
          style={{
            display: "flex",
          }}
        >
          <Styled_TEXT
            type="text_18_regular"
            style={{
              color: MyColors.text_primary,
              textAlign: "right",
              width: "100%",
            }}
          >
            I forgot my password
          </Styled_TEXT>
        </Link>
      </Block>
      <Block styles={{ marginTop: 8 }}>
        <Btn
          text={!loading ? "Log in" : ""}
          iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
          type="action"
          onPress={login}
        />
      </Block>
      <Block>
        <Styled_TEXT type="text_18_regular">
          Don't have an account yet?
        </Styled_TEXT>
        <Btn
          text="Create an account"
          onPress={() => router.push("/register")}
        />
      </Block>
    </Page_WRAP>
  );
}
