//
//
//

import { View, StyleSheet } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { USE_zustand } from "@/src/hooks/zustand/USE_zustand/USE_zustand";
import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";
import { useCallback, useMemo } from "react";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { t } from "i18next";

type ListFlashlist_HEADER_PROPS = {
  debouncedSearch: string;
  search: string;
  IS_debouncing: boolean;
  unpaginated_COUNT: number | null;
  loading_STATE: loadingState_TYPES;
  list_NAME: string | undefined;
  HAS_error: boolean;
};

export function ListFlashlist_HEADER({
  search,
  debouncedSearch,
  IS_debouncing,
  loading_STATE = "none",
  list_NAME = "No list found",
  unpaginated_COUNT = 0,
  HAS_error = false,
}: ListFlashlist_HEADER_PROPS) {
  const { lang_FILTERS, REMOVE_listLangfilter } = USE_listLangFilters();

  return (
    <View style={styles.headerContainer}>
      <View>
        <Styled_TEXT type="text_20_bold">{list_NAME}</Styled_TEXT>
        <Flashlist_LABEL
          target="lists"
          totalResult_COUNT={unpaginated_COUNT || 0}
          appliedFiltersCount={lang_FILTERS.length}
          {...{
            debouncedSearch,
            IS_debouncing,
            search,
            HAS_error,
            loading_STATE,
          }}
        />
      </View>

      {lang_FILTERS.length > 0 && (
        <View style={styles.filtersContainer}>
          {lang_FILTERS.map((lang_id) => (
            <Btn
              key={lang_id + "langFilter"}
              iconLeft={<ICON_flag lang={lang_id} />}
              text={lang_id.toUpperCase()}
              iconRight={<ICON_X color="primary" rotate={true} />}
              type="active"
              tiny={true}
              onPress={() => REMOVE_listLangfilter(lang_id)}
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

function USE_listLangFilters() {
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const lang_FILTERS = useMemo(
    () => z_listDisplay_SETTINGS.langFilters || [],
    [z_listDisplay_SETTINGS.langFilters]
  );

  const REMOVE_listLangfilter = useCallback(
    (lang_id: string) => {
      z_SET_listDisplaySettings({
        langFilters: lang_FILTERS.filter((l) => l !== lang_id),
      });
    },
    [z_listDisplay_SETTINGS, lang_FILTERS]
  );

  return { REMOVE_listLangfilter, lang_FILTERS };
}
