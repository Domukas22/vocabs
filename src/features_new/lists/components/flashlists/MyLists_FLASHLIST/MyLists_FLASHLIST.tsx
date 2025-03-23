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
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { List_TYPE } from "../../../types";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";

export default function MyLists_FLASHLIST({
  IS_debouncing = false,
  handleScroll = () => {},
  Header,
  Footer,
  lists = [],
  fetch_TYPE,
  loading_STATE,
  error,
  highlighted_ID,
}: {
  IS_debouncing: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  lists: List_TYPE[];
  fetch_TYPE: vocabFetch_TYPES;
  loading_STATE: loadingState_TYPES;
  highlighted_ID: string;
  error: General_ERROR | undefined;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const router = useRouter();

  const { z_SET_myOneList } = z_USE_myOneList();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      flashlist_REF={flashlist_REF}
      data={
        IS_debouncing ||
        error ||
        (loading_STATE !== "none" &&
          loading_STATE !== "error" &&
          loading_STATE !== "loading_more")
          ? []
          : lists || []
      }
      renderItem={({ item }) => (
        <List_CARD
          key={item.id}
          list={item}
          onPress={() => {
            z_SET_myOneList(item);

            Keyboard.dismiss();
            router.push(`/(main)/vocabs/${item.id}`);
          }}
          highlighted={highlighted_ID === item.id}
        />
      )}
      keyExtractor={(item) => item?.id}
      extraData={[highlighted_ID]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
