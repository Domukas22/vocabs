//
//
//

import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import { View } from "react-native";

export function ListBtn_FLAGS({
  lang_ids = [],
}: {
  lang_ids: string[] | undefined;
}) {
  return (
    lang_ids && (
      <View
        style={{
          flexDirection: "row",
          gap: 6,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {lang_ids?.map((lang_id: string, index: number) => (
          <ICON_flag lang={lang_id} key={lang_id + index} big />
        ))}
      </View>
    )
  );
}
