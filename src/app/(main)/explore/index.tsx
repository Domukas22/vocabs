//
//
//

import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";

export default function Explore_PAGE() {
  const router = useRouter();

  return (
    <>
      <Header title={`Explore lists and vocabs`} big={true} />

      <View style={{ padding: 12, gap: 12 }}>
        <BigPage_BTN
          title="⭐ Public lists"
          description="Choose and save a list you like"
          onPress={() => router.push("/(main)/explore/public_lists")}
        />
        <BigPage_BTN
          title="🔤 All public vocabs"
          description="Search all public vocabs in the app"
          onPress={() => router.push("/(main)/explore/all_public_vocabs")}
        />
        <BigPage_BTN
          title="🔒 Shared lists"
          description="Find a list your friend created"
          onPress={() => router.push("/(main)/explore/shared_lists")}
        />
      </View>
    </>
  );
}
