import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/src/lib/supabase";
import { z_vocabDisplaySettings_PROPS } from "@/src/zustand";
import FETCH_supabaseVocabs from "../features/2_vocabs/utils/FETCH_supabaseVocabs";
import { FetchedSharedList_PROPS } from "../features/1_lists/hooks/USE_supabaseLists";
import { FlatlistError_PROPS } from "../props";
import USE_pagination from "./USE_pagination";
import { VOCAB_PAGINATION } from "../constants/globalVars";
import USE_isSearching from "./USE_isSearching";

export type FetchedSupabaseVocabs_PROPS = {
  id: any;
  difficulty: any;
  description: any;
  trs: any;
  searchable: any;
  lang_ids: any;
  is_marked: any;
  user_id: any;
  list: {
    id: any;
    name: any;
  }[];
};

export default function USE_supabaseVocabs({
  type,
  search,
  targetList_ID,
  IS_debouncing,
  z_vocabDisplay_SETTINGS,
}: {
  type: "allPublicVocabs" | "byTargetList";
  search: string;
  IS_debouncing: boolean;
  targetList_ID?: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
}) {
  const [data, SET_data] = useState<FetchedSupabaseVocabs_PROPS[]>([]);
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

  // Create a ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // if 'fetchByList = true', we use 'targetList_ID', else we need to first fetch the list ids
  const [list_IDS, SET_listIds] = useState<string[]>(
    targetList_ID ? [targetList_ID] : []
  );

  // if "fetchByList" isn't defined, tha tmeans we are fetching all public vocabs from all public lists
  // else we set the list ids to a single id, which is the targetList_ID
  useEffect(() => {
    (async () => {
      if (type === "allPublicVocabs") {
        // fetch all public lists and insert their ids
        const { public_LISTS, error } = await FETCH_publicLists();

        if (error) {
          console.error("🔴 Error fetching public lists : 🔴", error);
          SET_error({
            value: true,
            msg: errroMsg,
          });
        }

        SET_listIds(public_LISTS?.map((l) => l.id) || []);
      } else if (type === "byTargetList") {
        // insert a single list id
        if (!targetList_ID) {
          // target list id already set as a default value
          console.error(
            "🔴 Tried fetching vocabs by list, but the target list ID is undefined 🔴"
          );
          SET_error({
            value: true,
            msg: errroMsg,
          });
        }
      }
    })();
  }, []);

  const fetch = useCallback(
    async (start: number, end: number) => {
      // Abort the previous fetch if it's still ongoing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      start > 0 ? SET_loadingMore(true) : SET_fetching(true);
      // Clear error at the beginning of a new fetch to avoid flickering
      SET_error({ value: false, msg: "" });

      try {
        const { vocabs, count, error } = await FETCH_supabaseVocabs({
          end,
          start,
          search,
          list_ids: list_IDS,
          z_vocabDisplay_SETTINGS,
          signal: abortController.signal, // Pass the abort signal here
        });

        if (abortController.signal.aborted) {
          // Prevent updates if the request was aborted
          return;
        }

        SET_data((prev) => [...prev, ...vocabs]);
        SET_unpaginatedCount(count || 0);
        // Only set error if it exists and request wasn’t aborted
        if (error) {
          SET_error(error);
        }
      } catch (error: any) {
        console.error("🔴 Error in USE_supabaseVocabs: 🔴", error);
        SET_error({
          value: true,
          msg: errroMsg,
        });
      } finally {
        SET_loadingMore(false);
        SET_fetching(false);
      }
    },
    [search, z_vocabDisplay_SETTINGS, list_IDS]
  );

  const { RESET_pagination, paginate } = USE_pagination({
    paginateBy: VOCAB_PAGINATION || 20,
    fetch,
  });

  useEffect(() => {
    SET_data([]);
    RESET_pagination();
  }, [search, z_vocabDisplay_SETTINGS, list_IDS]);

  return {
    data,
    error,
    IS_searching,
    HAS_reachedEnd,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more: paginate,
  };
}

async function FETCH_publicLists() {
  const { data, error } = await supabase
    .from("lists")
    .select("id")
    .eq("type", "public");

  return { public_LISTS: data || [], error };
}
