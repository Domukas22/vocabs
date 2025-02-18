//
//
//

import { myOneListAction_TYPE } from "@/src/features_new/lists/hooks/z_USE_myOneList/z_USE_myOneList";

export function ARE_myOneListDefaultLangIdsUpdating(
  list_id: string,
  z_myOneListCurrent_ACTIONS: myOneListAction_TYPE[] = []
) {
  return z_myOneListCurrent_ACTIONS.some(
    (action) =>
      action.list_id === list_id &&
      action.action === "updating_default_lang_ids"
  );
}
