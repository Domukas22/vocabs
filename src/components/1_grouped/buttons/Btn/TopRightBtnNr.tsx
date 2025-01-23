//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Text, View } from "react-native";

export default function TopRightBtnNr({ count }: { count: number }) {
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: MyColors.fill_primary,
        height: 20,
        width: 20,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        top: -5,
        right: -5,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Nunito-Black",
          color: "black",
        }}
      >
        {count}
      </Text>
    </View>
  );
}
