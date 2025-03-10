//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import {
  ListCardBottom_FLAGS,
  ListCardBottomRight_WRAP,
  ListCardBottom_WRAP,
  ListCardBottom_LABEL,
} from "../../_parts";
import { ICON_savedCount } from "@/src/components/1_grouped/icons/icons";

export function PublicListCard_BOTTOM({ list }: { list: List_TYPE }) {
  return (
    <ListCardBottom_WRAP list={list}>
      <ListCardBottom_LABEL list={list} />
      <ListCardBottomRight_WRAP>
        <ICON_savedCount count={list?.saved_count || 0} />
        <ListCardBottom_FLAGS list={list} />
      </ListCardBottomRight_WRAP>
    </ListCardBottom_WRAP>
  );
}
