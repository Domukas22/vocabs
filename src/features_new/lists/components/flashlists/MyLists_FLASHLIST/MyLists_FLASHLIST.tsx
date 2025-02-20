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

import { z_USE_myLists } from "../../../hooks/zustand/z_USE_myLists/z_USE_myLists";
import { useRouter } from "expo-router";

import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { List_CARD } from "../components/List_CARD/List_CARD";

export default function MyLists_FLASHLIST({
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
    z_myLists,
    z_myListsLoading_STATE,
    z_myLists_ERROR,
    z_myListsHighlighted_ID,
  } = z_USE_myLists();

  const { z_SET_myOneList } = z_USE_myOneList();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      flashlist_REF={flashlist_REF}
      data={
        IS_debouncing ||
        z_myLists_ERROR ||
        (z_myListsLoading_STATE !== "none" &&
          z_myListsLoading_STATE !== "error" &&
          z_myListsLoading_STATE !== "loading_more")
          ? []
          : z_myLists || []
      }
      renderItem={({ item }) => (
        <List_CARD
          key={item.id}
          list={item}
          list_TYPE="private"
          onPress={() => {
            z_SET_myOneList(item);
            Keyboard.dismiss();
            router.push(`/(main)/vocabs/${item.id}`);
          }}
          highlighted={z_myListsHighlighted_ID === item.id}
        />
      )}
      keyExtractor={(item) => item?.id}
      extraData={[z_myListsHighlighted_ID]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
