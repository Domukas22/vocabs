//
//
//

import { View } from "react-native";
import {
  MyListsFilter_BULLETS,
  MyVocabsFilter_BULLETS,
  PublicListsFilter_BULLETS,
  PublicVocabsFilter_BULLETS,
} from "./variations";
import { memo, useMemo } from "react";
import { flashlistHeader_TYPE } from "@/src/types/general_TYPES";

const Filter_BULLETS = memo(({ type }: { type?: flashlistHeader_TYPE }) => {
  const renderFilter = useMemo(() => {
    switch (type) {
      case "my-lists":
        return <MyListsFilter_BULLETS />;
      case "my-vocabs":
        return <MyVocabsFilter_BULLETS />;
      case "public-lists":
        return <PublicListsFilter_BULLETS />;
      case "public-vocabs":
        return <PublicVocabsFilter_BULLETS />;
      default:
        return null;
    }
  }, [type]); // Memoizes the rendered output based on `type`

  if (!type) return null;

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}
    >
      {renderFilter}
    </View>
  );
});

export default Filter_BULLETS;
