import { useEffect, useMemo, useState } from "react";
import FetchLists_QUERY from "../utils/FetchLists_QUERY";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { z_listDisplaySettings_PROPS } from "@/src/zustand";
import Delay from "@/src/utils/Delay";

export default function USE_myLists({
  search,
  user_id,
  z_listDisplay_SETTINGS,
  paginateBy = 10,
}: {
  search: string;
  user_id: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  paginateBy: number;
}) {
  const [lists, SET_lists] = useState<List_MODEL[]>([]);
  const [totalFilteredLists_COUNT, SET_totalListCount] = useState<number>(0);
  const [ARE_listsFetching, SET_listsFetching] = useState(false);
  const [fetchLists_ERROR, SET_error] = useState<string | null>(null);
  const [IS_loadingMore, SET_loadingMore] = useState(false);
  const [printed_IDS, SET_printedIds] = useState(new Set<string>());

  const HAS_reachedEnd = useMemo(
    () => lists.length >= totalFilteredLists_COUNT,
    [lists, totalFilteredLists_COUNT]
  );

  useEffect(() => {
    resetLists();
    fetchLists({ printed: new Set<string>(), resetTotal: true });
  }, [search, z_listDisplay_SETTINGS]);

  const resetLists = () => {
    SET_lists([]);
    SET_printedIds(new Set<string>());
    SET_totalListCount(0);
  };

  const fetchLists = async ({
    printed = new Set<string>(),
    resetTotal = false,
  }: {
    printed: Set<string>;
    resetTotal?: boolean;
  }) => {
    if (!user_id) {
      SET_error("🔴 User ID is required to fetch lists. 🔴");
      SET_lists([]);
      return;
    }

    SET_listsFetching(true);
    SET_error(null);

    try {
      if (resetTotal) await EDIT_filteredListCount();
      const new_LISTS = await GET_lists(printed);

      new_LISTS.forEach((list) => {
        SET_printedIds((prev) => new Set(prev).add(list.id));
      });

      SET_lists((prev) => [...prev, ...new_LISTS]);
    } catch (error) {
      console.error("🔴 Unexpected error fetching lists:", error);
      SET_error("🔴 Unexpected error occurred. 🔴");
    } finally {
      SET_listsFetching(false);
    }
  };

  const GET_lists = async (printed: Set<string>) => {
    const queries = FetchLists_QUERY({
      search,
      user_id,
      z_listDisplay_SETTINGS,
      excludeIds: printed,
      amount: paginateBy,
    });
    return await queries.fetch();
  };

  const EDIT_filteredListCount = async () => {
    const countQuery = FetchLists_QUERY({
      search,
      user_id,
      z_listDisplay_SETTINGS,
      fetchOnlyForCount: true,
    });

    const total = await countQuery.fetchCount();
    SET_totalListCount(total);
  };

  const LOAD_more = async () => {
    if (HAS_reachedEnd) return;
    SET_loadingMore(true);

    await fetchLists({ printed: printed_IDS });
    SET_loadingMore(false);
  };

  const ADD_toDisplayed = (list: List_MODEL) => {
    SET_lists((prev) => [list, ...prev]);
    SET_printedIds((prev) => new Set(prev).add(list.id));
  };

  const REMOVE_fromDisplayed = (id: string) => {
    SET_lists((prev) => prev.filter((x) => x.id !== id));
    SET_printedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    EDIT_filteredListCount();
  };

  return {
    lists,
    IS_loadingMore,
    HAS_reachedEnd,
    fetchLists_ERROR,
    ARE_listsFetching,
    totalFilteredLists_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  };
}
