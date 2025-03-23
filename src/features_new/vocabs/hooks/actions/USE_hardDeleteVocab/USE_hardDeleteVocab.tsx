//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback } from "react";
import { USE_zustand } from "@/src/hooks";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import { USE_recollectListLangIds } from "@/src/features_new/lists/hooks/actions/USE_recollectListLangIds/USE_recollectListLangIds";
import { HARDDELETE_vocab } from "./HARDDELETE_vocab/HARDDELETE_vocab";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_collectMyVocabsLangIds } from "../../fetchControls/USE_controlMyVocabsFetch/USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";
import { Vocab_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "USE_hardDeleteVocab";

export function USE_hardDeleteVocab() {
  const { z_user } = z_USE_user();
  const { IS_inAction, ADD_currentAction, REMOVE_currentAction } =
    z_USE_currentActions();

  const { REFETCH_myStarterContent } = USE_refetchStarterContent();
  const {
    z_REMOVE_vocab: z_REMOVE_vocabFromMyVocabsList,
    z_SET_error,
    z_SET_langIds,
    z_fetch_TYPE,
  } = z_USE_myVocabs();
  const { TOAST } = USE_toast();

  const { RECOLLECT_langIds } = USE_collectMyVocabsLangIds({
    z_SET_error,
    z_SET_langIds,
  });

  const _HARDDELETE_vocab = useCallback(async (vocab_ID: string) => {
    try {
      // --------------------------------------------------
      // Check if item is already in action
      if (IS_inAction("vocab", vocab_ID, "deleting")) return;

      // --------------------------------------------------
      // Insert action
      ADD_currentAction("vocab", vocab_ID, "deleting");

      // --------------------------------------------------
      // Proceed to hard delete
      await HARDDELETE_vocab(vocab_ID, z_user?.id || "");

      // --------------------------------------------------

      // Update UI
      Vocab_EVENTS.emit("deleted", { vocab_ID, list_ID: "" });

      await RECOLLECT_langIds({
        fetch_TYPE: "deleted",
        targetList_ID: "",
        user_ID: z_user?.id || "",
      });

      // Provide sensory user feedback
      TOAST("success", t("notification.vocabDeletedForever"));
      VIBRATE("soft");

      // -----------------------------
    } catch (error: any) {
      const err = new General_ERROR({
        function_NAME: error?.function_NAME || function_NAME,
        message: error?.message,
        errorToSpread: error,
      });

      SEND_internalError(err);
    } finally {
      REMOVE_currentAction(vocab_ID, "deleting");
    }
  }, []);

  return { HARDDELETE_vocab: _HARDDELETE_vocab };
}
