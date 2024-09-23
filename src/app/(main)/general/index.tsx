//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import Block from "@/src/components/Block/Block";
import {
  ICON_settings,
  ICON_arrow,
  ICON_premium,
  ICON_privacyPolicy,
  ICON_contact,
  ICON_about,
} from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { supabase } from "@/src/lib/supabase";

export default function General_PAGE() {
  const vocabCount = 89;
  const { SET_auth } = USE_auth();

  const lougout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    } else {
      SET_auth(null);
    }
  };
  return (
    <Page_WRAP>
      <Header title="General" big={true} />

      <ScrollView>
        <Block>
          <View style={{ gap: 16 }}>
            <Styled_TEXT>XX vocabs left until you reach the limit</Styled_TEXT>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Styled_TEXT
                type="text_18_bold"
                style={{
                  color: MyColors.text_primary,
                }}
              >
                {vocabCount}
              </Styled_TEXT>
              <View
                style={{
                  height: 12,
                  flex: 1,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: MyColors.border_white_005,
                  backgroundColor: MyColors.btn_3,
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${vocabCount}%`,
                    borderRadius: 50,
                    backgroundColor: MyColors.icon_primary,
                  }}
                ></View>
              </View>
              <Styled_TEXT
                type="text_18_bold"
                style={{
                  color: MyColors.text_white_06,
                }}
              >
                100
              </Styled_TEXT>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn
                text="Learn more"
                onPress={() => router.push("/(main)/general/premium")}
              />
              <Btn
                text="Get premium"
                type="action"
                style={{ flex: 1 }}
                onPress={() => {}}
              />
            </View>
          </View>
        </Block>

        <Block>
          <Btn
            iconLeft={<ICON_settings />}
            text="Settings"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/settings")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_premium />}
            text="Premium"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/premium")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_privacyPolicy />}
            text="Privacy policy"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/privacy")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_contact />}
            text="Contact us"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/contact")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
          <Btn
            iconLeft={<ICON_about />}
            text="About us"
            iconRight={<ICON_arrow direction="right" />}
            onPress={() => router.push("/(main)/general/about")}
            text_STYLES={{ flex: 1, marginLeft: 4 }}
          />
        </Block>
        <Block styles={{ gap: 12 }}>
          <Btn text="Log out" type="delete" onPress={lougout} />
        </Block>
      </ScrollView>
    </Page_WRAP>
  );
}
