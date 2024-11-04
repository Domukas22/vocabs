import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import {
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";
import Flashlist_LABEL from "@/src/components/Flashlist_LABEL";

type ListsFlatlistHeader_SECTIONProps = {
  search: string;
  HAS_error: boolean;
  IS_searching: boolean;
  totalLists: number | null;
  list_NAME: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS;
};
export default function ListsFlatlistHeader_SECTION({
  search,
  HAS_error = false,
  IS_searching = false,
  list_NAME = "INSERT LIST NAME",
  totalLists = 0,
  z_listDisplay_SETTINGS,
  z_SET_listDisplaySettings,
}: ListsFlatlistHeader_SECTIONProps) {
  const langFilters = z_listDisplay_SETTINGS.langFilters || [];

  const handleRemoveLangFilter = (lang_id: string) => {
    z_SET_listDisplaySettings({
      langFilters: langFilters.filter((l) => l !== lang_id),
    });
  };

  const appliedFiltersCount = langFilters.length;

  return (
    <View style={styles.headerContainer}>
      <Styled_TEXT type="text_22_bold">{list_NAME}</Styled_TEXT>
      <Flashlist_LABEL
        {...{ IS_searching, search, appliedFiltersCount, HAS_error }}
        totalResult_COUNT={totalLists || 0}
        target="lists"
      />

      {appliedFiltersCount > 0 && (
        <View style={styles.filtersContainer}>
          {langFilters.map((lang_id) => (
            <Btn
              key={lang_id + "langFilter"}
              iconLeft={<ICON_flag lang={lang_id} />}
              text={lang_id.toUpperCase()}
              iconRight={<ICON_X color="primary" rotate={true} />}
              type="active"
              tiny={true}
              onPress={() => handleRemoveLangFilter(lang_id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    paddingTop: 12,
  },
});
