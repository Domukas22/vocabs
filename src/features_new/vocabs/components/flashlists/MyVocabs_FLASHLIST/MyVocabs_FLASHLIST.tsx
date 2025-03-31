//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo, useRef } from "react";

import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { Vocab_CARD } from "../_parts/Vocab_CARD/Vocab_CARD";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { General_ERROR } from "@/src/types/error_TYPES";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_arrow,
  ICON_dropdownArrow,
  ICON_multiSelect,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";
import { z_USE_myVocabsDisplaySettings } from "../../../hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { t } from "i18next";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

// TODO ==> Add dynamic filter button, which filters only by selected vocabs

export default function MyVocabs_FLASHLIST({
  IS_debouncing = false,
  OPEN_updateVocabModal = () => {},
  handleScroll = () => {},
  Header,
  Footer,
  vocabs = [],
  fetch_TYPE,
  loading_STATE,
  error,
  highlighted_ID,
  showTitle = false,
  IS_vocabSelectionOn = false,
  TOGGLE_isVocabSelectionOn = () => {},
  HANDLE_vocabSelection = () => {},
  CANCEL_selection = () => {},
  selected_VOCABS = new Map(),
}: {
  IS_debouncing: boolean;
  OPEN_updateVocabModal?: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  vocabs: Vocab_TYPE[];
  fetch_TYPE: vocabFetch_TYPES;
  loading_STATE: loadingState_TYPES;
  highlighted_ID: string;
  error: General_ERROR | undefined;
  showTitle: boolean;
  IS_vocabSelectionOn: boolean;
  TOGGLE_isVocabSelectionOn: () => void;
  CANCEL_selection: () => void;
  HANDLE_vocabSelection: (id: string, vocab: Vocab_TYPE) => void;
  selected_VOCABS: Map<string, Vocab_TYPE>;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();
  const { filters, z_GET_activeFilterCount, z_CLEAR_filters } =
    z_USE_myVocabsDisplaySettings();

  const filter_COUNT = useMemo(z_GET_activeFilterCount, [
    filters,
    z_GET_activeFilterCount,
  ]);

  const data = useMemo(
    () =>
      IS_debouncing ||
      error ||
      (loading_STATE !== "none" &&
        loading_STATE !== "error" &&
        loading_STATE !== "loading_more")
        ? []
        : vocabs || [],
    [loading_STATE, vocabs, IS_debouncing, error]
  );

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Styled_FLASHLIST
        onScroll={handleScroll}
        data={data}
        flashlist_REF={flashlist_REF}
        renderItem={({ item }: { item: Vocab_TYPE }) => (
          <Vocab_CARD
            vocab={item}
            list_TYPE="private"
            fetch_TYPE={fetch_TYPE}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            highlighted={highlighted_ID === item.id}
            IS_vocabSelectionOn={IS_vocabSelectionOn}
            HANDLE_vocabSelection={HANDLE_vocabSelection}
            selected_VOCABS={selected_VOCABS}
          />
        )}
        keyExtractor={(item) => "Vocab" + item.id}
        extraData={[highlighted_ID, z_currentActions]}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
      />

      <View
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          left: 12,
          flexDirection: "row",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        {filter_COUNT > 0 && (
          <Btn
            text="Clear filters"
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
            onPress={z_CLEAR_filters}
            iconRight={<ICON_X rotate big color="white" />}
          />
        )}

        <Btn
          type={IS_vocabSelectionOn ? "active" : "simple"}
          iconLeft={
            <ICON_multiSelect
              color={IS_vocabSelectionOn ? "primary" : "white"}
            />
          }
          iconRight={
            IS_vocabSelectionOn ? <ICON_X color="primary" rotate big /> : null
          }
          onPress={TOGGLE_isVocabSelectionOn}
        />
        {showTitle && (
          <Btn
            iconRight={<ICON_arrow direction="up" color="white" />}
            onPress={() =>
              flashlist_REF?.current?.scrollToOffset({
                animated: true,
                offset: 0,
              })
            }
          />
        )}
      </View>
    </View>
  );
}
