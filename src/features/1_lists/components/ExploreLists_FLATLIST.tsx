//
//
//

import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import ExploreList_BTN from "./ExploreList_BTN";
import ExploreListsBottom_SECTION from "./ExploreListsBottom_SECTION";

export default function ExploreLists_FLATLIST({
  lists,
  IS_loadingMore,
  HAS_reachedEnd,
  ARE_listsFetching,
  LOAD_more,
  type = "public",
}: {
  lists: List_MODEL[] | undefined;
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  ARE_listsFetching: boolean;
  LOAD_more: () => void;
  type: "public" | "shared";
}) {
  const router = useRouter();
  return (
    <Styled_FLATLIST
      data={lists}
      ListHeaderComponent={<Flatlist_HEADER title="Explore all public lists" />}
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
      ListFooterComponent={
        <ExploreListsBottom_SECTION
          {...{
            IS_loadingMore,
            HAS_reachedEnd,
            ARE_listsFetching,
            LOAD_more,
          }}
        />
      }
    />
  );
}
