import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import {
  USE_zustand,
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";
import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";

type ListsFlatlistHeader_SECTIONProps = {
  search: string;
  HAS_error: boolean;
  IS_searching: boolean;
  totalLists: number | null;
  list_NAME: string | undefined;
};

export function ListsFlatlist_HEADER({
  search,
  HAS_error = false,
  IS_searching = false,
  list_NAME = "INSERT LIST NAME",
  totalLists = 0,
}: ListsFlatlistHeader_SECTIONProps) {
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const langFilters = z_listDisplay_SETTINGS.langFilters || [];

  const handleRemoveLangFilter = useCallback(
    (lang_id: string) => {
      z_SET_listDisplaySettings({
        langFilters: langFilters.filter((l) => l !== lang_id),
      });
    },
    [z_SET_listDisplaySettings, langFilters]
  );

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
