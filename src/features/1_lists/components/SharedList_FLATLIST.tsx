//
//
//

import Flatlist_HEADER from "@/src/components/Flatlist_HEADER";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import PublicList_BTN from "./PublicList_BTN";
import SharedList_BTN from "./SharedList_BTN";

export default function SharedList_FLATLIST({
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
      ListHeaderComponent={<Flatlist_HEADER title="Lists shared with you" />}
      renderItem={({ item }) => {
        return (
          <SharedList_BTN
            list={item}
            GO_toList={() =>
              router.push(`/(main)/explore/shared_lists/${item.id}`)
            }
          />
        );
      }}
      keyExtractor={(item) => "PublicVocab" + item.id}
      ListFooterComponent={<>{bottom_SECTION}</>}
    />
  );
}
