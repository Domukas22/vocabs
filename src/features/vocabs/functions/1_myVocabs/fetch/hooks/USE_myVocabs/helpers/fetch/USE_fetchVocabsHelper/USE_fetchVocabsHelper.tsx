//
//
//

import { VOCAB_PAGINATION } from "@/src/constants/globalVars";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_zustand, USE_abortController } from "@/src/hooks";
import { loadingState_TYPES } from "@/src/types";
import { useCallback, useState } from "react";
import { FETCH_myVocabs } from "../../../../../FETCH_myVocabs/FETCH_myVocabs";
import { USE_vocabs_FETCH_TYPES } from "../../../../../FETCH_myVocabs/types";
import { myVocabsReducerState_PROPS } from "../../reducer/myVocabs_REDUCER/myVocabs_REDUCER";

export default function USE_fetchVocabsHelper({
  type,
  search,
  targetList_ID,
  state,
  UPDATE_state,
  SET_loadingState,
  SET_error,
}: {
  type: USE_vocabs_FETCH_TYPES;
  search: string;
  targetList_ID?: string | undefined;
  state: myVocabsReducerState_PROPS;
  UPDATE_state: (data: {
    vocabs: Vocab_MODEL[];
    unpaginated_COUNT: number;
  }) => void;
  SET_error: (err: { value: boolean; msg: string }) => void;
  SET_loadingState: (fetch_TYPE: loadingState_TYPES) => void;
}) {
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { startNewRequest } = USE_abortController();

  const [count, setCount] = useState(0);

  const FETCH = useCallback(
    async (fetch_TYPE: loadingState_TYPES) => {
      const abortController = startNewRequest();
      try {
        SET_loadingState(fetch_TYPE);
        SET_error({ value: false, msg: "" });

        setCount(0);

        const { data, error } = await FETCH_myVocabs({
          type,
          search,
          amount: VOCAB_PAGINATION || 20,
          user_id: z_user?.id || "",
          excludeIds:
            fetch_TYPE === "loading_more" ? state.data?.printed_IDS : new Set(),
          targetList_ID,
          z_vocabDisplay_SETTINGS,
        });

        if (abortController.signal.aborted) return null;

        if (error || !data) {
          throw error || new Error("Failed to fetch vocabs.");
        }

        if (data) {
          UPDATE_state(data);
        }
      } catch {
        if (!abortController.signal.aborted) {
          SET_error({
            value: true,
            msg: `Some kind of error occurred while loading the vocabs. This error has been recorded and will be reviewed by developers shortly. If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.`,
          });
          SET_loadingState("error");
        }
      } finally {
        if (!abortController.signal.aborted) {
          SET_loadingState("none");
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

  return { FETCH };
}
