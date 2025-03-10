//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import {
  ListCardBottom_DIFFICULTIES,
  ListCardBottom_FLAGS,
  ListCardBottom_WRAP,
  ListCardBottomRight_WRAP,
} from "../../_parts";

export function MyListCard_BOTTOM({ list }: { list: List_TYPE }) {
  return (
    <ListCardBottom_WRAP list={list}>
      <ListCardBottom_DIFFICULTIES list={list} />
      <ListCardBottomRight_WRAP>
        <ListCardBottom_FLAGS list={list} />
      </ListCardBottomRight_WRAP>
    </ListCardBottom_WRAP>
  );
}
