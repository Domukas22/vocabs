//
//
//

import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";

export default function ListBtn_TOP({
  name = "INSERT LIST NAME",
  description,
  owner_USERNAME,
  IS_shared = false,
  IS_submitted = false,
}: {
  name: string | undefined;
  description: string | undefined;
  owner_USERNAME?: string | undefined;
  IS_shared?: boolean;
  IS_submitted?: boolean;
}) {
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 12,
        paddingHorizontal: 14,
      }}
    >
      <Styled_TEXT type="list_title">{name}</Styled_TEXT>
      {owner_USERNAME && (
        <Styled_TEXT type="label_small">
          Created by: {owner_USERNAME}
        </Styled_TEXT>
      )}
      {IS_shared && (
        <Styled_TEXT
          type="label_small"
          style={{
            textAlign: "left",
            color: MyColors.text_green,
            fontSize: 16,
          }}
        >
          Shared list
        </Styled_TEXT>
      )}
      {IS_submitted && (
        <Styled_TEXT
          type="label_small"
          style={{
            textAlign: "left",
            color: MyColors.text_yellow,
            fontSize: 16,
          }}
        >
          Submitted for publish
        </Styled_TEXT>
      )}
      {description && (
        <Styled_TEXT type="label_small">{description}</Styled_TEXT>
      )}
    </View>
  );
}
