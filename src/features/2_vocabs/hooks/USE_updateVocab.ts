import db, { Vocabs_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import { tr_PROPS } from "@/src/db/props";
import {
  Vocab_MODEL,
  User_MODEL,
  List_MODEL,
} from "@/src/db/watermelon_MODELS";

import { Q } from "@nozbe/watermelondb";

interface VocabUpdate_MODEL {
  user?: User_MODEL | undefined;
  vocab_id: string | undefined;
  list?: List_MODEL | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: tr_PROPS[] | undefined;
  is_public?: boolean;
  onSuccess: (updated_VOCAB: Vocab_MODEL) => void;
}

export default function USE_updateVocab() {
  const [IS_updatingVocab, SET_isUpdatingVocab] = useState(false);
  const [db_ERROR, SET_error] = useState<string | null>(null);
  const RESET_dbError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to update the vocab. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const UPDATE_vocab = async ({
    vocab_id,
    list,
    difficulty,
    description,
    translations: incodming_TRS,
    onSuccess,
  }: VocabUpdate_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    // Initial validation checks
    if (!vocab_id) {
      SET_error("Vocab ID is required for updating.");
      return {
        success: false,
        msg: "🔴 No vocab ID provided when updating vocab",
      };
    }

    if (!list || !list.id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 List is required for updating private vocabs 🔴",
      };
    }

    try {
      SET_isUpdatingVocab(true);

      const updatedVocab = await db.write(async () => {
        const vocab = await Vocabs_DB.find(vocab_id);

        let trs = [];

        if (incodming_TRS) {
          // Process the incoming translations (incodming_TRS) with the current translations (trs)

          // Update existing translations or delete if not found in incodming_TRS
          trs = trs
            .filter((existingTR) => {
              const updated_TR = incodming_TRS.find(
                (tr) => tr.lang_id === existingTR.lang
              );

              if (!updated_TR) {
                // Translation not found in incoming, so it should be removed
                return false; // Filter out
              } else {
                // Update existing translation with new data
                existingTR.text = updated_TR.text;
                existingTR.highlights = updated_TR.highlights;
                return true; // Keep this translation
              }
            })
            .concat(
              // Add new translations that are not present in the existing trs
              incodming_TRS
                .filter(
                  (i_TR) =>
                    !trs.some((existingTR) => existingTR.lang === i_TR.lang_id)
                )
                .map((new_TR) => ({
                  lang: new_TR.lang_id,
                  text: new_TR.text,
                  highlights: new_TR.highlights || [],
                }))
            );
        }

        await vocab.update((vocab: Vocab_MODEL) => {
          vocab.list_id = list?.id;
          vocab.difficulty = difficulty || 3;
          vocab.description = description || "";
          vocab.trs = incodming_TRS || [];
          vocab.lang_ids =
            incodming_TRS?.map((t) => t.lang_id)?.join(",") || "";
          vocab.searchable = incodming_TRS?.map((t) => t.text)?.join(",") || "";
        });

        return vocab;
      });

      if (onSuccess) onSuccess(updatedVocab);
      return { success: true, data: updatedVocab };
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during vocab update 🔴: ${error.message}`,
      };
    } finally {
      SET_isUpdatingVocab(false);
    }
  };

  return { UPDATE_vocab, IS_updatingVocab, db_ERROR, RESET_dbError };
}
