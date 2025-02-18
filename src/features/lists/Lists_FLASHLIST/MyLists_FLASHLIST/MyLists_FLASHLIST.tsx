//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { USE_zustand } from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { list_TYPES } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { List_TYPE } from "@/src/types/general_TYPES";
import { z_USE_myLists } from "../helpers/z_USE_myLists/z_USE_myLists";
import { USE_listZustandActions } from "../helpers/USE_listZustandActions/USE_listZustandActions";
import { useRouter } from "expo-router";
import { ListsFlatlist_HEADER } from "../../components";
import { MyList_BTN } from "../helpers";

export default function MyLists_FLASHLIST({
  IS_debouncing = false,
  search = "",
  debouncedSearch = "",
  list_TYPE,

  OPEN_createListModal = () => {},
  OPEN_updateListModal = () => {},
  RESET_search = () => {},
  handleScroll = () => {},
}: {
  IS_debouncing: boolean;
  search: string;
  debouncedSearch: string;
  list_TYPE: list_TYPES;

  OPEN_createListModal?: () => void;
  OPEN_updateListModal?: (list: List_TYPE) => void;
  RESET_search: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { TOAST } = USE_toast();
  const router = useRouter();

  const { z_user, z_listDisplay_SETTINGS } = USE_zustand();
  const { langFilters, sortDirection } = z_listDisplay_SETTINGS;

  const {
    z_myLists,
    z_HAVE_myListsReachedEnd,
    z_myListsUnpaginated_COUNT,
    z_myListsLoading_STATE,
    z_myListsCurrent_ACTIONS,
    z_myLists_ERROR: error,
    z_myListsHighlighted_ID,
    z_FETCH_myLists,
    z_SET_myTargetList,
  } = z_USE_myLists();

  const { FETCH_lists } = USE_listZustandActions({
    search: debouncedSearch,
    user_id: z_user?.id || "",
    list_TYPE,
    langFilters,
    sortDirection,
    FETCH_l: z_FETCH_myLists,
  });

  // Refetch on search / sorting / filter  change
  useEffect(() => {
    (async () => await FETCH_lists())();
  }, [debouncedSearch, langFilters, sortDirection]);

  const List_BTN = React.memo(function List_BTN({ list }: { list: List_TYPE }) {
    return list !== undefined ? (
      <MyList_BTN
        {...{ list }}
        key={list.id}
        onPress={() => router.push(`/(main)/vocabs/${list.id}`)}
        highlighted={z_myListsHighlighted_ID === list.id}
      />
    ) : null;
  });

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      flashlist_REF={flashlist_REF}
      renderItem={({ item }) => <List_BTN list={item} />}
      keyExtractor={(item) => item?.id}
      data={
        IS_debouncing ||
        error ||
        (z_myListsLoading_STATE !== "none" &&
          z_myListsLoading_STATE !== "error" &&
          z_myListsLoading_STATE !== "loading_more")
          ? []
          : z_myLists || []
      }
      extraData={[z_myListsHighlighted_ID, z_myListsCurrent_ACTIONS]}
      ListHeaderComponent={
        <></>
        // <ListsFlatlist_HEADER
        //   list_NAME="My lists"
        //   totalLists={z_myListsUnpaginated_COUNT}
        //   HAS_error={!!error}
        //   {...{ search, IS_searching: false }}
        // />
      }
      ListFooterComponent={
        <></>
        // <VocabFlatlistFooter_SECTION
        //   LOAD_more={() => FETCH_vocabs(true)}
        //   OPEN_createVocabModal={OPEN_createListModal}
        //   RESET_search={RESET_search}
        //   unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
        //   HAS_reachedEnd={z_HAVE_myVocabsReachedEnd}
        //   {...{
        //     IS_debouncing,
        //     z_myVocabsLoading_STATE,
        //     debouncedSearch,

        //     error,
        //   }}
        // />
      }
    />
  );
}
