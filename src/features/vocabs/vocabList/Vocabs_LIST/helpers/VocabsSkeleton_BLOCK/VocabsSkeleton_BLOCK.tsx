//
//
//

import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import { View } from "react-native";

export function VocabsSkeleton_BLOCK() {
  return (
    <View style={{ gap: 12, flex: 1 }}>
      <Skeleton_BLOCK />
      <Skeleton_BLOCK />
      <Skeleton_BLOCK />
      <Skeleton_BLOCK />
      <Skeleton_BLOCK />
    </View>
  );
}
