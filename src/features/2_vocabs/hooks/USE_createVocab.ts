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

interface VocabCreation_MODEL {
  user?: User_PROPS | undefined;
  list?: List_MODEL | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: TranslationCreation_PROPS[] | undefined;
  is_public?: boolean;
  onSuccess: (new_VOCAB: Vocab_PROPS) => void;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);
  const [db_ERROR, SET_error] = useState<string | null>(null);
  const RESET_dbError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to create the vocab. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const CREATE_vocab = async ({
    user,
    list,
    difficulty,
    description,
    translations,
    is_public = false,
    onSuccess,
  }: VocabCreation_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    // Initial validation checks
    if (is_public && !user?.is_admin) {
      SET_error("Only admins can create public vocabs.");
      return {
        success: false,
        msg: "🔴 Only admins can create public vocabs 🔴",
      };
    }

    if (!is_public) {
      if (!user?.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User ID is required for creating private vocabs 🔴",
        };
      }

      if (!list || !list.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List is required for creating private vocabs 🔴",
        };
      }
    }

    try {
      SET_isCreatingVocab(true);

      // Handle vocab creation
      const vocabResponse = await HANDLE_vocabCreation({
        user_id: is_public ? null : user?.id,
        list: is_public ? null : list,
        difficulty: difficulty || 3,
        description: description || "",
        is_public,
      });

      if (!vocabResponse.success) return vocabResponse;

      const vocab = vocabResponse.data;

      console.log("HERE:🔴 ", translations);
      const finalVocab = await HANDLE_translationInsertion({
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
        msg: `🔴 Unexpected error occurred during vocab creation 🔴: ${error.message}`,
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError };
}

// Helper function to create vocab
async function HANDLE_vocabCreation(vocab_DATA: {
  user_id: string;
  list: string;
  difficulty?: number;
  description?: string;
  is_public: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  try {
    const newVocab = await db.write(async () => {
      return await Vocabs_DB.create((vocab: Vocab_MODEL) => {
        vocab.user_id = vocab_DATA.user_id;
        vocab.list.set(vocab_DATA.list);
        vocab.difficulty = vocab_DATA.difficulty;
        vocab.description = vocab_DATA.description;
        vocab.is_public = vocab_DATA.is_public;
      });
    });

    console.log("🟢 Vocab created successfully 🟢");
    return { success: true, data: newVocab };
  } catch (error: any) {
    console.log("🔴 Error inserting vocab 🔴", error.message);
    return { success: false, msg: "🔴 Error inserting vocab 🔴" };
  }
}

// Helper function to insert translations
async function HANDLE_translationInsertion({
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
  if (translations && translations.length > 0) {
    console.log("HERE:🔴🔴🔴 ", translations);
    const translationPromises = translations?.map((translation) => {
      return db.write(async () => {
        return await Translations_DB.create((trans) => {
          trans.vocab.set(vocab);
          trans.user_id = user_id;
          trans.lang_id = translation.lang_id;
          trans.text = translation.text;
          trans.highlights = translation.highlights;
          trans.is_public = is_public;
        });
      });
    });

    await Promise.all(translationPromises);

    console.log("🟢 Translations created successfully 🟢");
    return { ...vocab, translations };
  }

  // Return vocab without translations if none provided
  return { ...vocab, translations: [] };
}
