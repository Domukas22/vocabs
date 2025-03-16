//
//
//

import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError, VIBRATE } from "@/src/utils";
import { useCallback, useState } from "react";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_collectMyVocabsLangIds } from "../../fetchControls/USE_controlMyVocabsFetch/USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";



const function_NAME = "USE_createVocab";

export function USE_createVocab() {
  const { z_user } = z_USE_user();

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

   const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);
    const [createVocab_ERROR, SET_createVocabError] = useState<
      General_ERROR | FormInput_ERROR | undefined
    >();

  const _HARDDELETE_vocab = useCallback(async (vocab: ) => {
    try {

      if (IS_creatingVocab) return;
      SET_createVocabError(undefined)
      SET_isCreatingVocab(true)

      // --------------------------------------------------
      // Proceed to create vocab
      await HARDDELETE_vocab(vocab_ID, z_user?.id || "");

      // --------------------------------------------------
      // Update starter page
      await REFETCH_myStarterContent();

      // Update UI
      z_REMOVE_vocabFromMyVocabsList(vocab_ID);

      await RECOLLECT_langIds({
        fetch_TYPE: z_fetch_TYPE,
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

      SET_createVocabError(err)
      SEND_internalError(err);
    } finally {
      SET_isCreatingVocab(true)
    }
  }, [IS_creatingVocab]);

  return { HARDDELETE_vocab: _HARDDELETE_vocab };
}
