//
//
//

import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import { List_TYPE } from "@/src/features_new/lists/types";
import { View } from "react-native";

export function ListCardBottom_FLAGS({ list }: { list: List_TYPE }) {
  const { collected_lang_ids: lang_ids = [] } = list;

  return lang_ids && lang_ids?.length > 0 ? (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
      }}
    >
      {lang_ids?.map((lang_id: string, index: number) => (
        <ICON_flag lang={lang_id} key={lang_id + index} big />
      ))}
    </View>
  ) : null;
}
