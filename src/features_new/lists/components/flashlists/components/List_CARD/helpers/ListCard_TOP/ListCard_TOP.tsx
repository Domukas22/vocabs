//
//
//

import { StyleSheet, View } from "react-native";
import { ListCardTop_DESCRIPTION, ListCardTop_TITLE } from "./_parts";
import { List_TYPE } from "@/src/features_new/lists/types";

export function ListCard_TOP({ list }: { list: List_TYPE }) {
  return (
    <View style={s.top}>
      <ListCardTop_TITLE list={list} />
      <ListCardTop_DESCRIPTION list={list} />
    </View>
  );
}

const s = StyleSheet.create({
  top: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
});
