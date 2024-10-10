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
    translations,
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

      // Handle vocab update
      const vocabResponse = await HANDLE_vocabUpdate({
        vocab_id,
        user_id: is_public ? null : user?.id,
        list: is_public ? null : list,
        difficulty: difficulty || 3,
        description: description || "",
        is_public,
      });

      if (!vocabResponse.success) return vocabResponse;

      const vocab = vocabResponse.data;

      const finalVocab = await HANDLE_translationUpdate({
        vocab,
        translations,
        user_id: is_public ? null : user?.id,
        is_public,
      });

      if (onSuccess) onSuccess(finalVocab);
      return { success: true, data: finalVocab };
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

// Helper function to update vocab
async function HANDLE_vocabUpdate(vocab_DATA: {
  vocab_id: string;
  user_id: string | null | undefined;
  list: string | null | undefined;
  difficulty?: number;
  description?: string;
  is_public: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  try {
    const updatedVocab = await db.write(async () => {
      const vocab = await Vocabs_DB.find(vocab_DATA.vocab_id);
      await vocab.update((vocabInstance: Vocab_MODEL) => {
        vocabInstance.user_id = vocab_DATA.user_id;
        vocabInstance.list.set(vocab_DATA.list);
        vocabInstance.difficulty = vocab_DATA.difficulty;
        vocabInstance.description = vocab_DATA.description;
        vocabInstance.is_public = vocab_DATA.is_public;
      });
      return vocab;
    });

    console.log("🟢 Vocab updated successfully 🟢");
    return { success: true, data: updatedVocab };
  } catch (error: any) {
    console.log("🔴 Error updating vocab 🔴", error.message);
    return { success: false, msg: "🔴 Error updating vocab 🔴" };
  }
}

// Helper function to update translations
async function HANDLE_translationUpdate({
  vocab,
  translations,
  user_id,
  is_public,
}: {
  vocab: Vocab_MODEL;
  translations: TranslationCreation_PROPS[] | undefined;
  user_id: string | null | undefined;
  is_public: boolean;
}): Promise<Vocab_PROPS> {
  // Fetch the current translations for this vocab
  const currentTranslations = await Translations_DB.query(
    Q.where("vocab_id", vocab.id)
  ).fetch();

  // Create a set of new lang_ids for easier lookup
  const newLangIds = new Set(translations?.map((t) => t.lang_id));

  // Delete translations that are not in the new translations
  const deletionPromises = currentTranslations
    .filter((currentTrans) => !newLangIds.has(currentTrans.lang_id))
    .map((transToDelete) =>
      db.write(async () => {
        await transToDelete.destroyPermanently();
      })
    );

  // Create or update translations based on the new translations provided
  const upsertPromises = translations?.map((newTranslation) =>
    db.write(async () => {
      // Find if there's an existing translation with the same lang_id
      const existingTranslation = currentTranslations.find(
        (trans) => trans.lang_id === newTranslation.lang_id
      );

      if (existingTranslation) {
        // Update if it exists
        await existingTranslation.update((trans) => {
          trans.text = newTranslation.text;
          trans.highlights = newTranslation.highlights;
          trans.is_public = is_public;
        });
      } else {
        // Create if it doesn't exist
        await Translations_DB.create((trans) => {
          trans.vocab.set(vocab);
          trans.user_id = user_id;
          trans.lang_id = newTranslation.lang_id;
          trans.text = newTranslation.text;
          trans.highlights = newTranslation.highlights;
          trans.is_public = is_public;
        });
      }
    })
  );

  // Execute all promises (deletions and upserts)
  await Promise.all([...deletionPromises, ...(upsertPromises || [])]);

  console.log("🟢 Translations updated successfully 🟢");
  return { ...vocab, translations };
}
