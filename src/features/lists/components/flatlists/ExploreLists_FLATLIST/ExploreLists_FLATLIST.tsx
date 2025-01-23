//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import List_MODEL from "@/src/db/models/List_MODEL";
import { useRouter } from "expo-router";
import { ExploreList_BTN } from "../../buttons/ExploreList_BTN/ExploreList_BTN";
import { NativeSyntheticEvent, NativeScrollEvent, View } from "react-native";
import { FetchedSharedList_PROPS } from "../../../functions/exploreLists/props";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";

import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import { useMemo } from "react";

export function ExploreLists_FLATLIST({
  type = "public",
  error = { value: false, msg: "" },
  lists,
  listHeader_EL,
  listFooter_EL,
  onScroll,
  IS_searching = false,
}: {
  type: "public" | "shared";
  error: { value: boolean; msg: string };
  lists: List_MODEL[] | FetchedSharedList_PROPS[] | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  IS_searching: boolean;
}) {
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

  const List_BTN = (list: List_MODEL) => (
    <ExploreList_BTN
      list={list}
      GO_toList={() =>
        router.push(
          `/(main)/explore/${
            type === "public" ? "public_lists" : "shared_lists"
          }/${list?.id}`
        )
      }
    />
  );

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={data}
      renderItem={({ item }) => List_BTN(item)}
      keyExtractor={(item) => "PublicList" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={<Footer />}
    />
  );
}
