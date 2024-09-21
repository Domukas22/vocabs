//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { ActivityIndicator, View } from "react-native";

export default function List_SKELETONS() {
  return (
    <View
      style={{
        gap: 8,
        padding: 12,
      }}
    >
      <SingleList_SKELETON />
      <SingleList_SKELETON />
      <SingleList_SKELETON />
      <SingleList_SKELETON />
      <SingleList_SKELETON />
      <SingleList_SKELETON />
    </View>
  );
}

function SingleList_SKELETON() {
  return (
    <View
      style={{
        height: 80,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: MyColors.border_white_005,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={MyColors.text_white_06} />
    </View>
  );
}
