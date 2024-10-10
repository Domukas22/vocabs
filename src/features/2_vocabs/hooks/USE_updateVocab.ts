import { supabase } from "@/src/lib/supabase";
import { useCallback, useMemo, useState } from "react";
import {
  TranslationCreation_PROPS,
  User_PROPS,
  Vocab_PROPS,
} from "@/src/db/props";

interface VocabUpdate_MODEL {
  user?: User_PROPS | undefined;
  vocab_id: string | undefined;
  list_id?: string | undefined;
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
    list_id,
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
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 No vocab ID provided when updating vocab",
      };
    }

    // Initial validation checks
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

      if (!list_id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List ID is required for updating private vocabs 🔴",
        };
      }
    }

    try {
      SET_isUpdatingVocab(true);

      // Handle vocab update
      const vocabResponse = await HANDLE_vocabUpdate({
        vocab_id,
        user_id: is_public ? null : user?.id,
        list_id: is_public ? null : list_id,
        difficulty: difficulty || 3,
        description: description || "",

        is_public,
      });

      if (!vocabResponse.success) return vocabResponse;

      const vocabData = vocabResponse.data;

      // Handle translation updates if provided
      const finalVocab = await HANDLE_translationUpdate({
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
  vocab_id: string; // Used for querying, not for updating
  user_id: string | null | undefined;
  list_id: string | null | undefined;
  difficulty?: number;
  description?: string;
  is_public: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  console.log(vocab_DATA.vocab_id); // This logs the vocab_id correctly

  try {
    // Destructure to separate vocab_id from the rest of the data
    const { vocab_id, ...updateData } = vocab_DATA; // Keep vocab_id for the query only

    // Perform the update
    const { data, error } = await supabase
      .from("vocabs")
      .update(updateData) // Update only the relevant fields
      .eq("id", vocab_id) // Use vocab_id to find the row to update
      .select()
      .single();

    if (error) {
      console.log(`🔴 Error updating vocab 🔴: ${error.message}`);
      return {
        success: false,
        msg: `🔴 Error updating vocab: ${error.message} 🔴`,
      };
    }

    console.log("🟢 Vocab updated successfully 🟢");
    console.log(data);

    return { success: true, data };
  } catch (error: any) {
    console.log("🔴 Error updating vocab 🔴", error.message);
    return { success: false, msg: "🔴 Error updating vocab 🔴" };
  }
}

// Helper function to update translations
// Helper function to update translations
async function HANDLE_translationUpdate({
  vocabData,
  translations,
  user_id,
  is_public,
}: {
  vocabData: Vocab_PROPS;
  translations: TranslationCreation_PROPS[] | undefined;
  user_id: string | null | undefined;
  is_public: boolean;
}): Promise<Vocab_PROPS> {
  if (translations && translations.length > 0) {
    // Fetch existing translations for the given vocab
    const { data: existingTranslations, error } = await supabase
      .from("translations")
      .select("*")
      .eq("vocab_id", vocabData.id);

    if (error) {
      console.log("🔴 Error fetching existing translations 🔴", error.message);
      throw new Error("🔴 Error fetching existing translations 🔴");
    }

    const existingLangIds = existingTranslations.map((t: any) => t.lang_id);
    const newLangIds = translations.map((t) => t.lang_id);

    // Identify translations to delete, update, and add
    const translationsToDelete = existingTranslations.filter(
      (t: any) => !newLangIds.includes(t.lang_id)
    );
    const translationsToUpdate = translations.filter((t) =>
      existingLangIds.includes(t.lang_id)
    );
    const translationsToAdd = translations.filter(
      (t) => !existingLangIds.includes(t.lang_id)
    );

    try {
      // Handle deletion of outdated translations
      if (translationsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("translations")
          .delete()
          .in(
            "id",
            translationsToDelete.map((t: any) => t.id)
          );

        if (deleteError) {
          console.log("🔴 Error deleting translations 🔴", deleteError.message);
          throw new Error("🔴 Error deleting translations 🔴");
        }
      }

      // Handle update of existing translations
      const updatePromises = translationsToUpdate.map((translation) => {
        const translationData = {
          user_id,
          text: translation.text,
          highlights: translation.highlights,
          is_public,
        };

        return supabase
          .from("translations")
          .update(translationData)
          .eq("vocab_id", vocabData.id)
          .eq("lang_id", translation.lang_id)
          .select();
      });

      // Handle addition of new translations
      const addPromises = translationsToAdd.map((translation) => {
        const translationData = {
          vocab_id: vocabData.id,
          user_id,
          lang_id: translation.lang_id,
          text: translation.text,
          highlights: translation.highlights,
          is_public,
        };

        return supabase.from("translations").insert([translationData]).select();
      });

      // Execute all update and insert promises
      const [updatedResults, addedResults] = await Promise.all([
        Promise.all(updatePromises),
        Promise.all(addPromises),
      ]);

      // Check if any updates or inserts failed
      const failedUpdates = updatedResults.filter(({ error }) => error);
      const failedInserts = addedResults.filter(({ error }) => error);
      if (failedUpdates.length > 0 || failedInserts.length > 0) {
        console.log(
          "🔴 Error updating/inserting some translations 🔴",
          failedUpdates,
          failedInserts
        );
        throw new Error("🔴 Error updating or inserting translations 🔴");
      }

      // Merge updated and newly added translations
      const updatedTranslations = updatedResults.flatMap((x) => x.data || []);
      const insertedTranslations = addedResults.flatMap((x) => x.data || []);

      console.log("🟢 Translations updated/added successfully 🟢");
      return {
        ...vocabData,
        translations: [...updatedTranslations, ...insertedTranslations],
      };
    } catch (error: any) {
      console.log("🔴 Error updating translations 🔴", error.message);
      throw new Error("🔴 Error updating translations 🔴");
    }
  }

  // Return vocab without updating translations if none provided
  return { ...vocabData, translations: [] };
}
