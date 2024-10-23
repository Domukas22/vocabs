//
//
//

import Btn from "@/src/components/Btn/Btn";
import Subnav from "@/src/components/Subnav/Subnav";
import React from "react";
import { ScrollView } from "react-native";

export default function DisplaySettings_SUBNAV({
  view,
  activeFilter_COUNT = 0,
  SET_view,
}: {
  view: "preview" | "sort" | "filter";
  activeFilter_COUNT?: number;
  SET_view: React.Dispatch<React.SetStateAction<"preview" | "sort" | "filter">>;
}) {
  return (
    <Subnav noPadding>
      <ScrollView
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
        horizontal={true}
      >
        <Btn
          type={view === "preview" ? "difficulty_1_active" : "simple"}
          text="Vorschau"
          onPress={() => SET_view("preview")}
          style={{ marginRight: 8 }}
        />

        <Btn
          type={view === "sort" ? "difficulty_1_active" : "simple"}
          text="Sortieren"
          onPress={() => SET_view("sort")}
          style={{ marginRight: 8 }}
        />

        <Btn
          text="Filtern"
          type={view === "filter" ? "difficulty_1_active" : "simple"}
          onPress={() => SET_view("filter")}
          style={{ marginRight: 8 }}
          topRightIconCount={activeFilter_COUNT}
        />
      </ScrollView>
    </Subnav>
  );
}
