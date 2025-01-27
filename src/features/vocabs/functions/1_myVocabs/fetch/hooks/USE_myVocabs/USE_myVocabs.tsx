import { useCallback, useEffect, useReducer, useMemo } from "react";
import { FETCH_myVocabs } from "../../FETCH_myVocabs/FETCH_myVocabs";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_zustand } from "@/src/hooks/USE_zustand/USE_zustand";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import { USE_abortController } from "@/src/hooks";
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
  | "searching_and_filtering"
  | "loading_more"
  | "error"
  | "none";

// types/state.ts
export type State = {
  data: {
    vocabs: Vocab_MODEL[];
    printed_IDS: Set<string>;
    unpaginated_COUNT: number;
  };
  error: { value: boolean; msg: string };
  loading_STATE: loadingState_TYPES;
};

// Actions
export type Action =
  | { type: "ADD_VOCAB"; payload: Vocab_MODEL }
  | {
      type: "UPDATE_STATE";
      payload: { vocabs: Vocab_MODEL[]; unpaginated_COUNT: number };
    }
  | { type: "REMOVE_VOCAB"; payload: string }
  | { type: "SET_LOADING_STATE"; payload: loadingState_TYPES }
  | { type: "SET_ERROR"; payload: { value: boolean; msg: string } }
  | { type: "RESET_STATE" };

//////////////////////////////////////////////////////////////////////////////////

export const initialState: State = {
  data: {
    vocabs: [],
    printed_IDS: new Set(),
    unpaginated_COUNT: 0,
  },
  error: { value: false, msg: "" },
  loading_STATE: "none",
};

export function vocabReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING_STATE":
      return { ...state, loading_STATE: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "UPDATE_STATE":
      const updatedVocabs = [...state.data.vocabs, ...action.payload.vocabs];
      const updatedPrintedIds = new Set(state.data.printed_IDS);
      action.payload?.vocabs?.forEach((vocab) =>
        updatedPrintedIds.add(vocab.id)
      );

      return {
        ...state,
        data: {
          vocabs: updatedVocabs,
          printed_IDS: updatedPrintedIds,
          unpaginated_COUNT: action.payload?.unpaginated_COUNT,
        },
      };
    case "ADD_VOCAB":
      const newVocabs = [action.payload, ...state.data.vocabs];
      const updatedIds = new Set(state.data.printed_IDS);
      updatedIds.add(action.payload.id);

      return {
        ...state,
        data: {
          vocabs: newVocabs,
          printed_IDS: updatedIds,
          unpaginated_COUNT: state.data.unpaginated_COUNT + 1,
        },
      };

    case "REMOVE_VOCAB": {
      const updatedVocabs = state.data.vocabs.filter(
        (vocab) => vocab.id !== action.payload
      );
      const updatedPrintedIds = new Set(state.data.printed_IDS);
      updatedPrintedIds.delete(action.payload);

      return {
        ...state,
        data: {
          vocabs: updatedVocabs,
          printed_IDS: updatedPrintedIds,
          unpaginated_COUNT: state.data.unpaginated_COUNT - 1,
        },
      };
    }

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

  const ALLOW_action = useMemo(
    () => state.loading_STATE === "none",
    [state.loading_STATE]
  );

  const HAS_reachedEnd = useMemo(
    () => state.data?.vocabs?.length >= state.data?.unpaginated_COUNT,
    [state.data?.vocabs, state.data?.unpaginated_COUNT]
  );

  const REMOVE_fromDisplayed = useCallback(
    (id: string) => {
      if (!ALLOW_action) return;
      dispatch({ type: "REMOVE_VOCAB", payload: id });
    },
    [state]
  );

  const ADD_toDisplayed = useCallback(
    (vocab: Vocab_MODEL) => {
      if (!ALLOW_action) return;
      dispatch({ type: "ADD_VOCAB", payload: vocab });
    },
    [state]
  );

  const LOAD_more = useCallback(() => {
    if (!ALLOW_action) return;
    fetch("loading_more");
  }, [state]);

  const fetch = useCallback(
    async (fetch_TYPE: loadingState_TYPES) => {
      const abortController = startNewRequest();
      try {
        dispatch({ type: "SET_LOADING_STATE", payload: fetch_TYPE });

        // await Delay(2000);
        dispatch({ type: "SET_ERROR", payload: { value: false, msg: "" } });

        const data = await HELP_fetchMyVocabs({
          type,
          search,
          amount: VOCAB_PAGINATION || 20,
          user_id: z_user?.id,
          excludeIds:
            fetch_TYPE !== "loading_more" ? new Set() : state.data?.printed_IDS,
          targetList_ID,
          vocabDisplaySettings: z_vocabDisplay_SETTINGS,
          abortController,
        });

        if (data) {
          dispatch({ type: "UPDATE_STATE", payload: data });
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
      state.data?.printed_IDS,
    ]
  );

  useEffect(() => {
    dispatch({ type: "RESET_STATE" });

    const HAS_filters =
      z_vocabDisplay_SETTINGS.difficultyFilters?.length ||
      z_vocabDisplay_SETTINGS.langFilters?.length;

    if (search && HAS_filters) {
      fetch("searching_and_filtering");
    } else if (search) {
      fetch("searching");
    } else if (HAS_filters) {
      fetch("filtering");
    } else if (targetList_ID) {
      fetch("loading");
    }
  }, [
    search,
    z_vocabDisplay_SETTINGS.difficultyFilters,
    z_vocabDisplay_SETTINGS.langFilters,
    z_vocabDisplay_SETTINGS.sortDirection,
    z_vocabDisplay_SETTINGS.sorting,
    targetList_ID,
  ]);

  return {
    vocabs: state.data?.vocabs,
    fetchVocabs_ERROR: state.error,
    loading_STATE: state.loading_STATE,
    unpaginated_COUNT: state.data?.unpaginated_COUNT, // Now using state.total
    HAS_reachedEnd,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  };
}
