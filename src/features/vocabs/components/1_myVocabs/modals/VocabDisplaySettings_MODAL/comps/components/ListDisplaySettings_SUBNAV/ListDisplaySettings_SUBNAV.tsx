//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Subheader from "@/src/components/1_grouped/subheader/Subheader";
import { USE_getActiveFilterCount } from "@/src/hooks";
import {
  USE_zustand,
  z_listDisplaySettings_PROPS,
} from "@/src/hooks/zustand/USE_zustand/USE_zustand";
import React from "react";
import { ScrollView } from "react-native";

export default function ListDisplaySettings_SUBNAV({
  view,
  SET_view,
}: {
  view: "sort" | "filter";
  SET_view: React.Dispatch<React.SetStateAction<"sort" | "filter">>;
}) {
  const { activeFilter_COUNT } = USE_getActiveFilterCount("lists");

  return (
    <Subheader noPadding>
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
    </Subheader>
  );
}
