//
//
//

import { List_MODEL } from "@/src/db/watermelon_MODELS";

export default function SEARCH_lists({
  search,
  lists,
}: {
  search: string;
  lists: List_MODEL[];
}) {
  if (search === "") return lists;

  return lists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase().trim())
  );
}
