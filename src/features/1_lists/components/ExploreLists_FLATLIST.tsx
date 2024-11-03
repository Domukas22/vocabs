//
//
//

import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import ExploreList_BTN from "./ExploreList_BTN";
import ExploreListsBottom_SECTION from "./ExploreListsBottom_SECTION";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { HEADER_MARGIN } from "@/src/constants/globalVars";

export default function ExploreLists_FLATLIST({
  lists,
  IS_loadingMore,
  HAS_reachedEnd,
  ARE_listsFetching,
  LOAD_more,
  type = "public",
  listHeader_EL,
  listFooter_EL,
  onScroll,
}: {
  lists: List_MODEL[] | undefined;
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  ARE_listsFetching: boolean;
  LOAD_more: () => void;
  type: "public" | "shared";
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const router = useRouter();
  return (
    <Styled_FLASHLIST
      data={lists}
      {...{ onScroll }}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={listFooter_EL}
      renderItem={({ item }) => {
        return (
          <ExploreList_BTN
            list={item}
            GO_toList={() =>
              router.push(
                `/(main)/explore/${
                  type === "public" ? "public_lists" : "shared_lists"
                }/${item.id}`
              )
            }
          />
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
    />
  );
}
