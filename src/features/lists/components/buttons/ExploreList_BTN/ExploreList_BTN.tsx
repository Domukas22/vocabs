//
//
//

import Big_BTN from "@/src/components/1_grouped/buttons/Big_BTN/Big_BTN";
import List_MODEL from "@/src/db/models/List_MODEL";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { ListBtn_BOTTOM, ListBtn_FLAGS, ListBtn_TOP } from "../_components";

export function ExploreList_BTN({
  list,
  GO_toList,
}: {
  list: List_MODEL | undefined;
  GO_toList: () => void;
}) {
  return (
    <Big_BTN onPress={GO_toList}>
      <ListBtn_TOP>
        <Styled_TEXT type="list_title">
          {list?.name || "LIST HAS NO NAME"}
        </Styled_TEXT>
        {list?.description && (
          <Styled_TEXT type="label_small">{list?.description}</Styled_TEXT>
        )}
        {list?.username && (
          <Styled_TEXT type="label_small">
            Shared by: {list.username}
          </Styled_TEXT>
        )}
      </ListBtn_TOP>

      <ListBtn_BOTTOM>
        <Styled_TEXT type="label_small" style={{ marginRight: "auto" }}>
          {list?.vocab_COUNT ? `${list?.vocab_COUNT} vocabs` : "Empty list"}
        </Styled_TEXT>
        <ListBtn_FLAGS lang_ids={list?.collected_lang_ids?.split(",") || []} />
      </ListBtn_BOTTOM>
    </Big_BTN>
  );
}
