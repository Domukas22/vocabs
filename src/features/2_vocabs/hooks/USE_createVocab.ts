import { supabase } from "@/src/lib/supabase";
import { useCallback, useMemo, useState } from "react";
import {
  TranslationCreation_PROPS,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/props";

interface VocabCreation_MODEL {
  user?: User_MODEL | undefined;
  list_id?: string | undefined;
  difficulty?: 1 | 2 | 3;

  description?: string | "";
  translations: TranslationCreation_PROPS[] | undefined;
  is_public?: boolean;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
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
    list_id,
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

      if (!list_id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List ID is required for creating private vocabs 🔴",
        };
      }
    }

    try {
      SET_isCreatingVocab(true);

      // Handle vocab creation
      const vocabResponse = await HANDLE_vocabCreation({
        user_id: is_public ? null : user?.id, // user_id is null for public vocabs
        list_id: is_public ? null : list_id, // list_id is null for public vocabs
        difficulty: difficulty || 3,
        description: description || "",

        is_public,
      });

      if (!vocabResponse.success) return vocabResponse;

      const vocabData = vocabResponse.data;

      // Handle translation insertion if provided
      const finalVocab = await HANDLE_translationInsertion({
        vocabData,
        translations,
        user_id: is_public ? null : user?.id,
        is_public,
      });

      if (onSuccess) onSuccess(finalVocab);
      return { success: true, data: finalVocab };
      // ---------------------------------------------
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
  user_id: string | null | undefined;
  list_id: string | null | undefined;
  difficulty?: number;
  description?: string;

  is_public: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  try {
    const { data, error } = await supabase
      .from("vocabs")
      .insert([vocab_DATA])
      .select()
      .single();

    if (error) {
      console.log(`🔴 Error creating vocab 🔴: ${error.message}`);
      return {
        success: false,
        msg: `🔴 Error creating vocab: ${error.message} 🔴`,
      };
    }

    console.log("🟢 Vocab created successfully 🟢");
    console.log(data);

    return { success: true, data };
  } catch (error: any) {
    console.log("🔴 Error inserting vocab 🔴", error.message);
    return { success: false, msg: "🔴 Error inserting vocab 🔴" };
  }
}

// Helper function to insert translations
async function HANDLE_translationInsertion({
  vocabData,
  translations,
  user_id,
  is_public,
}: {
  vocabData: Vocab_MODEL;
  translations: TranslationCreation_PROPS[] | undefined;
  user_id: string | null | undefined;
  is_public: boolean;
}): Promise<Vocab_MODEL> {
  if (translations && translations.length > 0) {
    const { success: transSuccess, data: insertedTranslations } =
      await db_INSERT_translations(
        vocabData.id,
        user_id,
        translations,
        is_public
      );

    if (!transSuccess) throw new Error("🔴 Error inserting translations 🔴");

    console.log("🟢 Translations created successfully 🟢");
    return { ...vocabData, translations: insertedTranslations };
  }

  // Return vocab without translations if none provided
  return { ...vocabData, translations: [] };
}

// Insert translations into the database
async function db_INSERT_translations(
  vocab_id: string,
  user_id: string | null | undefined,
  translations: TranslationCreation_PROPS[],
  is_public: boolean
): Promise<{ success: boolean; data?: any }> {
  try {
    const translationPromises = translations.map((translation) => {
      const translation_DATA = {
        vocab_id,
        user_id,
        lang_id: translation.lang_id,
        text: translation.text,
        highlights: translation.highlights,
        is_public,
      };

      return supabase.from("translations").insert([translation_DATA]).select();
    });

    const results = await Promise.all(translationPromises);

    const failedTranslations = results.filter(({ error }) => error);
    if (failedTranslations.length > 0) {
      console.log("🔴 Error creating some translations 🔴", failedTranslations);
      return { success: false, data: failedTranslations };
    }

    const insertedTranslations = results.flatMap((x) => x.data);
    return { success: true, data: insertedTranslations };
  } catch (error: any) {
    console.log("🔴 Error inserting translations 🔴", error.message);
    return { success: false, data: error };
  }
}
