import React from "react";
import { View, StyleSheet } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_difficultyDot,
  ICON_flag,
  ICON_X,
} from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import {
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";

type VocabsFlatlistHeader_SECTIONProps = {
  search: string;
  totalVocabs: number | null;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS;
};

export default function VocabsFlatlistHeader_SECTION({
  search,
  totalVocabs = 0,
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: VocabsFlatlistHeader_SECTIONProps) {
  const difficultyFilters = z_vocabDisplay_SETTINGS.difficultyFilters || [];
  const langFilters = z_vocabDisplay_SETTINGS.langFilters || [];

  const handleRemoveDifficultyFilter = (diff: number) => {
    z_SET_vocabDisplaySettings({
      difficultyFilters: difficultyFilters.filter((d) => d !== diff),
    });
  };

  const handleRemoveLangFilter = (lang_id: string) => {
    z_SET_vocabDisplaySettings({
      langFilters: langFilters.filter((l) => l !== lang_id),
    });
  };

  const appliedFiltersCount = difficultyFilters.length + langFilters.length;

  return (
    <View style={styles.headerContainer}>
      <Styled_TEXT type="label">
        {search !== "" ? (
          <>
            Search results for
            <Styled_TEXT type="text_18_medium"> '{search}' </Styled_TEXT>
          </>
        ) : appliedFiltersCount > 0 ? (
          `${appliedFiltersCount} filters applied`
        ) : (
          `Browse through ${totalVocabs ? totalVocabs : 0} vocabs`
        )}
      </Styled_TEXT>

      {appliedFiltersCount > 0 && (
        <View style={styles.filtersContainer}>
          {difficultyFilters.map((diff) => (
            <Btn
              key={diff + "diffFilter"}
              iconLeft={<ICON_difficultyDot difficulty={diff} />}
              text={"Difficulty: " + diff}
              iconRight={<ICON_X color="primary" rotate={true} />}
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
