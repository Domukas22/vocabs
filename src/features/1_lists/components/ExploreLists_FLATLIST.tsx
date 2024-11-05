//
//
//

import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import ExploreList_BTN from "./ExploreList_BTN";
import ExploreListsBottom_SECTION from "./ExploreListsBottom_SECTION";
import { NativeSyntheticEvent, NativeScrollEvent, View } from "react-native";
import { HEADER_MARGIN } from "@/src/constants/globalVars";
import { FetchedSharedList_PROPS } from "../hooks/USE_supabaseLists";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Error_SECTION from "@/src/components/Error_SECTION";

import Skeleton_VIEW from "@/src/components/Skeleton_VIEW";
import { useMemo } from "react";

export default function ExploreLists_FLATLIST({
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
    if (error.value || IS_searching) return [];
    return lists;
  }, [IS_searching, error.value, lists]);

  const Footer = () => {
    if (error.value) return <Error_SECTION paragraph={error.msg} />;
    if (IS_searching) return <Skeleton_VIEW />;
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
      data={data}
      {...{ onScroll }}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={<Footer />}
      renderItem={({ item }) => List_BTN(item)}
      keyExtractor={(item) => "PublicVocab" + item.id}
    />
  );
}
