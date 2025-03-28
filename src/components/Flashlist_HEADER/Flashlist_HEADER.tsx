//
//
//

import { View, StyleSheet } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";
import { The4Fetch_TYPES, loadingState_TYPES } from "@/src/types/general_TYPES";
import Filter_BULLETS from "@/src/components/Filter_BULLETS/Filter_BULLETS";

type Flashlist_HEADER_PROPS = {
  type: The4Fetch_TYPES;
  search: string;
  list_NAME: string | undefined;
  loading_STATE: loadingState_TYPES;
  IS_debouncing: boolean;
  debouncedSearch: string;
  unpaginated_COUNT: number | null;
  appliedFilter_COUNT: number;
};

export function Flashlist_HEADER({
  type,
  search,
  list_NAME = "No list found",
  loading_STATE = "none",
  IS_debouncing,
  debouncedSearch,
  unpaginated_COUNT = 0,
  appliedFilter_COUNT = 0,
}: Flashlist_HEADER_PROPS) {
  return (
    <View>
      <View>
        {list_NAME ? (
          <Styled_TEXT type="text_20_bold">{list_NAME}</Styled_TEXT>
        ) : null}
        <View style={{ paddingTop: 6, paddingBottom: 12 }}>
          <Flashlist_LABEL
            appliedFiltersCount={appliedFilter_COUNT}
            type={type}
            totalResult_COUNT={unpaginated_COUNT || 0}
            debouncedSearch={debouncedSearch}
            IS_debouncing={IS_debouncing}
            loading_STATE={loading_STATE}
            search={search}
          />
        </View>
      </View>

      {appliedFilter_COUNT > 0 && <Filter_BULLETS type={type} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 16,
  },
});

export default Filter_BULLETS;
