//
//
//

import { useCallback } from "react";
import { z_USE_myStarterContent } from "../z_USE_myStarterContent";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { USE_zustand } from "../../USE_zustand/USE_zustand";
import { FETCH_top3Lists } from "./FETCH_top3Lists/FETCH_top3Lists";
import { FETCH_totalUserVocabCount } from "./FETCH_totalUserVocabCount/FETCH_totalUserVocabCount";
import { FETCH_savedUserVocabCount } from "./FETCH_savedUserVocabCount/FETCH_savedUserVocabCount";
import { FETCH_deletedUserVocabCount } from "./FETCH_deletedUserVocabCount/FETCH_deletedUserVocabCount";
import { FETCH_totalUserListCount } from "./FETCH_totalUserListCount/FETCH_totalUserListCount";

const function_NAME = "USE_refetchStarterContent";

export default function USE_refetchStarterContent() {
  const { z_user } = USE_zustand();
  const {
    z_IS_myStarterInitialFetchDone,
    z_SET_myStarterContentRefetch,
    z_SET_myStarterContent,
    z_SET_myStarterContentFetch_ERROR,
    z_SET_myStarterInitialFetchToTrue,
  } = z_USE_myStarterContent();

  const _REFETCH_myStarterContent = useCallback(
    async (IS_initialFetch: boolean = false) => {
      // If initial fetch re-triggers, eventhough the it was completed, don't fetch again.
      if (IS_initialFetch && z_IS_myStarterInitialFetchDone) return;
      try {
        if (!IS_initialFetch) {
          z_SET_myStarterContentRefetch(true);
        }

        // ---------------------------------------------------------
        // Fetch top 3 lists
        const { top3_LISTS } = await FETCH_top3Lists(z_user?.id || "");

        if (!top3_LISTS)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_top3Lists' returned undefined 'top3_LISTS' array, although no error was thrown",
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
        const { totalVocab_COUNT } = await FETCH_totalUserVocabCount(
          z_user?.id || ""
        );

        // ---------------------------------------------------------
        // Fetch deleted vocab count
        const { deletedVocab_COUNT } = await FETCH_deletedUserVocabCount(
          z_user?.id || ""
        );

        z_SET_myStarterContent({
          allVocab_COUNT: totalVocab_COUNT,
          savedVocab_COUNT,
          softDeleltedVocab_COUNT: deletedVocab_COUNT,
          top3_LISTS,
          z_myStarterTotalListCount: totalList_COUNT,
        });

        if (IS_initialFetch) z_SET_myStarterInitialFetchToTrue();
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        z_SET_myStarterContentFetch_ERROR(err);
        SEND_internalError(err);
      } finally {
        z_SET_myStarterContentRefetch(false);
      }
    },
    []
  );

  return { REFETCH_myStarterContent: _REFETCH_myStarterContent };
}
