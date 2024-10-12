import db, { Vocabs_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import {
  TranslationCreation_PROPS,
  User_PROPS,
  Vocab_PROPS,
} from "@/src/db/props";
import {
  Vocab_MODEL,
  Translation_MODEL,
  List_MODEL,
} from "@/src/db/watermelon_MODELS";

import { Q } from "@nozbe/watermelondb";

interface VocabUpdate_MODEL {
  user?: User_PROPS | undefined;
  vocab_id: string | undefined;
  list?: List_MODEL | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: TranslationCreation_PROPS[] | undefined;
  is_public?: boolean;
  onSuccess: (updated_VOCAB: Vocab_PROPS) => void;
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
    user,
    vocab_id,
    list,
    difficulty,
    description,
    translations: incodming_TRS,
    is_public = false,
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

    if (is_public && !user?.is_admin) {
      SET_error("Only admins can update public vocabs.");
      return {
        success: false,
        msg: "🔴 Only admins can update public vocabs 🔴",
      };
    }

    if (!is_public) {
      if (!user?.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User ID is required for updating private vocabs 🔴",
        };
      }

      if (!list || !list.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List is required for updating private vocabs 🔴",
        };
      }
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

        await vocab.update((v: Vocab_MODEL) => {
          v.user_id = is_public ? null : user?.id;
          v.list.set(is_public ? null : list);
          v.difficulty = difficulty || 3;
          v.description = description || "";
          v.is_public = is_public;
          v.trs = incodming_TRS ? incodming_TRS : [];
          v.lang_ids = incodming_TRS
            ? incodming_TRS.map((t) => t.lang_id)?.join(",")
            : "";
          v.searchable = incodming_TRS
            ? incodming_TRS.map((t) => t.text)?.join(",")
            : "";
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
