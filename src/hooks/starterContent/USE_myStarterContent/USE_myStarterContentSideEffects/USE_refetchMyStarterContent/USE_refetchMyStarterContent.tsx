//
//
//

import { Dispatch, SetStateAction, useCallback } from "react";

import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { FETCH_myTopLists } from "./FETCH_myTopLists/FETCH_myTopLists";
import { FETCH_totalUserVocabCount } from "./FETCH_totalUserVocabCount/FETCH_totalUserVocabCount";
import { FETCH_savedUserVocabCount } from "./FETCH_savedUserVocabCount/FETCH_savedUserVocabCount";
import { FETCH_deletedUserVocabCount } from "./FETCH_deletedUserVocabCount/FETCH_deletedUserVocabCount";
import { FETCH_totalUserListCount } from "./FETCH_totalUserListCount/FETCH_totalUserListCount";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { SET_myStarterContent_PROPS } from "../../USE_setMyStarterContent/USE_setMyStarterContent";

const function_NAME = "USE_refetchMyStarterContent";

export default function USE_refetchMyStarterContent({
  SET_error = () => {},
  SET_loading = () => {},
  SET_myStarterContent = () => {},
}: {
  SET_error: Dispatch<SetStateAction<General_ERROR | undefined>>;
  SET_loading: Dispatch<SetStateAction<starterContentLoading_TYPE>>;
  SET_myStarterContent: (props: SET_myStarterContent_PROPS) => void;
}) {
  const { z_user } = z_USE_user();

  const _REFETCH_myStarterContent = useCallback(async () => {
    try {
      // ---------------------------------------------------------
      // Fetch top 3 lists
      const { top_LISTS } = await FETCH_myTopLists(z_user?.id || "");

      if (!top_LISTS)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_myTopLists' returned undefined 'top_LISTS' array, although no error was thrown",
        });

      // ---------------------------------------------------------
      // Fetch total user list count
      const { totalList_COUNT } = await FETCH_totalUserListCount(
        z_user?.id || ""
      );

      // ---------------------------------------------------------
      // Fetch marked vocab count
      const { savedVocab_COUNT } = await FETCH_savedUserVocabCount(
        z_user?.id || ""
      );

      // ---------------------------------------------------------
      // Fetch total vocab count
      const { allVocab_COUNT } = await FETCH_totalUserVocabCount(
        z_user?.id || ""
      );

      // ---------------------------------------------------------
      // Fetch deleted vocab count
      const { deletedVocab_COUNT } = await FETCH_deletedUserVocabCount(
        z_user?.id || ""
      );

      SET_myStarterContent({
        top_LISTS,
        totalList_COUNT,
        savedVocab_COUNT,
        allVocab_COUNT,
        deletedVocab_COUNT,
      });
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      SET_error(err);
      SEND_internalError(err);
    } finally {
      SET_loading("none");
    }
  }, [SET_error, SET_loading, SET_myStarterContent, z_user?.id]);

  return { REFETCH_myStarterContent: _REFETCH_myStarterContent };
}
