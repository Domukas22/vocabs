//
//
//

import Subheader from "@/src/components/1_grouped/subheader/Subheader";
import { ScrollView } from "react-native";

export function DisplaySettings_SUBNAV({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Subheader noPadding>
      <ScrollView
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
        horizontal={true}
      >
        {children}
      </ScrollView>
    </Subheader>
  );
}
