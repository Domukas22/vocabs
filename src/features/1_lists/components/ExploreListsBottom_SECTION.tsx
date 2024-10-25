//
//
//

import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { ActivityIndicator } from "react-native";

export default function ExploreListsBottom_SECTION({
  IS_loadingMore,
  HAS_reachedEnd,
  ARE_listsFetching,
  LOAD_more,
}: {
  IS_loadingMore: boolean;
  HAS_reachedEnd: boolean;
  ARE_listsFetching: boolean;
  LOAD_more: () => void;
}) {
  if (!HAS_reachedEnd && !ARE_listsFetching) {
    return (
      <Btn
        text={!IS_loadingMore ? "Load more" : ""}
        iconRight={IS_loadingMore ? <ActivityIndicator color="white" /> : null}
        onPress={LOAD_more}
      />
    );
  } else if (HAS_reachedEnd) {
    return (
      <Styled_TEXT type="label_small" style={{ textAlign: "center" }}>
        The end
      </Styled_TEXT>
    );
  }
}
