import { useCallback, useEffect, useReducer, useMemo, useState } from "react";
import { FETCH_myVocabs } from "../../FETCH_myVocabs/FETCH_myVocabs";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_zustand } from "@/src/hooks/USE_zustand/USE_zustand";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import { USE_abortController, USE_isSearching } from "@/src/hooks";
import { Delay } from "@/src/utils";

export type USE_vocabs_FETCH_TYPES =
  | "byTargetList"
  | "allVocabs"
  | "deletedVocabs"
  | "marked";

export type loadingState_TYPES =
  | "loading"
  | "searching"
  | "filtering"
  | "loading_more"
  | "error"
  | "none";

// types/state.ts
export type State = {
  data: Vocab_MODEL[];
  unpaginated_COUNT: number;
  error: { value: boolean; msg: string };
  printed_IDS: Set<string>;
  loading_STATE: loadingState_TYPES;
};

// Actions
export type Action =
  | { type: "SET_DATA"; payload: Vocab_MODEL[] }
  | { type: "ADD_DATA"; payload: Vocab_MODEL[] }
  | { type: "SET_UNPAGINATED_COUNT"; payload: number }
  | { type: "SET_ERROR"; payload: { value: boolean; msg: string } }
  | { type: "ADD_PRINTED_ID"; payload: string }
  | { type: "REMOVE_PRINTED_ID"; payload: string }
  | { type: "SET_LOADING_STATE"; payload: loadingState_TYPES }
  | { type: "SET_TOTAL"; payload: number } // Action for total
  | { type: "RESET_STATE" };

//////////////////////////////////////////////////////////////////////////////////

export const initialState: State = {
  data: [],
  unpaginated_COUNT: 0,
  error: { value: false, msg: "" },
  printed_IDS: new Set(),
  loading_STATE: "none",
};

export function vocabReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "ADD_DATA":
      return { ...state, data: [...state.data, ...action.payload] };
    case "SET_UNPAGINATED_COUNT":
      return { ...state, unpaginated_COUNT: action.payload };
    case "SET_LOADING_STATE":
      return { ...state, loading_STATE: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_PRINTED_ID":
      return {
        ...state,
        printed_IDS: new Set([...state.printed_IDS, action.payload]), // Spread syntax to ensure a new Set is created
      };
    case "REMOVE_PRINTED_ID":
      const updatedSet = new Set(state.printed_IDS);
      updatedSet.delete(action.payload);
      return { ...state, printed_IDS: updatedSet };

    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

//////////////////////////////////////////////////////////////////////////////////

export const HELP_fetchMyVocabs = async ({
  type,
  search,
  amount,
  user_id,
  excludeIds,
  targetList_ID,
  vocabDisplaySettings,
  abortController,
}: {
  type: USE_vocabs_FETCH_TYPES;
  search: string;
  amount: number;
  user_id?: string;
  excludeIds: Set<string>;
  targetList_ID?: string;
  vocabDisplaySettings: any;
  abortController: AbortController;
}) => {
  const { data, error } = await FETCH_myVocabs({
    type,
    search,
    amount,
    user_id: user_id || "",
    excludeIds,
    targetList_ID,
    z_vocabDisplay_SETTINGS: vocabDisplaySettings,
  });

  if (abortController.signal.aborted) return null;

  if (error || !data) {
    throw error || new Error("Failed to fetch vocabs.");
  }

  return data;
};

//////////////////////////////////////////////////////////////////////////////////

const errorMsg = `Some kind of error occurred while loading the vocabs. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`;

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
  const [state, dispatch] = useReducer(vocabReducer, initialState);
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { startNewRequest } = USE_abortController();

  const HAS_reachedEnd = useMemo(
    () => state.data?.length >= state.unpaginated_COUNT,
    [state.data, state.unpaginated_COUNT]
  );

  console.log("state: ", state.loading_STATE);

  const fetch = useCallback(
    async (
      fetch_TYPE: "re-fetch" | "search" | "re-sort" | "re-filter" | "load-more"
    ) => {
      const abortController = startNewRequest();
      try {
        // Set loading states based on printed_IDS size
        switch (fetch_TYPE) {
          case "re-fetch":
            dispatch({ type: "SET_LOADING_STATE", payload: "loading" });
            break;
          case "re-sort":
            dispatch({ type: "SET_LOADING_STATE", payload: "sorting" });
            break;
          case "re-filter":
            dispatch({ type: "SET_LOADING_STATE", payload: "filtering" });
            break;
          case "load-more":
            dispatch({ type: "SET_LOADING_STATE", payload: "loading_more" });
            break;
          case "search":
            dispatch({ type: "SET_LOADING_STATE", payload: "searching" });
            break;
        }

        await Delay(2000);
        dispatch({ type: "SET_ERROR", payload: { value: false, msg: "" } });

        const data = await HELP_fetchMyVocabs({
          type,
          search,
          amount: VOCAB_PAGINATION || 20,
          user_id: z_user?.id,
          excludeIds: fetch_TYPE === "re-fetch" ? new Set() : state.printed_IDS,
          targetList_ID,
          vocabDisplaySettings: z_vocabDisplay_SETTINGS,
          abortController,
        });

        if (data) {
          dispatch({ type: "ADD_DATA", payload: data.vocabs });
          dispatch({ type: "SET_UNPAGINATED_COUNT", payload: data.totalCount });

          // Update printed_IDS with new IDs
          data.vocabs.forEach((vocab) => {
            dispatch({ type: "ADD_PRINTED_ID", payload: vocab.id });
          });
        }
      } catch {
        if (!abortController.signal.aborted) {
          dispatch({
            type: "SET_ERROR",
            payload: { value: true, msg: errorMsg },
          });
          dispatch({ type: "SET_LOADING_STATE", payload: "error" });
        }
      } finally {
        if (!abortController.signal.aborted) {
          dispatch({ type: "SET_LOADING_STATE", payload: "none" });
        }
      }
    },
    [
      search,
      z_vocabDisplay_SETTINGS.difficultyFilters,
      z_vocabDisplay_SETTINGS.langFilters,
      z_vocabDisplay_SETTINGS.sortDirection,
      z_vocabDisplay_SETTINGS.sorting,
      z_user?.id,
      targetList_ID,
      state.printed_IDS,
    ]
  );

  useEffect(() => {
    const triggerFetch = () => {
      dispatch({ type: "RESET_STATE" });

      if (search) {
        fetch("search");
      } else if (
        z_vocabDisplay_SETTINGS.difficultyFilters?.length ||
        z_vocabDisplay_SETTINGS.langFilters?.length
      ) {
        fetch("re-filter");
      } else if (targetList_ID) {
        fetch("re-fetch");
      }
    };

    triggerFetch();
  }, [
    search,
    z_vocabDisplay_SETTINGS.difficultyFilters,
    z_vocabDisplay_SETTINGS.langFilters,
    z_vocabDisplay_SETTINGS.sortDirection,
    z_vocabDisplay_SETTINGS.sorting,
    targetList_ID,
  ]);

  return {
    data: state.data,
    error: state.error,
    loading_STATE: state.loading_STATE,
    unpaginated_COUNT: state.unpaginated_COUNT, // Now using state.total
    LOAD_more: () => {
      if (state.loading_STATE !== "loading_more") {
        fetch("load-more");
      }
    },
    HAS_reachedEnd,
    ADD_toDisplayed: (vocab: Vocab_MODEL) => {
      dispatch({ type: "ADD_DATA", payload: [vocab] });
      dispatch({ type: "ADD_PRINTED_ID", payload: vocab.id });
      dispatch({
        type: "SET_UNPAGINATED_COUNT",
        payload: state.unpaginated_COUNT + 1,
      });
    },
    REMOVE_fromDisplayed: (id: string) => {
      dispatch({
        type: "SET_DATA",
        payload: state.data.filter((vocab) => vocab.id !== id),
      });
      dispatch({ type: "REMOVE_PRINTED_ID", payload: id });
      dispatch({
        type: "SET_UNPAGINATED_COUNT",
        payload: state.unpaginated_COUNT - 1,
      });
    },
  };
}
