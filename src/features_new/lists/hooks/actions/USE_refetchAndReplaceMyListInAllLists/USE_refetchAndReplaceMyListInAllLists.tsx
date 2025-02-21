//
//
//

import { useCallback } from "react";
import { z_USE_myLists } from "../../zustand/z_USE_myLists/z_USE_myLists";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FETCH_oneList } from "../../../functions/fetch/FETCH_oneList/FETCH_oneList";
import { USE_zustand } from "@/src/hooks";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const function_NAME = "USE_refetchAndReplaceMyListInAllLists";

export default function USE_refetchAndReplaceMyListInAllLists() {
  const { z_user } = z_USE_user();
  const { z_UPDATE_listInMyLists } = z_USE_myLists();
  const { IS_inAction } = z_USE_currentActions();

  const _REFECH_andReplaceMyListInLists = useCallback(
    async (list_ID: string) => {
      try {
        // --------------------------------------------------
        // Check if item is already in action
        if (IS_inAction("list", list_ID, "any")) return;

        const { list } = await FETCH_oneList(
          list_ID,
          z_user?.id || "",
          "private"
        );

        if (!list)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_oneList' returned undefined 'list', although no error was thrown",
          });

        z_UPDATE_listInMyLists(list);
      } catch (error: any) {
        throw new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });
      }
    },
    []
  );

  return { REFECH_andReplaceMyListInLists: _REFECH_andReplaceMyListInLists };
}
