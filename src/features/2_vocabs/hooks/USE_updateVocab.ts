import db, { Translations_DB, Vocabs_DB } from "@/src/db";
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
        await vocab.update((v: Vocab_MODEL) => {
          v.user_id = is_public ? null : user?.id;
          v.list.set(is_public ? null : list);
          v.difficulty = difficulty || 3;
          v.description = description || "";
          v.is_public = is_public;
          v.lang_ids = // ["en", "de"]
            incodming_TRS && incodming_TRS.length > 0
              ? incodming_TRS?.reduce((acc, tr) => {
                  if (!acc.includes(tr.lang_id)) acc.push(tr.lang_id);
                  return acc;
                }, [] as string[])
              : [];
        });

        const old_TRS = await Translations_DB.query(
          Q.where("vocab_id", vocab.id)
        ).fetch();

        old_TRS.forEach(async (old_TR) => {
          // if a tr is in the old_TRS, but not in the incodming_TRS, delete it
          const SHOULD_delete = !incodming_TRS?.some(
            (i_TR) => i_TR.lang_id === old_TR.lang_id
          );
          const updated_TR = incodming_TRS?.find(
            (tr) => tr.lang_id === old_TR.lang_id
          );

          if (SHOULD_delete) {
            await old_TR.destroyPermanently();
            return;
          } else if (updated_TR && !SHOULD_delete) {
            await old_TR.update((old_TR) => {
              old_TR.text = updated_TR.text;
              old_TR.highlights = updated_TR.highlights;
              old_TR.is_public = is_public;
            });
          }
        });

        incodming_TRS?.forEach(async (i_TR) => {
          const IS_new = !old_TRS.some((o_TR) => o_TR.lang_id === i_TR.lang_id);
          if (IS_new) {
            await Translations_DB.create((tr) => {
              tr.vocab.set(vocab);
              tr.user_id = vocab.user_id;
              tr.lang_id = i_TR.lang_id;
              tr.text = i_TR.text;
              tr.highlights = i_TR.highlights;
              tr.is_public = vocab.is_public;
            });
          }
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
