//
//
//

import { List_PROPS } from "@/src/db/props";

export default function SEARCH_lists({
  search,
  lists,
}: {
  search: string;
  lists: List_PROPS[];
}) {
  if (search === "") return lists;

  return lists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase().trim())
  );
}
