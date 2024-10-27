//
//
//

import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import ListBtn_TOP from "./ListBtn_TOP";
import List_FLAGS from "./List_FLAGS";
import ListBtn_BOTTOM from "./ListBtn_BOTTOM";
import VocabCount_LABEL from "./VocabCount_LABEL";

export default function ExploreList_BTN({
  list,
  GO_toList,
}: {
  list: List_MODEL | undefined;
  GO_toList: () => void;
}) {
  return (
    <Transition_BTN onPress={GO_toList}>
      <ListBtn_TOP
        name={list?.name}
        description={list?.description}
        owner_USERNAME={list?.owner?.username}
      />

      <ListBtn_BOTTOM>
        <VocabCount_LABEL vocab_COUNT={list?.vocab_COUNT} />
        <List_FLAGS lang_ids={list?.collected_lang_ids} />
      </ListBtn_BOTTOM>
    </Transition_BTN>
  );
}
