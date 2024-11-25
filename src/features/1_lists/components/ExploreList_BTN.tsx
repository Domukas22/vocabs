//
//
//

import Big_BTN from "@/src/components/Transition_BTN/Big_BTN";
import List_MODEL from "@/src/db/models/List_MODEL";
import ListBtn_TOP from "./ListBtn_TOP";
import List_FLAGS from "./List_FLAGS";
import ListBtn_BOTTOM from "./ListBtn_BOTTOM";
import VocabCount_LABEL from "./VocabCount_LABEL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

export default function ExploreList_BTN({
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
        <VocabCount_LABEL vocab_COUNT={list?.vocab_COUNT} />
        <List_FLAGS lang_ids={list?.collected_lang_ids?.split(",") || []} />
      </ListBtn_BOTTOM>
    </Big_BTN>
  );
}
