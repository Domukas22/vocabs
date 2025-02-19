//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { USE_zustand } from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";

import {
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { z_USE_myLists } from "../../../hooks/z_USE_myLists/z_USE_myLists";
import { USE_myListsZustandActions } from "../../../hooks/USE_myListsZustandActions/USE_myListsZustandActions";
import { useRouter } from "expo-router";
import { ListsFlatlist_HEADER } from "../../../../../features/lists/components";

import { z_USE_myOneList } from "@/src/features_new/lists/hooks/z_USE_myOneList/z_USE_myOneList";
import { t } from "i18next";
import { ListFlatlist_FOOTER } from "../components/ListFlatlist_FOOTER/ListFlatlist_FOOTER";
import { list_TYPES, List_TYPE } from "../../../types";
import { MyList_BTN } from "../components/MyList_BTN/MyList_BTN";

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
  } = z_USE_myLists();

  const { z_SET_myOneList } = z_USE_myOneList();

  const { FETCH_lists } = USE_myListsZustandActions({
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
        onPress={() => {
          z_SET_myOneList(list);
          Keyboard.dismiss();
          router.push(`/(main)/vocabs/${list.id}`);
        }}
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
        <ListsFlatlist_HEADER
          IS_debouncing={IS_debouncing}
          debouncedSearch={debouncedSearch}
          search={search}
          loading_STATE={z_myListsLoading_STATE}
          list_NAME={t("header.myLists")}
          unpaginated_COUNT={z_myListsUnpaginated_COUNT}
          HAS_error={!!error}
        />
      }
      ListFooterComponent={
        <ListFlatlist_FOOTER
          LOAD_more={() => FETCH_lists(true)}
          OPEN_createVocabModal={OPEN_createListModal}
          RESET_search={RESET_search}
          unpaginated_COUNT={z_myListsUnpaginated_COUNT}
          HAS_reachedEnd={z_HAVE_myListsReachedEnd}
          IS_debouncing={IS_debouncing}
          loading_STATE={z_myListsLoading_STATE}
          debouncedSearch={debouncedSearch}
          error={error}
        />
      }
    />
  );
}
