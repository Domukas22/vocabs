//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";

import {
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { useRouter } from "expo-router";

import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";
import { List_CARD } from "../components/List_CARD/List_CARD";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { z_USE_publicLists } from "../../../hooks/zustand/z_USE_publicLists/z_USE_myLists";

export default function PublicLists_FLASHLIST({
  IS_debouncing = false,
  handleScroll = () => {},
  Header,
  Footer,
}: {
  IS_debouncing: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const router = useRouter();

  const {
    z_publicLists,
    z_publicListsLoading_STATE,
    z_publicLists_ERROR,
    z_publicListsHighlighted_ID,
  } = z_USE_publicLists();

  const { z_SET_publicOneList } = z_USE_publicOneList();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      flashlist_REF={flashlist_REF}
      data={
        IS_debouncing ||
        z_publicLists_ERROR ||
        (z_publicListsLoading_STATE !== "none" &&
          z_publicListsLoading_STATE !== "error" &&
          z_publicListsLoading_STATE !== "loading_more")
          ? []
          : z_publicLists || []
      }
      renderItem={({ item }) => (
        <List_CARD
          key={item.id}
          list={item}
          list_TYPE="public"
          onPress={() => {
            z_SET_publicOneList(item);
            Keyboard.dismiss();
            router.push(`/(main)/explore/public_lists/${item.id}`);
          }}
          highlighted={z_publicListsHighlighted_ID === item.id}
        />
      )}
      keyExtractor={(item) => item?.id}
      extraData={[z_publicListsHighlighted_ID]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
