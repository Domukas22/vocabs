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
  UPSERT_oneVocab,
  UpsertVocabUserContent_PROPS,
} from "./UPSERT_oneVocab/UPSERT_oneVocab";
import { USE_celebrate } from "@/src/hooks";
import { USE_updateListUpdatedAt } from "@/src/features_new/lists/hooks/actions/USE_updateListUpdatedAt/ USE_updateListUpdatedAt";
import { USE_recollectListLangIds } from "@/src/features_new/lists/hooks/actions/USE_recollectListLangIds/USE_recollectListLangIds";
import { Vocab_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "UPSERT_oneVocab";

export function USE_upsertOneVocab({
  type = "create",
}: {
  type: "update" | "create";
}) {
  const { z_user } = z_USE_user();

  const { REFETCH_myStarterContent } = USE_refetchStarterContent();
  const { UPDATE_listUpdatedAt } = USE_updateListUpdatedAt();

  const { z_SET_error, z_SET_langIds, z_fetch_TYPE, z_HIGHLIGHT_myVocab } =
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
  const { RECOLLECT_listCollectedLangIds } = USE_recollectListLangIds();

  const _UPSERT_oneVocab = useCallback(
    async (
      vocab_CONTENT: UpsertVocabUserContent_PROPS,
      onSuccess: () => void
    ) => {
      try {
        if (IS_creatingVocab) return;
        SET_createVocabError(undefined);
        SET_isCreatingVocab(true);

        // --------------------------------------------------
        // Proceed to create vocab
        const { new_VOCAB } = await UPSERT_oneVocab({
          ...vocab_CONTENT,
          user_id: z_user?.id,
        });

        // --------------------------------------------------

        await RECOLLECT_listCollectedLangIds(new_VOCAB?.list_id);
        // await UPDATE_listUpdatedAt(new_VOCAB?.list_id);

        await RECOLLECT_langIds({
          fetch_TYPE: z_fetch_TYPE,
          targetList_ID: new_VOCAB?.list_id,
          user_ID: z_user?.id || "",
        });

        // Update starter page
        await REFETCH_myStarterContent();

        if (type === "create") {
          Vocab_EVENTS.emit("created", new_VOCAB);
        }

        if (type === "update") {
          Vocab_EVENTS.emit("updated", {
            vocab: new_VOCAB,
            type: "full",
          });
        }

        // Provide sensory user feedback
        celebrate(
          type === "create"
            ? t("notification.oneVocabCreated")
            : t("notification.oneVocabUpdate")
        );

        z_HIGHLIGHT_myVocab(new_VOCAB?.id);

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

  return {
    UPSERT_oneVocab: _UPSERT_oneVocab,
    IS_creatingVocab,
    createVocab_ERROR,
  };
}
