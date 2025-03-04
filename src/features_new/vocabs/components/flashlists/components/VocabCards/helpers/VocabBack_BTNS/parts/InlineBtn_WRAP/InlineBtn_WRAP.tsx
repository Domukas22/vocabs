//
//
//

import { memo } from "react";
import { View } from "react-native";

type props = {
  children: React.ReactNode;
};

export const InlineBtn_WRAP = memo(({ children }: props) => (
  <View style={{ flexDirection: "row", gap: 8 }}>{children}</View>
));
