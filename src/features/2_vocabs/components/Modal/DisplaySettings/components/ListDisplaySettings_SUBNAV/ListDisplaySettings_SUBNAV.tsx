//
//
//

import Btn from "@/src/components/Btn/Btn";
import Subnav from "@/src/components/Subnav/Subnav";
import React from "react";
import { ScrollView } from "react-native";

export default function ListDisplaySettings_SUBNAV({
  view,
  activeFilter_COUNT = 0,
  SET_view,
}: {
  view: "sort" | "filter";
  activeFilter_COUNT?: number;
  SET_view: React.Dispatch<React.SetStateAction<"sort" | "filter">>;
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
          text="Filtern"
          type={view === "filter" ? "difficulty_1_active" : "simple"}
          onPress={() => SET_view("filter")}
          style={{ marginRight: 8 }}
          topRightIconCount={activeFilter_COUNT}
        />
        <Btn
          type={view === "sort" ? "difficulty_1_active" : "simple"}
          text="Sortieren"
          onPress={() => SET_view("sort")}
          style={{ marginRight: 8 }}
        />
      </ScrollView>
    </Subnav>
  );
}
