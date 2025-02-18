//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";

import React, { useMemo } from "react";
import List_MODEL from "@/src/db/models/List_MODEL";

import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { MyList_BTN } from "../../buttons/MyList_BTN/MyList_BTN";
import { ListsFlatlist_HEADER } from "../../headers/ListsFlatlist_HEADER/ListsFlatlist_HEADER";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";

interface MyListsFlatlist_PROPS {
  lists: List_MODEL[] | undefined;
  SHOW_bottomBtn: boolean;
  highlighted_ID?: string | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  SELECT_list: (id: string) => void;
  PREPARE_listRename: (list: List_MODEL) => void;
  PREPADE_deleteList: (list: List_MODEL) => void;
  TOGGLE_createListModal: () => void;
  onScroll: () => {};
  error: { value: boolean; msg: string };
  IS_searching: boolean;
  search: string;
  unpaginated_COUNT: number | undefined;
  OPEN_createListModal: () => void;
  RESET_search: () => void;
  IS_debouncing: boolean;
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  LOAD_more: () => Promise<void>;
}

export function MyLists_FLASHLISTsssss({
  lists,
  error,
  IS_searching,
  listHeader_EL,
  listFooter_EL,
  onScroll,
  highlighted_ID,
  search,
  unpaginated_COUNT = 0,
  OPEN_createListModal = () => {},
  RESET_search = () => {},
  IS_debouncing = false,
  IS_loadingMore = false,
  HAS_reachedEnd = false,
  LOAD_more = async () => {},
}: MyListsFlatlist_PROPS) {
  const router = useRouter();
  const data = useMemo(() => {
    if (error?.value || IS_searching) return [];
    return lists;
  }, [IS_searching, error?.value, lists]);

  const Footer = () => {
    if (error?.value) return <Error_BLOCK paragraph={error?.msg} />;
    if (IS_searching)
      return (
        <View style={{ gap: 12, flex: 1 }}>
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
        </View>
      );
    return listFooter_EL;
  };

  const Button = (list: List_MODEL) =>
    list !== undefined ? (
      <MyList_BTN
        {...{ list }}
        key={list.id}
        onPress={() => router.push(`/(main)/vocabs/${list.id}`)}
        highlighted={highlighted_ID === list.id}
      />
    ) : null;

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={data}
      renderItem={({ item }) => Button(item)}
      keyExtractor={(item) => item?.id}
      ListHeaderComponent={
        <ListsFlatlist_HEADER
          list_NAME="My lists"
          totalLists={unpaginated_COUNT}
          HAS_error={error?.value}
          {...{ search, IS_searching }}
        />
      }
      ListFooterComponent={
        <BottomAction_BLOCK
          type="list"
          createBtn_ACTION={OPEN_createListModal}
          totalFilteredResults_COUNT={unpaginated_COUNT}
          RESET_search={RESET_search}
          {...{
            search,
            IS_debouncing,
            LOAD_more,
            IS_loadingMore,
            HAS_reachedEnd,
          }}
        />
      }
    />
  );
}
