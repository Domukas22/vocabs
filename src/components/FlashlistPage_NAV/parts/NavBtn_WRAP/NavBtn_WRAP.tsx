//
//
//

import { View } from "react-native";

export function NavBtn_WRAP({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", gap: 8 }}>{children}</View>;
}
