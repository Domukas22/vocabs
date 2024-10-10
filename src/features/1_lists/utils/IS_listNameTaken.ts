//
//

import { List_MODEL } from "@/src/db/props";

export default function IS_listNameTaken({
  lists = [],
  name,
  list_id,
}: {
  lists: List_MODEL[];
  name: string | undefined;
  list_id: string | undefined;
}) {
  return lists.some(
    (list) => list.name.trim() === name?.trim() && list.id !== list_id
  );
}
