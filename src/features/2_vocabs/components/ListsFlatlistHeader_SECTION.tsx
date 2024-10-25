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
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
  z_vocabDisplaySettings_PROPS,
} from "@/src/zustand";

type ListsFlatlistHeader_SECTIONProps = {
  search: string;
  totalLists: number | null;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS;
};
export default function ListsFlatlistHeader_SECTION({
  search,
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
      <Styled_TEXT type="label">
        {search !== "" ? (
          <>
            Search results for
            <Styled_TEXT type="text_18_medium"> '{search}' </Styled_TEXT>
          </>
        ) : appliedFiltersCount > 0 ? (
          `${appliedFiltersCount} filters applied`
        ) : (
          `Browse through ${totalLists ? totalLists : 0} public lists`
        )}
      </Styled_TEXT>

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
