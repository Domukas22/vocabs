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

type VocabFlashlist_HEADER_PROPS = {
  debouncedSearch: string;
  search: string;
  IS_debouncing: boolean;
  unpaginated_COUNT: number | null;
  loading_STATE: loadingState_TYPES;
  list_NAME: string | undefined;
  HAS_error: boolean;
};

export function VocabFlashlist_HEADER({
  search,
  debouncedSearch,
  IS_debouncing,
  loading_STATE = "none",
  list_NAME = "No list found",
  unpaginated_COUNT = 0,
  HAS_error = false,
}: VocabFlashlist_HEADER_PROPS) {
  const { difficulty_FILTERS, REMOVE_vocabDifficultyfilter } =
    USE_difficultyFilters();
  const { lang_FILTERS, REMOVE_vocabLangfilter } = USE_vocabLangFilters();

  return (
    <View style={styles.headerContainer}>
      <View>
        <Styled_TEXT type="text_20_bold">{list_NAME}</Styled_TEXT>
        <Flashlist_LABEL
          target="vocabs"
          totalResult_COUNT={unpaginated_COUNT || 0}
          appliedFiltersCount={lang_FILTERS.length + difficulty_FILTERS.length}
          {...{
            debouncedSearch,
            IS_debouncing,
            search,
            HAS_error,
            loading_STATE,
          }}
        />
      </View>

      {(difficulty_FILTERS.length > 0 || lang_FILTERS.length > 0) && (
        <View style={styles.filtersContainer}>
          {difficulty_FILTERS?.map((diff) => (
            <Btn
              key={diff + "diffFilter"}
              iconLeft={<ICON_difficultyDot difficulty={diff} />}
              text={"Difficulty: " + diff}
              iconRight={
                <ICON_X
                  color={
                    diff === 1
                      ? "difficulty_1"
                      : diff === 2
                      ? "difficulty_2"
                      : "difficulty_3"
                  }
                  rotate={true}
                />
              }
              type={
                diff === 1
                  ? "difficulty_1_active"
                  : diff === 2
                  ? "difficulty_2_active"
                  : "difficulty_3_active"
              }
              tiny={true}
              onPress={() => REMOVE_vocabDifficultyfilter(diff)}
            />
          ))}
          {lang_FILTERS.map((lang_id) => (
            <Btn
              key={lang_id + "langFilter"}
              iconLeft={<ICON_flag lang={lang_id} />}
              text={lang_id.toUpperCase()}
              iconRight={<ICON_X color="primary" rotate={true} />}
              type="active"
              tiny={true}
              onPress={() => REMOVE_vocabLangfilter(lang_id)}
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

function USE_vocabLangFilters() {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();

  const lang_FILTERS = useMemo(
    () => z_vocabDisplay_SETTINGS.langFilters || [],
    [z_vocabDisplay_SETTINGS.langFilters]
  );

  const REMOVE_vocabLangfilter = useCallback(
    (lang_id: string) => {
      z_SET_vocabDisplaySettings({
        langFilters: lang_FILTERS.filter((l) => l !== lang_id),
      });
    },
    [z_SET_vocabDisplaySettings, lang_FILTERS]
  );

  return { REMOVE_vocabLangfilter, lang_FILTERS };
}
function USE_difficultyFilters() {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();

  const difficulty_FILTERS = useMemo(
    () => z_vocabDisplay_SETTINGS.difficultyFilters || [],
    [z_vocabDisplay_SETTINGS.difficultyFilters]
  );

  const REMOVE_vocabDifficultyfilter = useCallback(
    (diffifulty: 1 | 2 | 3) => {
      z_SET_vocabDisplaySettings({
        difficultyFilters: difficulty_FILTERS.filter((x) => x !== diffifulty),
      });
    },
    [z_SET_vocabDisplaySettings, difficulty_FILTERS]
  );

  return { REMOVE_vocabDifficultyfilter, difficulty_FILTERS };
}
