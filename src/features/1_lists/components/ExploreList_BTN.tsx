//
//
//

import { ICON_flag } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { View } from "react-native";

export default function ExploreList_BTN({
  list,
  GO_toList,
}: {
  list: List_MODEL | undefined;
  GO_toList: () => void;
}) {
  return (
    <Transition_BTN onPress={GO_toList}>
      {list?.name && (
        <Styled_TEXT type="text_18_bold">{list?.name}</Styled_TEXT>
      )}

      {list?.owner && list?.owner?.username && (
        <Styled_TEXT type="label_small">
          Created by: {list.owner.username}
        </Styled_TEXT>
      )}

      <Styled_TEXT
        type="label_small"
        // style={{ color: MyColors.text_primary }}
      >
        {list?.vocab_COUNT > 0 ? `${list.vocab_COUNT} vocabs` : "Empty list"}
      </Styled_TEXT>

      {list?.collected_lang_ids && list?.collected_lang_ids.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            gap: 4,

            justifyContent: "flex-end",
          }}
        >
          {list?.collected_lang_ids?.map((lang_id: string, index: number) => (
            <ICON_flag lang={lang_id} key={list?.id + lang_id + index} />
          ))}
        </View>
      )}
    </Transition_BTN>
  );
}
