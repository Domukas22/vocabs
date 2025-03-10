//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { MyListCard_BOTTOM, PublicListCard_BOTTOM } from "./variations";

export function ListCard_BOTTOM({ list }: { list: List_TYPE }) {
  const { type = "private" } = list;

  return type === "private" ? (
    <MyListCard_BOTTOM list={list} />
  ) : (
    <PublicListCard_BOTTOM list={list} />
  );
}
