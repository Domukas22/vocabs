//
//
//

import { useCallback, useEffect, useState } from "react";
import { Vocab_TYPE } from "../../types";
import { vocabFetch_TYPES } from "../../functions/FETCH_vocabs/types";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { General_ERROR } from "@/src/types/error_TYPES";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { z_USE_myVocabsDisplaySettings } from "../zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { USE_collectMyVocabsLangIds } from "../fetchControls/USE_controlMyVocabsFetch/USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";
import {
  USE_deleteVocabInTheUi,
  USE_createVocabInTheUi,
  USE_getVocabUiUpdateFunctions,
  USE_updateVocabInTheUi,
} from "./helpers";
import { USE_handleVocabFetch } from "./helpers/USE_handleVocabFetch/USE_handleVocabFetch";
import { USE_highlighedId } from "@/src/hooks";

export function USE_vocabs({
  search = "",
  fetch_TYPE = "all",
  targetList_ID = "",
  IS_private = false,
}: {
  search: string;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID?: string;
  IS_private: boolean;
}) {
  const { filters, sorting } = z_USE_myVocabsDisplaySettings();
  const { z_user } = z_USE_user();

  // -------------------------------------

  const [vocabs, SET_vocabs] = useState<Vocab_TYPE[]>([]);
  const [printed_IDS, SET_printedIds] = useState<Set<string>>(
    new Set<string>()
  );
  const [lang_IDS, SET_langIds] = useState<string[]>([]);
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [HAS_reachedEnd, SET_hasReachedEnd] = useState<boolean>(false);
  const [loading_STATE, SET_loadingState] =
    useState<loadingState_TYPES>("none");
  const [error, SET_error] = useState<General_ERROR>();
  const { highlight, highlighted_ID } = USE_highlighedId();

  // -------------------------------------------------

  const { RECOLLECT_langIds } = USE_collectMyVocabsLangIds({
    z_SET_error: SET_error,
    z_SET_langIds: SET_langIds,
  });

  // -----------------

  const PREPARE_vocabsFetch = useCallback(
    (_loading_STATE: loadingState_TYPES) => {
      SET_error(undefined);
      SET_loadingState(_loading_STATE);
    },
    [SET_error, SET_loadingState, loading_STATE]
  );

  const APPEND_vocabs = useCallback(
    (
      incoming_VOCABS: Vocab_TYPE[],
      unpaginated_COUNT: number,
      loadMore: boolean
    ) => {
      if (loadMore) {
        const withNewlyAppendedVocab_ARR = [...incoming_VOCABS, ...vocabs];

        SET_vocabs(withNewlyAppendedVocab_ARR);
        SET_unpaginatedCount(unpaginated_COUNT);
        SET_printedIds(new Set(withNewlyAppendedVocab_ARR.map((x) => x.id)));
        SET_hasReachedEnd(
          withNewlyAppendedVocab_ARR.length >= unpaginated_COUNT
        );
      } else {
        SET_vocabs(incoming_VOCABS);
        SET_unpaginatedCount(unpaginated_COUNT);
        SET_printedIds(new Set(incoming_VOCABS.map((x) => x.id)));
        SET_hasReachedEnd(incoming_VOCABS.length >= unpaginated_COUNT);
      }

      SET_loadingState("none");
    },
    []
  );

  const { FETCH_vocabs } = USE_handleVocabFetch({
    APPEND_vocabs,
    PREPARE_vocabsFetch,
    SET_error,
  });
  // -------------------------------------

  const _FETCH_vocabs = useCallback(
    async (loadMore: boolean = false) => {
      FETCH_vocabs({
        search,
        loadMore,
        fetch_TYPE,
        targetList_ID,
        filters,
        sorting,
        user_id: z_user?.id || "",
        excludeIds: loadMore ? printed_IDS : new Set(),
        IS_private,
      });
    },
    [filters, sorting, z_user?.id, printed_IDS, search]
  );

  ///////////
  //
  //

  useEffect(() => {
    (async () => await _FETCH_vocabs())();
  }, [search, filters, sorting, targetList_ID]);

  useEffect(() => {
    (async () => {
      await RECOLLECT_langIds({
        fetch_TYPE,
        targetList_ID,
        user_ID: z_user?.id || "",
      });
    })();
  }, [targetList_ID]);

  const LOAD_more = useCallback(async () => {
    (async () => await _FETCH_vocabs(true))();
  }, [_FETCH_vocabs]);

  const refetch = useCallback(async () => {
    (async () => await _FETCH_vocabs())();
  }, []);

  // -------------------------------------------------

  // import helper functions
  const {
    CREATE_oneVocabInTheUi,
    DELETE_oneVocabInTheUi,
    UPDATE_oneVocabInTheUi,
  } = USE_getVocabUiUpdateFunctions({
    vocabs,
    SET_vocabs,
    SET_unpaginatedCount,
    highlight,
  });

  // multiple useEffects for each update type
  USE_updateVocabInTheUi({ UPDATE_oneVocabInTheUi });
  USE_createVocabInTheUi({ CREATE_oneVocabInTheUi });
  USE_deleteVocabInTheUi({ DELETE_oneVocabInTheUi });

  // -------------------------------------------------

  return {
    vocabs,
    lang_IDS,
    unpaginated_COUNT,
    HAS_reachedEnd,
    error,
    loading_STATE,
    highlighted_ID,
    LOAD_more,
    refetch,
  };
}

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
