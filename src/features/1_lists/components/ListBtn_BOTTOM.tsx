//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";

export default function ListBtn_BOTTOM({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: MyColors.border_white_005,
      }}
    >
      {children && children}
    </View>
  );
}
