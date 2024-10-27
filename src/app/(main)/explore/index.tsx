//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Header from "@/src/components/Header/Header";
import ExplorePage_BTN from "@/src/components/ExplorePage_BTN";

export default function Explore_PAGE() {
  const router = useRouter();

  return (
    <Page_WRAP>
      <Header title={`Explore lists and vocabs`} big={true} />

      <View style={{ padding: 12, gap: 12 }}>
        <ExplorePage_BTN
          title="⭐ Public lists"
          description="Choose and save a list you like"
          onPress={() => router.push("/(main)/explore/public_lists")}
        />
        <ExplorePage_BTN
          title="🔤 All public vocabs"
          description="Search all public vocabs in the app"
          onPress={() => router.push("/(main)/explore/all_public_vocabs")}
        />
        <ExplorePage_BTN
          title="🔒 Shared lists"
          description="Find a list your friend created"
          onPress={() => router.push("/(main)/explore/shared_lists")}
        />
      </View>
    </Page_WRAP>
  );
}
