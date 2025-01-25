import { useCallback, useEffect, useMemo, useState } from "react";
import { FETCH_myVocabs } from "../../FETCH_myVocabs/FETCH_myVocabs";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  USE_zustand,
  z_vocabDisplaySettings_PROPS,
} from "@/src/hooks/USE_zustand/USE_zustand";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import {
  USE_abortController,
  USE_isSearching,
  USE_pagination,
} from "@/src/hooks";
import { Delay } from "@/src/utils";

export type USE_vocabs_FETCH_TYPES =
  | "byTargetList"
  | "allVocabs"
  | "deletedVocabs"
  | "marked";

let c = 0;

export function USE_myVocabs({
  type,
  search,
  IS_debouncing = false,
  targetList_ID,
}: {
  type: USE_vocabs_FETCH_TYPES;
  search: string;

  IS_debouncing: boolean;
  targetList_ID?: string | undefined;
}) {
  const [data, SET_data] = useState<Vocab_MODEL[]>([]);
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [IS_fetching, SET_fetching] = useState(false);
  const [error, SET_error] = useState<FlatlistError_PROPs>({
    value: false,
    msg: "",
  });
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const HAS_reachedEnd = useMemo(
    () => data?.length >= unpaginated_COUNT,
    [data, unpaginated_COUNT]
  );
  const IS_searching = USE_isSearching({
    IS_fetching,
    IS_debouncing,
    IS_loadingMore,
  });
  const errroMsg = useMemo(
    () =>
      `Some kind of error occurred while loading the vocabs. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
    []
  );
  const [printed_IDS, SET_printedIds] = useState(new Set<string>());

  const { startNewRequest } = USE_abortController();

  const fetch = useCallback(
    async (start: number) => {
      console.log("🟢 Fetching... 🟢");

      const abortController = startNewRequest();

      try {
        start > 0 ? SET_loadingMore(true) : SET_fetching(true);

        await Delay(5000);

        // Clear error at the beginning of a new fetch to avoid flickering
        SET_error({ value: false, msg: "" });

        const { data, error } = await FETCH_myVocabs({
          type,
          start,
          search,
          amount: VOCAB_PAGINATION || 20,
          user_id: z_user?.id,
          excludeIds: printed_IDS,
          targetList_ID,
          z_vocabDisplay_SETTINGS,
        });

        if (abortController.signal.aborted) {
          console.warn("🟡 Fetch vocabs request aborted 🟡");
          return;
        }

        if (error || !data) {
          SET_error(error);
        } else {
          SET_data((prev) => [...prev, ...data.vocabs]);
          SET_unpaginatedCount(data.totalCount);
        }
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          console.error("🔴 Error in USE_myVocabs: 🔴", error);
          SET_error({
            value: true,
            msg: errroMsg,
          });
        }
      } finally {
        if (!abortController.signal.aborted) {
          SET_loadingMore(false);
          SET_fetching(false);
          console.log("🟢 Done 🟢");
        }
      }
    },
    [search, z_vocabDisplay_SETTINGS, z_user?.id, targetList_ID]
  );

  const { RESET_pagination, paginate } = USE_pagination({
    paginateBy: VOCAB_PAGINATION || 20,
    fetch,
  });

  const ADD_toDisplayed = (vocab: Vocab_MODEL) => {
    SET_data((prev) => [vocab, ...prev]);
    SET_printedIds((prev) => new Set(prev).add(vocab.id));
    SET_unpaginatedCount((prev) => prev + 1);
  };

  const REMOVE_fromDisplayed = (id: string) => {
    if (data?.length === 1 && data?.[0].id === id) {
      SET_data([]);
      RESET_pagination();
      return;
    }

    SET_data((prev) => prev.filter((x) => x.id !== id));
    SET_printedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    SET_unpaginatedCount((prev) => prev - 1);
  };

  useEffect(() => {
    SET_data([]);
    RESET_pagination();
  }, [search, z_vocabDisplay_SETTINGS, targetList_ID]);

  return {
    data,
    error,
    IS_searching,
    HAS_reachedEnd,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more: paginate,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  };
}

//////////////
//
//
