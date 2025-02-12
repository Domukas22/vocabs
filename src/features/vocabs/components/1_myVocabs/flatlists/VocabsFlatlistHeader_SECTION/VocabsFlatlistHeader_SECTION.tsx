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
import { USE_zustand } from "@/src/hooks/USE_zustand/USE_zustand";
import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";
import { useCallback } from "react";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

type VocabsFlatlistHeader_SECTIONProps = {
  debouncedSearch: string;
  search: string;
  IS_debouncing: boolean;
  unpaginated_COUNT: number | null;
  loading_STATE: loadingState_TYPES;
  list_NAME: string | undefined;
};

export function VocabsFlatlistHeader_SECTION({
  search,
  debouncedSearch,
  IS_debouncing,
  loading_STATE = "none",
  list_NAME = "INSERT LIST NAME",
  unpaginated_COUNT = 0,
}: VocabsFlatlistHeader_SECTIONProps) {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const difficultyFilters = z_vocabDisplay_SETTINGS.difficultyFilters || [];
  const langFilters = z_vocabDisplay_SETTINGS.langFilters || [];

  const handleRemoveDifficultyFilter = useCallback(
    (diff: number) => {
      z_SET_vocabDisplaySettings({
        difficultyFilters: difficultyFilters.filter((d) => d !== diff),
      });
    },
    [z_SET_vocabDisplaySettings]
  );

  const handleRemoveLangFilter = useCallback(
    (lang_id: string) => {
      z_SET_vocabDisplaySettings({
        langFilters: langFilters.filter((l) => l !== lang_id),
      });
    },
    [z_SET_vocabDisplaySettings]
  );

  const appliedFiltersCount = difficultyFilters.length + langFilters.length;

  return (
    <View style={styles.headerContainer}>
      <View>
        <Styled_TEXT type="text_20_bold">{list_NAME}</Styled_TEXT>

        <Flashlist_LABEL
          {...{
            loading_STATE,
            debouncedSearch,
            appliedFiltersCount,
            IS_debouncing,
            search,
          }}
          totalResult_COUNT={unpaginated_COUNT || 0}
          target="vocabs"
        />
      </View>

      {appliedFiltersCount > 0 && (
        <View style={styles.filtersContainer}>
          {difficultyFilters.map((diff) => (
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
              onPress={() => handleRemoveDifficultyFilter(diff)}
            />
          ))}
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
