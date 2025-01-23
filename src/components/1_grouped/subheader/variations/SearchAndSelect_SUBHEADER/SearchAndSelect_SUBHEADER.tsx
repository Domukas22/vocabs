//
//
//

import { View } from "react-native";
import SearchBar from "@/src/components/1_grouped/inputs/SearchBar/SearchBar";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Subheader from "../../Subheader";
import { useTranslation } from "react-i18next";
import React from "react";

interface SearchAndSelectSubnav_PROPS {
  view: "all" | "selected";
  search: string;
  selected_COUNT: number;
  SET_search: React.Dispatch<React.SetStateAction<string>>;
  SET_view: React.Dispatch<React.SetStateAction<"all" | "selected">>;
}

export default function SearchAndSelect_SUBHEADER({
  view = "all",
  search = "",
  selected_COUNT = 0,
  SET_search = () => {},
  SET_view = () => {},
}: SearchAndSelectSubnav_PROPS) {
  const { t } = useTranslation();
  return (
    <Subheader>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        text={t("btn.all")}
        style={{ borderRadius: 50, height: 44 }}
        type={view === "all" ? "difficulty_1_active" : "simple"}
        onPress={() => SET_view("all")}
      />
      <Btn
        iconLeft={
          <View>
            <Styled_TEXT>{selected_COUNT}</Styled_TEXT>
          </View>
        }
        style={{ borderRadius: 50, paddingHorizontal: 20, height: 44 }}
        text_STYLES={{
          height: 44,
          paddingVertical: 0,
          paddingBottom: 0,
          paddingTop: 0,
        }}
        type={view === "selected" ? "difficulty_1_active" : "simple"}
        onPress={() => SET_view("selected")}
      />
    </Subheader>
  );
}
