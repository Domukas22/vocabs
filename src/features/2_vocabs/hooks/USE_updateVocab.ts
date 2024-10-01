import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS, Vocab_MODEL } from "../../../../db/models";
import { Translation_MODEL } from "@/src/db/models";

interface VocabUpdate_MODEL {
  vocab_id: string;
  user_id?: string;
  list_id?: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
}

export default function USE_updateVocab() {
  const [IS_updatingVocab, SET_isUpdatingVocab] = useState(false);

  const UPDATE_vocab = async (
    props: VocabUpdate_MODEL,
    IS_admin: boolean,
    isPublic: boolean = false
  ): Promise<{ success: boolean; data?: any; msg?: string }> => {
    const {
      vocab_id,
      user_id,
      list_id,
      difficulty,
      description,
      image,
      translations,
    } = props;

    if (!vocab_id) {
      console.log("🔴 Vocab ID not defined when updating vocab 🔴");
      return {
        success: false,
        msg: "🔴 Vocab ID not defined when updating vocab 🔴",
      };
    }

    const isValid = VALIDATE_updateVocabInput(
      user_id,
      list_id,
      isPublic,
      IS_admin
    );
    if (!isValid.success) return isValid;

    try {
      SET_isUpdatingVocab(true);

      // Update vocab details
      const vocabResponse = await HANDLE_vocabUpdate({
        vocab_id,
        user_id,
        list_id,
        difficulty,
        description,
        image,
        IS_admin,
        isPublic,
      });
      if (!vocabResponse.success) return vocabResponse;

      const updatedVocabData = vocabResponse.data;

      // Update translations
      const updatedTranslations = await HANDLE_translationUpdate({
        vocab_id,
        translations,
        user_id,
        isPublic,
      });

      return {
        success: true,
        data: { ...updatedVocabData, translations: updatedTranslations },
      };
    } catch (error) {
      console.log("🔴 Error updating vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error updating vocab or translations 🔴",
      };
    } finally {
      SET_isUpdatingVocab(false);
    }
  };

  return { UPDATE_vocab, IS_updatingVocab };
}

// Helper function to update vocab details
async function HANDLE_vocabUpdate({
  vocab_id,
  user_id,
  list_id,
  difficulty,
  description,
  image,
  IS_admin,
  isPublic,
}: {
  vocab_id: string;
  user_id?: string;
  list_id?: string;
  difficulty?: number;
  description?: string;
  image?: string;
  IS_admin: boolean;
  isPublic: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  const vocab_DATA: {
    list_id: string | null;
    user_id: string | null;
    difficulty?: number;
    description?: string;
    image?: string;
    is_public: boolean;
  } = {
    list_id: isPublic && IS_admin ? null : list_id || null,
    user_id: isPublic && IS_admin ? null : user_id || null,
    is_public: isPublic,
    difficulty: isPublic && IS_admin ? 3 : difficulty ? difficulty : 3,
  };

  if (description) vocab_DATA.description = description;
  if (image) vocab_DATA.image = image;

  try {
    const { data, error } = await supabase
      .from("vocabs")
      .update(vocab_DATA)
      .eq("id", vocab_id)
      .select()
      .single();

    if (error) {
      console.log("🔴 Error updating vocab 🔴 : ", error);
      return { success: false, msg: "🔴 Error updating vocab 🔴" };
    }

    console.log("🟢 Vocab updated 🟢");
    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error updating vocab 🔴", error);
    return { success: false, msg: "🔴 Error updating vocab 🔴" };
  }
}

// Helper function to handle translation updates (insert, update, delete)
async function HANDLE_translationUpdate({
  vocab_id,
  translations,
  user_id,
  isPublic,
}: {
  vocab_id: string;
  translations: TranslationCreation_PROPS[];
  user_id?: string;
  isPublic: boolean;
}): Promise<Vocab_MODEL> {
  const existingTranslations = await supabase
    .from("translations")
    .select("id, lang_id")
    .eq("vocab_id", vocab_id);

  const existingLangIds =
    existingTranslations.data?.map((trans) => trans.lang_id) || [];
  const newLangIds = translations.map((trans) => trans.lang_id);

  // Insert or update translations
  const translationPromises = translations.map(async (translation) => {
    const translation_DATA = {
      vocab_id,
      user_id: isPublic ? null : user_id,
      lang_id: translation.lang_id,
      text: translation.text,
      highlights: translation.highlights,
      is_public: isPublic,
    };

    // Check if the translation exists
    const existingTranslation = await supabase
      .from("translations")
      .select("id")
      .eq("vocab_id", vocab_id)
      .eq("lang_id", translation.lang_id)
      .single();

    if (existingTranslation.data) {
      // Update the existing translation
      return supabase
        .from("translations")
        .update(translation_DATA)
        .eq("id", existingTranslation.data.id)
        .select();
    } else {
      // Insert new translation
      return supabase.from("translations").insert([translation_DATA]).select();
    }
  });

  const translationResults = await Promise.all(translationPromises);

  // Check for translation errors
  const failedTranslations = translationResults.filter(({ error }) => error);
  if (failedTranslations.length > 0) {
    console.log("🔴 Error updating some translations 🔴", failedTranslations);
    throw new Error("🔴 Error updating some translations 🔴");
  }

  // Delete translations that are no longer in the new list
  const translationsToDelete = existingLangIds.filter(
    (id) => !newLangIds.includes(id)
  );
  if (translationsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("translations")
      .delete()
      .eq("vocab_id", vocab_id)
      .in("lang_id", translationsToDelete);

    if (deleteError) {
      console.log("🔴 Error deleting old translations 🔴", deleteError);
      throw new Error("🔴 Error deleting old translations 🔴");
    }

    console.log("🟢 Old translations deleted 🟢");
  }

  const updatedTranslations = translationResults.flatMap((x) => x.data);

  console.log("🟢 Translations updated 🟢");
  return updatedTranslations;
}

// Validate input for vocab update
function VALIDATE_updateVocabInput(
  user_id: string | undefined,
  list_id: string | undefined,
  isPublic: boolean,
  IS_admin: boolean
) {
  if (isPublic && !IS_admin) {
    console.log("🔴 Only admins can make a vocab public 🔴");
    return { success: false, msg: "🔴 Only admins can make a vocab public 🔴" };
  }

  if (!isPublic) {
    if (!user_id) {
      console.log("🔴 User not defined when updating private vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when updating private vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when updating private vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when updating private vocab 🔴",
      };
    }
  }

  return { success: true };
}
