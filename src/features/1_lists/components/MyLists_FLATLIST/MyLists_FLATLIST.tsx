//
//
//

import { MyList_BTN } from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";

import React, { useMemo } from "react";
import List_MODEL from "@/src/db/models/List_MODEL";

import Error_SECTION from "@/src/components/Error_SECTION";
import Skeleton_VIEW from "@/src/components/Skeleton_VIEW";
import { useRouter } from "expo-router";

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
}

export default function MyLists_FLATLIST({
  lists,
  error,
  IS_searching,
  listHeader_EL,
  listFooter_EL,
  onScroll,
}: MyListsFlatlist_PROPS) {
  const router = useRouter();
  const data = useMemo(() => {
    if (error?.value || IS_searching) return [];
    return lists;
  }, [IS_searching, error?.value, lists]);

  const Footer = () => {
    if (error?.value) return <Error_SECTION paragraph={error?.msg} />;
    if (IS_searching) return <Skeleton_VIEW />;
    return listFooter_EL;
  };

  const Button = (list: List_MODEL) =>
    list !== undefined ? (
      <MyList_BTN
        {...{ list }}
        key={list.id}
        onPress={() => router.push(`/(main)/vocabs/${list.id}`)}
      />
    ) : null;

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={data}
      renderItem={({ item }) => Button(item)}
      keyExtractor={(item) => item?.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={<Footer />}
    />
  );
}
