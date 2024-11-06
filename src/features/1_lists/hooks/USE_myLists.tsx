import { useCallback, useEffect, useMemo, useState } from "react";
import FetchLists_QUERY from "../utils/FetchLists_QUERY";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import Delay from "@/src/utils/Delay";
import { FlatlistError_PROPS } from "@/src/props";
import USE_isSearching from "@/src/hooks/USE_isSearching";
import { LIST_PAGINATION } from "@/src/constants/globalVars";
import USE_pagination from "@/src/hooks/USE_pagination";
import FETCH_lists from "../utils/FetchLists_QUERY";

export function USE_lists({
  search,
  user_id,
  IS_debouncing = false,
  z_listDisplay_SETTINGS,
}: {
  search: string;
  user_id: string | undefined;
  IS_debouncing: boolean;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
}) {
  const [data, SET_data] = useState<List_MODEL[]>([]);
  const [printed_IDS, SET_printedIds] = useState(new Set<string>());
  const [unpaginated_COUNT, SET_unpaginatedCount] = useState<number>(0);
  const [IS_fetching, SET_fetching] = useState(false);
  const [error, SET_error] = useState<FlatlistError_PROPS>({
    value: false,
    msg: "",
  });
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

  const fetch = useCallback(
    async (start: number) => {
      start > 0 ? SET_loadingMore(true) : SET_fetching(true);
      // Clear error at the beginning of a new fetch to avoid flickering
      SET_error({ value: false, msg: "" });

      try {
        const { lists, count, error } = await FETCH_lists({
          search,
          user_id,
          amount: LIST_PAGINATION || 20,
          z_listDisplay_SETTINGS,
          excludeIds: printed_IDS,
        });

        if (error.value) {
          SET_error(error);
          // SET_data([]);
          // SET_unpaginatedCount(0);
        } else {
          SET_data((prev) => [...prev, ...lists]);
          SET_unpaginatedCount(count || 0);
        }
      } catch (error: any) {
        console.error("🔴 Error in USE_lists: 🔴", error);
        SET_error({
          value: true,
          msg: errroMsg,
        });
      } finally {
        SET_loadingMore(false);
        SET_fetching(false);
      }
    },
    [search, z_listDisplay_SETTINGS, user_id]
  );

  const { RESET_pagination, paginate } = USE_pagination({
    paginateBy: LIST_PAGINATION || 20,
    fetch,
  });

  const ADD_toDisplayed = (vocab: List_MODEL) => {
    SET_data((prev) => [vocab, ...prev]);
    SET_printedIds((prev) => new Set(prev).add(vocab.id));
    SET_unpaginatedCount((prev) => prev + 1);
  };

  const REMOVE_fromDisplayed = (id: string) => {
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
  }, [search, z_listDisplay_SETTINGS]);

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
