//
//
//

import { useCallback } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { FETCH_totalPublicVocabCount } from "./FETCH_totalPublicVocabCount/FETCH_totalPublicVocabCount";
import { z_USE_publicStarterContent } from "../z_USE_publicStarterContent";
import { FETCH_top5PublicLists } from "./FETCH_top5PublicLists/FETCH_top5PublicLists";
import { FETCH_top5PublicVocabs } from "./FETCH_top5PublicVocabs/FETCH_top5PublicVocabs";
import { FETCH_totalPublicListCount } from "./FETCH_totalPublicListCount/FETCH_totalPublicListCount";

const function_NAME = "USE_refetchPublicStarterContent";

export default function USE_refetchPublicStarterContent() {
  const {
    z_IS_publicStarterInitialFetchDone,
    z_SET_publicStarterContentRefetch,
    z_SET_publicStarterContent,
    z_SET_publicStarterContentFetch_ERROR,
    z_SET_publicStarterInitialFetchToTrue,
  } = z_USE_publicStarterContent();

  const _REFETCH_publicStarterContent = useCallback(
    async (IS_initialFetch: boolean = false) => {
      // If initial fetch re-triggers, eventhough the it was completed, don't fetch again.
      if (IS_initialFetch && z_IS_publicStarterInitialFetchDone) return;
      try {
        if (!IS_initialFetch) {
          z_SET_publicStarterContentRefetch(true);
        }

        // ---------------------------------------------------------
        // Fetch top 5 lists
        const { top5_LISTS } = await FETCH_top5PublicLists();

        if (!top5_LISTS)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_top5PublicLists' returned undefined 'top5_LISTS' array, although no error was thrown",
          });

        // ---------------------------------------------------------
        // Fetch top 5 vocabs
        const { top5_VOCABS } = await FETCH_top5PublicVocabs();

        if (!top5_VOCABS)
          throw new General_ERROR({
            function_NAME,
            message:
              "'FETCH_top5PublicVocabs' returned undefined 'top5_VOCABS' array, although no error was thrown",
          });

        // ---------------------------------------------------------
        // Fetch total public list count
        const { totalList_COUNT } = await FETCH_totalPublicListCount();

        // ---------------------------------------------------------
        // Fetch total public vocab count
        const { totalVocab_COUNT } = await FETCH_totalPublicVocabCount();

        z_SET_publicStarterContent({
          top5_LISTS,
          top5_VOCABS,
          totalList_COUNT,
          totalVocab_COUNT,
        });

        if (IS_initialFetch) z_SET_publicStarterInitialFetchToTrue();
      } catch (error: any) {
        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        z_SET_publicStarterContentFetch_ERROR(err);
        SEND_internalError(err);
      } finally {
        z_SET_publicStarterContentRefetch(false);
      }
    },
    []
  );

  return { REFETCH_publicStarterContent: _REFETCH_publicStarterContent };
}
