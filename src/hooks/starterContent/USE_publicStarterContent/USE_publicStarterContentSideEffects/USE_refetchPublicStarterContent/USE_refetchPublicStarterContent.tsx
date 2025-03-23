//
//
//

import { Dispatch, SetStateAction, useCallback } from "react";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { FETCH_totalPublicVocabCount } from "./FETCH_totalPublicVocabCount/FETCH_totalPublicVocabCount";

import { FETCH_totalPublicListCount } from "./FETCH_totalPublicListCount/FETCH_totalPublicListCount";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { SET_publicStarterContent_PROPS } from "../../USE_setPublicStarterContent/USE_setPublicStarterContent";
import { FETCH_topPublicLists } from "./FETCH_topPublicLists/FETCH_topPublicLists";
import { FETCH_topPublicVocabs } from "./FETCH_topPublicVocabs/FETCH_topPublicVocabs";

const function_NAME = "USE_refetchPublicStarterContent";

export default function USE_refetchPublicStarterContent({
  SET_error = () => {},
  SET_loading = () => {},
  SET_publicStarterContent = () => {},
}: {
  SET_error: Dispatch<SetStateAction<General_ERROR | undefined>>;
  SET_loading: Dispatch<SetStateAction<starterContentLoading_TYPE>>;
  SET_publicStarterContent: (props: SET_publicStarterContent_PROPS) => void;
}) {
  const _REFETCH_publicStarterContent = useCallback(async () => {
    try {
      // ---------------------------------------------------------
      // Fetch top lists
      const { top_LISTS } = await FETCH_topPublicLists();

      if (!top_LISTS)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_topPublicLists' returned undefined 'top_LISTS' array, although no error was thrown",
        });

      // ---------------------------------------------------------
      // Fetch top  vocabs
      const { top_VOCABS } = await FETCH_topPublicVocabs();

      if (!top_VOCABS)
        throw new General_ERROR({
          function_NAME,
          message:
            "'FETCH_topPublicVocabs' returned undefined 'top_VOCABS' array, although no error was thrown",
        });

      // ---------------------------------------------------------
      // Fetch total public list count
      const { totalList_COUNT } = await FETCH_totalPublicListCount();

      // ---------------------------------------------------------
      // Fetch total public vocab count
      const { totalVocab_COUNT } = await FETCH_totalPublicVocabCount();

      SET_publicStarterContent({
        top_LISTS,
        top_VOCABS,
        totalList_COUNT,
        totalVocab_COUNT,
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
  }, [SET_error, SET_loading, SET_publicStarterContent]);

  return { REFETCH_publicStarterContent: _REFETCH_publicStarterContent };
}
