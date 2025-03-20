//
//
//

import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { HANDLE_formInputError, SEND_internalError } from "@/src/utils";
import { useCallback, useState } from "react";
import { z_USE_myVocabs } from "../../zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_collectMyVocabsLangIds } from "../../fetchControls/USE_controlMyVocabsFetch/USE_collectMyVocabsLangIds/USE_collectMyVocabsLangIds";
import {
  CREATE_oneVocab,
  CreateVocabUserContent_PROPS,
} from "./CREATE_oneVocab/CREATE_oneVocab";
import { USE_celebrate } from "@/src/hooks";

const function_NAME = "USE_createOneVocab";

export function USE_createOneVocab() {
  const { z_user } = z_USE_user();

  const { REFETCH_myStarterContent } = USE_refetchStarterContent();
  const { z_PREPEND_vocab, z_SET_error, z_SET_langIds, z_fetch_TYPE } =
    z_USE_myVocabs();

  const { RECOLLECT_langIds } = USE_collectMyVocabsLangIds({
    z_SET_error,
    z_SET_langIds,
  });

  const { celebrate } = USE_celebrate();

  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);
  const [createVocab_ERROR, SET_createVocabError] = useState<
    General_ERROR | FormInput_ERROR | undefined
  >();

  const _CREATE_vocab = useCallback(
    async (
      vocab_CONTENT: CreateVocabUserContent_PROPS,
      onSuccess: () => void
    ) => {
      try {
        if (IS_creatingVocab) return;
        SET_createVocabError(undefined);
        SET_isCreatingVocab(true);

        // --------------------------------------------------
        // Proceed to create vocab
        const { new_VOCAB } = await CREATE_oneVocab({
          ...vocab_CONTENT,
          user_id: z_user?.id,
        });

        // --------------------------------------------------
        // Update starter page
        await REFETCH_myStarterContent();

        // Update UI
        z_PREPEND_vocab(new_VOCAB);

        await RECOLLECT_langIds({
          fetch_TYPE: z_fetch_TYPE,
          targetList_ID: new_VOCAB?.list_id,
          user_ID: z_user?.id || "",
        });

        // Provide sensory user feedback
        celebrate(t("notification.oneVocabCreated"));

        onSuccess();
        // -----------------------------
      } catch (error: any) {
        HANDLE_formInputError(error);

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_createVocabError(err);
        SEND_internalError(err);
      } finally {
        SET_isCreatingVocab(false);
      }
    },
    [IS_creatingVocab]
  );

  return { CREATE_vocab: _CREATE_vocab, IS_creatingVocab, createVocab_ERROR };
}
