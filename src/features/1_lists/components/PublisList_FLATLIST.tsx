//
//
//

import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import PublicList_BTN from "./PublicList_BTN";

export default function PublisList_FLATLIST({
  lists,
  bottom_SECTION,
}: {
  lists: List_MODEL[] | undefined;
  bottom_SECTION: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Styled_FLATLIST
      data={lists}
      ListHeaderComponent={<Flatlist_HEADER title="Explore all public lists" />}
      renderItem={({ item }) => {
        return (
          <PublicList_BTN
            list={item}
            GO_toList={() =>
              router.push(`/(main)/explore/public_lists/${item.id}`)
            }
          />
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
      ListFooterComponent={<>{bottom_SECTION}</>}
    />
  );
}
