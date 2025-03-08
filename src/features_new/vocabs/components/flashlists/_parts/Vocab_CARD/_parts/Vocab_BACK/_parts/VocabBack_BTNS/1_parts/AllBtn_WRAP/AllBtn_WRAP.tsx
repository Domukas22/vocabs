//
//
//

import { memo } from "react";
import { View } from "react-native";

type props = {
  children: React.ReactNode;
};

export const AllBtn_WRAP = memo(({ children }: props) => (
  <View style={{ padding: 12, gap: 8 }}>{children}</View>
));
